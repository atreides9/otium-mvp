import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const KAKAO_API_KEY = Deno.env.get('KAKAO_API_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

interface TasteProfile {
  user_id: string;
  completed_count: number;
  genre_distribution: Record<string, number>;
  high_rated_titles: string[];
}

interface KakaoBook {
  isbn: string;
  title: string;
  authors: string[];
  thumbnail: string;
  publisher: string;
  datetime: string;
  contents: string;
}

interface Recommendation {
  isbn: string;
  reason: string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let user_id: string;
  try {
    const body = await req.json();
    user_id = body.user_id;
    if (!user_id) throw new Error('missing user_id');
  } catch {
    return new Response(JSON.stringify({ error: 'invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Load taste profile
  const { data: profile, error: profileError } = await supabase
    .from('taste_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (profileError || !profile) {
    console.error('taste_profile fetch error:', profileError);
    return new Response(JSON.stringify({ error: 'taste_profile_not_found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tasteProfile = profile as TasteProfile;

  // 2. Pull candidate books from Kakao API
  const genreEntries = Object.entries(tasteProfile.genre_distribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  const topGenres = genreEntries.map(([genre]) => genre);

  // Get already-read ISBNs
  const { data: readRecords, error: readError } = await supabase
    .from('reading_records')
    .select('isbn')
    .eq('user_id', user_id);

  if (readError) {
    console.error('reading_records fetch error:', readError);
    return new Response(JSON.stringify({ error: 'database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const readIsbns = new Set((readRecords ?? []).map((r: { isbn: string }) => r.isbn));

  let candidateBooks: KakaoBook[] = [];
  for (const genre of topGenres) {
    try {
      const kakaoRes = await fetch(
        `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(genre)}&size=10`,
        { headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` } }
      );
      if (!kakaoRes.ok) {
        console.error('Kakao API error:', kakaoRes.status, await kakaoRes.text());
        return new Response(JSON.stringify({ error: 'kakao api error' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const kakaoData = await kakaoRes.json();
      const books: KakaoBook[] = (kakaoData.documents ?? []).filter(
        (b: KakaoBook) => b.isbn && !readIsbns.has(b.isbn)
      );
      candidateBooks = candidateBooks.concat(books);
    } catch (err) {
      console.error('Kakao API fetch exception:', err);
      return new Response(JSON.stringify({ error: 'kakao api error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Deduplicate by isbn
  const seen = new Set<string>();
  candidateBooks = candidateBooks.filter((b) => {
    if (seen.has(b.isbn)) return false;
    seen.add(b.isbn);
    return true;
  });

  const candidatesJson = JSON.stringify(
    candidateBooks.map((b) => ({
      isbn: b.isbn,
      title: b.title,
      authors: b.authors,
      publisher: b.publisher,
      contents: b.contents?.slice(0, 100),
    }))
  );

  // 3. Call Claude API
  const userPrompt = `User reading profile:

Completed books: ${tasteProfile.completed_count}
Genre distribution: ${JSON.stringify(tasteProfile.genre_distribution)}
Highly rated (4+): ${JSON.stringify(tasteProfile.high_rated_titles ?? [])}

Candidate books (pick exactly 4):
${candidatesJson}

Return JSON:
{"recommendations":[{"isbn":"...","reason":"20자 이내 추천 이유"}]}`;

  let recommendations: Recommendation[];
  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 512,
        system: 'You are a book curator. Return only valid JSON. No markdown.',
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!claudeRes.ok) {
      console.error('Claude API error:', claudeRes.status, await claudeRes.text());
      return new Response(JSON.stringify({ error: 'claude api error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const claudeData = await claudeRes.json();
    const rawText: string = claudeData.content?.[0]?.text ?? '';
    const parsed = JSON.parse(rawText);
    recommendations = parsed.recommendations;

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('invalid recommendations format');
    }
    recommendations = recommendations.slice(0, 4);
  } catch (err) {
    console.error('Claude API exception:', err);
    return new Response(JSON.stringify({ error: 'claude api error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Save to recommendations table
  const shownAt = new Date().toISOString();
  const nextAvailableAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const rows = recommendations.map((r) => ({
    user_id,
    book_id: r.isbn,
    reason_copy: r.reason,
    shown_at: shownAt,
    next_available_at: nextAvailableAt,
  }));

  const { error: insertError } = await supabase.from('recommendations').insert(rows);

  if (insertError) {
    console.error('recommendations insert error:', insertError);
    return new Response(JSON.stringify({ error: 'database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. Build full metadata response
  const bookMap = new Map(candidateBooks.map((b) => [b.isbn, b]));
  const responseBooks = recommendations.map((r) => {
    const meta = bookMap.get(r.isbn);
    return {
      isbn: r.isbn,
      reason: r.reason,
      title: meta?.title ?? '',
      authors: meta?.authors ?? [],
      thumbnail: meta?.thumbnail ?? '',
      publisher: meta?.publisher ?? '',
      contents: meta?.contents ?? '',
    };
  });

  return new Response(
    JSON.stringify({ recommendations: responseBooks, next_available_at: nextAvailableAt }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
