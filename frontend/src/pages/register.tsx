import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("ku_mind_user", JSON.stringify(data.user));
        localStorage.setItem("ku_mind_token", data.token);
        navigate("/chat");
      } else {
        const data = await response.json();
        setError(data.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      // Demo mode
      localStorage.setItem(
        "ku_mind_user",
        JSON.stringify({ email: form.email, name: form.name })
      );
      navigate("/chat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="w-full px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide leading-none bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 bg-clip-text text-transparent">
                Ku mind
              </h1>
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-500 mt-1">
                Mental Wellness
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100 border border-emerald-100 p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <Heart className="w-8 h-8 text-white" fill="white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-emerald-900 text-center mb-2">
              สร้างบัญชีใหม่
            </h2>
            <p className="text-emerald-600 text-center text-sm mb-8">
              เริ่มต้นดูแลสุขภาพจิตของคุณวันนี้
            </p>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* ชื่อ */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-1.5">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="กรอกชื่อของคุณ"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-400 focus:outline-none transition-colors text-emerald-900 placeholder:text-emerald-300"
                />
              </div>

              {/* อีเมล */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-1.5">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-400 focus:outline-none transition-colors text-emerald-900 placeholder:text-emerald-300"
                />
              </div>

              {/* รหัสผ่าน */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-1.5">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-400 focus:outline-none transition-colors text-emerald-900 placeholder:text-emerald-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* ยืนยันรหัสผ่าน */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-1.5">
                  ยืนยันรหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-400 focus:outline-none transition-colors text-emerald-900 placeholder:text-emerald-300 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-emerald-600">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}