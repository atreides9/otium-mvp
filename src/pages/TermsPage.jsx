import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './SubPage.module.css';

const SECTIONS = [
  {
    title: '서비스 이용약관',
    content:
      '오티움(Otium) 서비스를 이용해 주셔서 감사합니다. 본 약관은 오티움 앱 서비스의 이용 조건 및 절차, 이용자와 회사의 권리·의무 및 책임사항에 관한 사항을 규정합니다. 서비스를 이용하시면 본 약관에 동의하신 것으로 간주합니다.',
  },
  {
    title: '개인정보 처리방침',
    content:
      '오티움은 사용자의 개인정보를 소중히 여기며, 관련 법령에 따라 개인정보를 보호합니다.\n\n수집 항목: 이메일 주소, 닉네임, 독서 기록\n수집 목적: 서비스 제공 및 개선\n보유 기간: 회원 탈퇴 시까지',
  },
  {
    title: '마케팅 정보 수신 동의',
    content:
      '신규 기능 출시, 이벤트, 도서 추천 정보를 이메일 또는 앱 알림으로 받아보실 수 있습니다. 앱 내 알림 설정에서 언제든지 수신 여부를 변경하실 수 있습니다.',
  },
];

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>약관 및 정책</h1>
      </header>
      <div className={styles.scroll}>
        {SECTIONS.map((section) => (
          <div key={section.title} className={styles.card}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
              {section.title}
            </p>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
