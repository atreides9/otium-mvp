import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { useAuthStore } from './store/authStore';
import './styles/global.css';
import LibraryPage from './pages/LibraryPage';
import SearchPage from './pages/SearchPage';
import RecordPage from './pages/RecordPage';
import RecordStatsPage from './pages/RecordStatsPage';
import ExplorePage from './pages/ExplorePage';
import RecommendDetailPage from './pages/RecommendDetailPage';
import MyPage from './pages/MyPage';
import FriendsPage from './pages/FriendsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function AuthInit({ children }) {
  const init = useAuthStore((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return children;
}

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthInit>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
            <Route path="/" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/record/:isbn" element={<ProtectedRoute><RecordPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
            <Route path="/explore/recommend/:id" element={<ProtectedRoute><RecommendDetailPage /></ProtectedRoute>} />
            <Route path="/explore/rec-detail" element={<ProtectedRoute><RecommendDetailPage /></ProtectedRoute>} />
            <Route path="/record-stats" element={<ProtectedRoute><RecordStatsPage /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
          </Routes>
        </AuthInit>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
