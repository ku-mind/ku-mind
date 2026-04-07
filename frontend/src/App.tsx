import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Chat from "./pages/chat";
import CheckIn from "./pages/checkin";
import Insights from "./pages/insights";
import LearnMore from "./pages/learn-more";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import ConsentModal from "./components/ConsentModal";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn =
    localStorage.getItem("ku_mind_user") !== null &&
    localStorage.getItem("ku_mind_token") !== null;
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("ku_mind_consent");
    if (!consented) setShowConsent(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ku_mind_consent", "true");
    setShowConsent(false);
  };

  const handleDecline = () => {
    // ส่ง user กลับ home แล้วแจ้งว่าใช้งานไม่ได้
    setShowConsent(false);
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      {showConsent && (
        <ConsentModal onAccept={handleAccept} onDecline={handleDecline} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/checkin"
          element={
            <PrivateRoute>
              <CheckIn />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <PrivateRoute>
              <Insights />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
