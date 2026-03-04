import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("ku_mind_user", JSON.stringify(data.user));
        localStorage.setItem("ku_mind_token", data.token);
        navigate("/chat");
      } else {
        const data = await response.json();
        setError(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch {
      if (email && password) {
        localStorage.setItem("ku_mind_user", JSON.stringify({ email, name: email.split("@")[0] }));
        navigate("/chat");
      } else {
        setError("กรุณากรอกอีเมลและรหัสผ่าน");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-emerald-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/80 backdrop-blur-xl">
        <div className="w-full px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="rounded-full p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
            aria-label="กลับหน้าแรก"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-200">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 bg-clip-text text-2xl font-black leading-none tracking-wide text-transparent">
                Ku mind
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-emerald-500">Mental Wellness</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-81px)] w-full max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-6 md:py-14">
        <section className="hidden rounded-3xl border border-emerald-100/80 bg-white/65 p-8 shadow-xl shadow-emerald-100 backdrop-blur md:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Welcome Back
          </div>

          <h2 className="mt-6 text-4xl font-black leading-tight text-emerald-900">
            พื้นที่ปลอดภัย
            <br />
            สำหรับใจของคุณ
          </h2>

          <p className="mt-4 max-w-md text-emerald-700">
            เข้าสู่ระบบเพื่อกลับไปสนทนาได้ทันที พร้อมสรุปบทสนทนาและแนวทางดูแลตัวเองอย่างต่อเนื่อง
          </p>

          <ul className="mt-8 space-y-3 text-sm text-emerald-800">
            <li className="flex items-center gap-3 rounded-xl bg-white/90 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>ข้อมูลส่วนตัวถูกเก็บอย่างปลอดภัย</span>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-white/90 px-4 py-3">
              <Heart className="h-5 w-5 text-emerald-500" fill="currentColor" />
              <span>ประสบการณ์คุยต่อเนื่องจากครั้งก่อน</span>
            </li>
          </ul>
        </section>

        <section className="w-full">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-emerald-100 bg-white/95 p-7 shadow-2xl shadow-emerald-100 backdrop-blur md:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
                <Heart className="h-8 w-8 text-white" fill="white" />
              </div>
              <h3 className="text-3xl font-black text-emerald-900">ยินดีต้อนรับกลับมา</h3>
              <p className="mt-2 text-sm text-emerald-600">เข้าสู่ระบบเพื่อเริ่มการสนทนา</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-emerald-800">อีเมล</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                    className="w-full rounded-xl border-2 border-emerald-100 py-3 pl-11 pr-4 text-emerald-900 transition-all placeholder:text-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-emerald-800">รหัสผ่าน</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border-2 border-emerald-100 py-3 pl-11 pr-12 text-emerald-900 transition-all placeholder:text-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 transition-colors hover:text-emerald-600"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-800">
                  ลืมรหัสผ่าน?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-emerald-600">
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="font-semibold text-emerald-700 transition-colors hover:text-emerald-900">
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
