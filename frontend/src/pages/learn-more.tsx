import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Heart,
  Lock,
  MessageCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LearnMore() {
  const navigate = useNavigate();

  const pillars = [
    {
      icon: MessageCircle,
      title: "คุยกับ KU Mind",
      body: "เล่าเรื่องที่อยู่ในใจ แล้วระบบช่วยสะท้อนความรู้สึก จัดลำดับความคิด และเสนอขั้นตอนเล็ก ๆ ที่ทำต่อได้",
    },
    {
      icon: Activity,
      title: "Check-in สุขภาพใจ",
      body: "ประเมินภาระงาน ชั่วโมงนอน ความเหนื่อย เดดไลน์ แรงกดดัน และอารมณ์ เพื่อดูภาพรวมของวันนี้",
    },
    {
      icon: BarChart3,
      title: "Dashboard แนวโน้ม",
      body: "ดูคะแนนย้อนหลัง Mood trend Sleep trend และ Deadline trend จากประวัติ check-in ล่าสุดของแต่ละวัน",
    },
    {
      icon: Shield,
      title: "แหล่งช่วยเหลือจริง",
      body: "เมื่ออยากคุยกับคนตัวเป็น ๆ ระบบมีลิงก์ไป KU Happy Place และย้ำว่าระบบไม่ทดแทนผู้เชี่ยวชาญ",
    },
  ];

  const dataItems = [
    "ข้อมูลบัญชีสำหรับแยกประวัติของแต่ละผู้ใช้",
    "ข้อความแชทและหัวข้อสนทนา เพื่อให้กลับมาอ่านประวัติเดิมได้",
    "ผล check-in เช่น คะแนนความเสี่ยง การนอน อารมณ์ เดดไลน์ และคำแนะนำ",
    "ข้อมูลแนวโน้ม 7 วัน สำหรับทำกราฟและรายงาน PDF",
  ];

  const flow = [
    "สมัครหรือเข้าสู่ระบบ",
    "ยืนยันความยินยอมก่อนใช้งาน",
    "ทำ check-in หรือเริ่มคุยกับ KU Mind",
    "ดูแนวโน้มสุขภาพใจใน Insights",
    "บันทึกรายงาน PDF เพื่อใช้ประกอบการคุยกับ counselor หรืออาจารย์ที่ปรึกษา",
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#d9fff3_0%,_#e7fffb_42%,_#f5fbfb_100%)] text-emerald-950">
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าแรก
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
              <Heart className="h-5 w-5" fill="white" />
            </div>
            <div className="text-right">
              <p className="text-lg font-black leading-none text-emerald-900">KU Mind</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-emerald-500">Project Guide</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <section className="rounded-3xl border border-emerald-100 bg-white/85 p-6 shadow-2xl shadow-emerald-100/80 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <Sparkles className="h-4 w-4" />
                ภาพรวมระบบแบบละเอียด
              </div>
              <h1 className="text-4xl font-black leading-tight text-emerald-950 md:text-6xl">
                KU Mind ทำงานยังไง
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-emerald-700">
                ระบบนี้ช่วยให้ผู้ใช้เล่าความรู้สึก ทำ check-in ดูแนวโน้มย้อนหลัง และเตรียมข้อมูลสำหรับคุยกับคนที่ช่วยเหลือได้จริง
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/checkin")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-bold text-white shadow-xl shadow-emerald-100 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
                >
                  ทำ Check-in
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-emerald-200 bg-white px-6 py-3 font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  เริ่มการสนทนา
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-emerald-950 p-6 text-white shadow-2xl shadow-emerald-200">
              <Brain className="h-10 w-10 text-emerald-200" />
              <h2 className="mt-5 text-2xl font-black">ไม่ใช่ระบบวินิจฉัย</h2>
              <p className="mt-3 leading-relaxed text-emerald-50">
                KU Mind เป็น companion สำหรับสะท้อนความรู้สึกและจัดระเบียบความคิดเบื้องต้น ถ้ามีความเสี่ยงสูงหรืออยากคุยกับคนจริง ควรติดต่อผู้เชี่ยวชาญหรือ KU Happy Place
              </p>
              <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-emerald-50">
                ข้อมูลของคุณจะถูกเก็บอย่างเป็นส่วนตัวและไม่ถูกเผยแพร่
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((item) => (
            <article key={item.title} className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-100">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-emerald-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-emerald-700">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/60 md:p-8">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-black text-emerald-950">ข้อมูลที่ระบบใช้</h2>
            </div>
            <div className="mt-6 space-y-4">
              {dataItems.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="font-semibold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/60 md:p-8">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-black text-emerald-950">ลำดับการใช้งาน</h2>
            </div>
            <div className="mt-6 space-y-4">
              {flow.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                    {index + 1}
                  </span>
                  <p className="pt-1 font-semibold leading-relaxed text-emerald-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/60 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-500">When to get human support</p>
              <h2 className="mt-2 text-3xl font-black text-emerald-950">เมื่ออยากคุยกับคนจริง</h2>
              <p className="mt-3 leading-relaxed text-emerald-700">
                ถ้าสิ่งที่เจอหนักเกินกว่าจะคุยกับระบบ หรืออยากให้มีคนช่วยรับฟังโดยตรง ให้ติดต่อ KU Happy Place
              </p>
            </div>
            <a
              href="https://kuhappyplace.sa.ku.ac.th/Exqe/Login/Login.php"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-500 px-6 py-4 text-center font-black text-white shadow-xl shadow-emerald-100 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              ติดต่อ KU Happy Place
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
