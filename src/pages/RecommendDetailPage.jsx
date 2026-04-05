import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../components/Toast';
import styles from './RecommendDetailPage.module.css';

const MOCK_RECOMMEND_BOOKS = [
  {
    id: '1',
    title: '사랑의 기술',
    author: '에리히 프롬',
    publisher: '문예출판사',
    thumbnail: 'https://covers.openlibrary.org/b/isbn/9780062138927-M.jpg',
    quote: '"사랑은 기술이다. 배우지 않으면 할 수 없다."',
    aiReason: '인문/철학 장르를 자주 읽고, 유발 하라리의 책을 좋아하는 오티움님께 추천해요. 인간의 본질적인 감정을 탐구하는 이 책은 분명 깊은 울림을 줄 거예요.',
    tags: ['인문', '철학', '심리'],
    description: '에리히 프롬의 대표작으로, 사랑을 하나의 기술로 바라보는 독창적인 시각을 제시합니다. 사랑에 빠지는 것이 아니라 사랑을 실천하는 능력을 키워야 한다는 메시지를 담고 있습니다. 출간 이후 수십 년간 전 세계 독자들에게 꾸준히 읽히는 고전 중의 고전입니다.',
    tableOfContents: [
      '1 사랑은 기술인가',
      '2 사랑의 이론',
      '3 부모와 자식 사이의 사랑',
      '4 사랑의 대상들',
      '5 에로틱한 사랑',
      '6 자기애',
      '7 신에 대한 사랑',
      '8 현대 서구 사회에서의 사랑의 붕괴',
      '9 사랑의 실천',
    ],
  },
  {
    id: '2',
    title: '물고기는 존재하지 않는다',
    author: '룰루 밀러',
    publisher: '곰출판',
    thumbnail: 'https://covers.openlibrary.org/b/isbn/9781501160271-M.jpg',
    quote: '"혼돈은 항상 이긴다. 하지만 그게 끝이 아니다."',
    aiReason: '과학과 에세이 장르를 넘나드는 책을 즐기는 오티움님께 딱 맞아요. 상실과 집착, 삶의 의미를 과학적 시각으로 풀어낸 이 책은 읽고 나면 세계를 다르게 보게 됩니다.',
    tags: ['과학', '에세이', '철학'],
    description: '워싱턴포스트 기자이자 NPR 라디오 진행자인 룰루 밀러가 쓴 논픽션. 19세기 물고기 분류학자 데이비드 스타 조던의 삶을 따라가며 혼돈 속에서 의미를 찾는 방법을 탐구합니다. 과학, 철학, 자전적 에세이가 뒤섞인 독특한 형식의 책입니다.',
    tableOfContents: [
      '1 상실',
      '2 집착',
      '3 물고기를 찾아서',
      '4 질서라는 환상',
      '5 혼돈이 이기는 방식',
      '6 그럼에도 불구하고',
      '작가의 말',
    ],
  },
  {
    id: '3',
    title: '브람스를 좋아하세요',
    author: '프랑수아즈 사강',
    publisher: '민음사',
    thumbnail: 'https://covers.openlibrary.org/b/isbn/9780140020229-M.jpg',
    quote: '"나이 든다는 것은 더 이상 놀라지 않는 법을 배우는 것이다."',
    aiReason: '소설 장르 비중이 높고 감성적인 문체를 좋아하는 오티움님께 추천해요. 짧지만 여운이 긴 이 소설은 사랑과 고독, 선택의 무게를 섬세하게 담아냅니다.',
    tags: ['소설', '로맨스', '고전'],
    description: '프랑수아즈 사강의 대표 중편소설. 서른아홉의 폴과 스물다섯의 시몽, 그리고 폴의 연인 로제 사이의 삼각관계를 통해 나이 듦과 사랑, 선택의 문제를 탐구합니다. 브람스의 음악처럼 쓸쓸하고 아름다운 문체가 특징입니다.',
    tableOfContents: ['1부', '2부', '3부', '옮긴이의 말'],
  },
  {
    id: '4',
    title: '먹',
    author: '강지혜',
    publisher: '창비',
    thumbnail: 'https://covers.openlibrary.org/b/isbn/9784103534310-M.jpg',
    quote: '"내 삶의 무게는 너무 많다. 거자써 한알 심을 만한 깊이도 없다. 이렇게 살아도 되는 것일까."',
    aiReason: '에세이를 자주 읽고 내면의 이야기에 공감하는 오티움님께 어울려요. 일상의 균열을 솔직하게 담은 이 에세이는 읽는 내내 자신을 돌아보게 만듭니다.',
    tags: ['에세이', '일상', '감성'],
    description: '작가 강지혜의 첫 에세이집. 완벽하지 않은 일상, 관계의 피로, 자기 자신과의 화해를 솔직한 언어로 풀어냈습니다. 밑줄 긋고 싶은 문장이 페이지마다 등장하는 책입니다.',
    tableOfContents: ['1장 먹', '2장 균열', '3장 관계', '4장 회복', '작가의 말'],
  },
];

export { MOCK_RECOMMEND_BOOKS };

export default function RecommendDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const book = MOCK_RECOMMEND_BOOKS.find((b) => b.id === id);

  if (!book) {
    return (
      <div className={styles.notFound}>
        <p>책 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} color="var(--color-text-primary)" />
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.headerTitle}>{book.title}</span>
          <span className={styles.headerAuthor}>{book.author}</span>
        </div>
        <button className={styles.nextBtn} onClick={() => showToast('준비중입니다')}>
          다음
        </button>
      </header>

      {/* Hero Section */}
      <div className={styles.hero}>
        <p className={styles.quote}>{book.quote}</p>
        <div className={styles.heroDivider} />

        {/* Book Info Row */}
        <div className={styles.bookInfoRow}>
          <img
            className={styles.thumbnail}
            src={book.thumbnail}
            alt={book.title}
            onError={(e) => { e.target.style.visibility = 'hidden'; }}
          />
          <div className={styles.bookInfoText}>
            <p className={styles.aiReason}>{book.aiReason}</p>
            <div className={styles.tags}>
              {book.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* White Content Area */}
      <div className={styles.content}>
        {/* 책소개 */}
        <section>
          <h2 className={styles.sectionLabel}>책소개</h2>
          <p className={styles.description}>{book.description}</p>
        </section>

        <div className={styles.divider} />

        {/* 목차 */}
        <section>
          <h2 className={styles.sectionLabel}>목차</h2>
          <ul className={styles.toc}>
            {book.tableOfContents.map((item) => (
              <li key={item} className={styles.tocItem}>{item}</li>
            ))}
          </ul>
        </section>

        <div className={styles.divider} />

        {/* 피드백 */}
        <section className={styles.feedbackSection}>
          <p className={styles.feedbackLabel}>추천이 마음에 드나요?</p>
          <div className={styles.feedbackButtons}>
            <button className={styles.btnDislike} onClick={() => showToast('준비중입니다')}>
              별로예요
            </button>
            <button className={styles.btnLike} onClick={() => showToast('준비중입니다')}>
              마음에 들어요!
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
