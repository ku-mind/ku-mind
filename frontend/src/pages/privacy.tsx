import { ArrowLeft, CheckCircle, Heart, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();

  const items = [
    {
      title: "ข้อมูลที่เก็บ",
      body: "ระบบเก็บข้อมูลบัญชี ผล check-in และประวัติแชท เพื่อให้ผู้ใช้กลับมาดูข้อมูลเดิมและดูแนวโน้มสุขภาพใจของตัวเองได้",
    },
    {
      title: "เหตุผลที่ใช้ข้อมูล",
      body: "ข้อมูลถูกใช้เพื่อประเมินความเสี่ยงเบื้องต้น สร้าง dashboard แนวโน้ม แสดงประวัติ check-in และช่วยให้บทสนทนาต่อเนื่องขึ้น",
    },
    {
      title: "การไม่เผยแพร่",
      body: "ข้อมูลของผู้ใช้ถูกเก็บไว้สำหรับการใช้งานในระบบ KU Mind และไม่ถูกเผยแพร่ต่อบุคคลภายนอกโดยไม่ได้รับอนุญาต",
    },
    {
      title: "การลบข้อมูล",
      body: "ผู้ใช้สามารถขอลบข้อมูลได้เมื่อจำเป็น โดยควรแจ้งผู้ดูแลระบบหรือทีมที่รับผิดชอบโครงการ",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d9fff3_0%,_#e7fffb_42%,_#f5fbfb_100%)] px-4 py-6 text-emerald-950 md:px-6">
      <main className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าแรก
        </button>

        <section className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-2xl shadow-emerald-100/70 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <Lock className="h-4 w-4" />
                Privacy Policy
              </div>
              <h1 className="text-4xl font-black leading-tight text-emerald-950 md:text-5xl">นโยบายความเป็นส่วนตัว</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-700">
                หน้านี้อธิบายว่า KU Mind เก็บ ใช้ และดูแลข้อมูลของผู้ใช้อย่างไร
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-100">
              <Shield className="h-10 w-10" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.title} className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/60">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <h2 className="mt-4 text-xl font-black text-emerald-950">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-emerald-700">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl bg-emerald-950 p-6 text-white shadow-xl shadow-emerald-200 md:p-8">
          <Heart className="h-8 w-8 text-emerald-200" fill="currentColor" />
          <h2 className="mt-4 text-2xl font-black">หลักการสำคัญ</h2>
          <p className="mt-3 leading-relaxed text-emerald-50">
            ข้อมูลของคุณจะถูกเก็บอย่างเป็นส่วนตัวและไม่ถูกเผยแพร่ ระบบนี้ออกแบบมาเพื่อช่วยสะท้อนความรู้สึก ไม่ใช่เพื่อเปิดเผยข้อมูลส่วนตัวหรือใช้แทนการรักษาจากผู้เชี่ยวชาญ
          </p>
        </section>
      </main>
    </div>
  );
}
