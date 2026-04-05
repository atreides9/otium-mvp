import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const KAKAO_API_KEY = Deno.env.get('KAKAO_API_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface BookRecord {
  kakao_isbn: string;
  title: string;
  author: string;
  rating: number | null;
  status: string;
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Verify JWT and extract user_id from token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const user_id = user.id;

  // 1. Load user's book_records
  const { data: allRecords, error: recordsError } = await supabase
    .from('book_records')
    .select('kakao_isbn, title, author, rating, status')
    .eq('user_id', user_id);

  if (recordsError) {
    console.error('book_records fetch error:', recordsError);
    return new Response(JSON.stringify({ error: 'database error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const records: BookRecord[] = allRecords ?? [];
  const completedBooks = records.filter((r) => r.status === '완독');
  const highRatedTitles = completedBooks
    .filter((r) => r.rating != null && r.rating >= 4)
    .map((r) => r.title);

  // Already-read ISBNs (all statuses)
  const readIsbns = new Set(records.map((r) => r.kakao_isbn).filter(Boolean));

  // 2. Build Kakao search queries from top-rated authors, or fallback
  const topAuthors = [
    ...new Set(
      completedBooks
        .filter((r) => r.rating != null && r.rating >= 4)
        .map((r) => r.author)
        .filter(Boolean)
    ),
  ].slice(0, 2);

  const searchQueries = topAuthors.length > 0 ? topAuthors : ['베스트셀러 소설', '자기계발'];

  // 3. Pull candidate books from Kakao API
  let candidateBooks: KakaoBook[] = [];
  for (const query of searchQueries) {
    try {
      const kakaoRes = await fetch(
        `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(query)}&size=10`,
        { headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` } }
      );
      if (!kakaoRes.ok) {
        console.error('Kakao API error:', kakaoRes.status, await kakaoRes.text());
        return new Response(JSON.stringify({ error: 'kakao api error' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

  if (candidateBooks.length === 0) {
    return new Response(JSON.stringify({ error: 'no_candidates' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const candidatesJson = JSON.stringify(
    candidateBooks.map((b) => ({
      isbn: b.isbn,
      title: b.title,
      authors: b.authors,
      publisher: b.publisher,
      contents: b.contents?.slice(0, 100),
    }))
  );

  // 4. Call Claude API
  const userPrompt = `User reading profile:

Completed books: ${completedBooks.length}
Highly rated (4+): ${JSON.stringify(highRatedTitles)}

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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: 'You are a book curator. Return only valid JSON. No markdown.',
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!claudeRes.ok) {
      console.error('Claude API error:', claudeRes.status, await claudeRes.text());
      return new Response(JSON.stringify({ error: 'claude api error' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 5. Save to recommendations table
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 6. Build full metadata response
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
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
