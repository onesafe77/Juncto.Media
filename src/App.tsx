/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import WorkspaceHome from './pages/WorkspaceHome';
import ArticleDetail from './pages/ArticleDetail';
import Investigasi from './pages/Investigasi';
import InvestigasiDetail from './pages/InvestigasiDetail';
import Kebijakan from './pages/Kebijakan';
import Anggaran from './pages/Anggaran';
import Hukum from './pages/Hukum';
import Keadilan from './pages/Keadilan';
import AILegal from './pages/AILegal';
import DokumenHukum from './pages/DokumenHukum';
import Settings from './pages/Settings';
import Bookmarks from './pages/Bookmarks';
import History from './pages/History';
import Notifications from './pages/Notifications';
import PengaduanPage from './pages/PengaduanPage';
import KartuAnggota from './pages/KartuAnggota';
import ValidasiPublik from './pages/ValidasiPublik';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/validasi" element={<ValidasiPublik />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/workspace" element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }>
          <Route index element={<WorkspaceHome />} />
          <Route path="article/:id" element={<ArticleDetail />} />
          <Route path="investigasi" element={<Investigasi />} />
          <Route path="investigasi/:id" element={<InvestigasiDetail />} />
          <Route path="kebijakan" element={<Kebijakan />} />
          <Route path="anggaran" element={<Anggaran />} />
          <Route path="hukum" element={<Hukum />} />
          <Route path="keadilan" element={<Keadilan />} />
          <Route path="ai-legal" element={<AILegal />} />
          <Route path="dokumen" element={<DokumenHukum />} />
          <Route path="settings" element={<Settings />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="history" element={<History />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="pengaduan" element={<PengaduanPage />} />
          <Route path="kartu-anggota" element={<KartuAnggota />} />
        </Route>
      </Routes>
    </Router>
  );
}
