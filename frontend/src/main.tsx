import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || "Unknown runtime error",
    };
  }

  componentDidCatch(error: Error) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "24px",
            fontFamily: "Noto Sans Thai, sans-serif",
            background: "#fff7f7",
            color: "#7f1d1d",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px" }}>เกิดข้อผิดพลาดขณะโหลดหน้าเว็บ</h1>
          <p style={{ marginTop: "12px" }}>
            กรุณาเปิด DevTools Console แล้วส่งข้อความ error นี้มา:
          </p>
          <pre
            style={{
              marginTop: "12px",
              padding: "12px",
              background: "#fee2e2",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {this.state.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
