import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./auth/login";
import ContentGenerationPage from "./pages/GenerateContent";
import InvitationsPage from "./auth/invitations";
import PromotionPage from "./pages/PromotionPage";
import { MainLayout, AuthLayout } from "./components/layout/layout";
import InviteAcceptPage from "./auth/registration";
import DocumentationPage from "./pages/DocumentationPage";
import { ToastProvider } from "./components/ToastProvider";
const App = () => {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/seo" element={<PromotionPage />} />
          <Route path="/generate/content" element={<ContentGenerationPage />} />
          <Route path="/" element={<DocumentationPage />}></Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/invitations" element={<InvitationsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/invite/accept" element={<InviteAcceptPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
};

export default App;
