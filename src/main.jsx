import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import './styles/global.css';
import LibraryPage from './pages/LibraryPage';
import SearchPage from './pages/SearchPage';
import RecordPage from './pages/RecordPage';
import RecordStatsPage from './pages/RecordStatsPage';
import ExplorePage from './pages/ExplorePage';
import RecommendDetailPage from './pages/RecommendDetailPage';
import MyPage from './pages/MyPage';
import FriendsPage from './pages/FriendsPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/record/:isbn" element={<RecordPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/recommend/:id" element={<RecommendDetailPage />} />
          <Route path="/record-stats" element={<RecordStatsPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
