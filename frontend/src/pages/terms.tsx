import { ArrowLeft, CheckCircle, FileText, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  const terms = [
    {
      title: "ใช้เพื่อการดูแลใจเบื้องต้น",
      body: "KU Mind ช่วยสะท้อนความรู้สึก จัดระเบียบความคิด และแนะนำแนวทางดูแลตัวเองเบื้องต้นเท่านั้น",
    },
    {
      title: "ไม่ใช่การวินิจฉัย",
      body: "คำตอบจากระบบไม่ใช่คำวินิจฉัยทางการแพทย์ และไม่สามารถทดแทนนักจิตวิทยา จิตแพทย์ หรือผู้เชี่ยวชาญด้านสุขภาพจิตได้",
    },
    {
      title: "กรณีฉุกเฉิน",
      body: "หากมีความเสี่ยงต่อการทำร้ายตัวเองหรือผู้อื่น ควรติดต่อคนที่ไว้ใจได้ หน่วยงานฉุกเฉิน หรือสายด่วนสุขภาพจิตทันที",
    },
    {
      title: "การใช้งานอย่างเหมาะสม",
      body: "ผู้ใช้ควรหลีกเลี่ยงการส่งข้อมูลที่ไม่จำเป็น และใช้ระบบเพื่อการสะท้อนตนเองหรือเตรียมข้อมูลก่อนขอความช่วยเหลือจากคนจริง",
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
                <FileText className="h-4 w-4" />
                Terms of Use
              </div>
              <h1 className="text-4xl font-black leading-tight text-emerald-950 md:text-5xl">ข้อกำหนดการใช้งาน</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-700">
                ข้อกำหนดนี้ช่วยให้เข้าใจขอบเขตและข้อจำกัดของการใช้งาน KU Mind
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-100">
              <HeartHandshake className="h-10 w-10" />
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {terms.map((item, index) => (
            <article key={item.title} className="flex gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/60">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                {index + 1}
              </span>
              <div>
                <h2 className="text-xl font-black text-emerald-950">{item.title}</h2>
                <p className="mt-2 leading-relaxed text-emerald-700">{item.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 md:p-8">
          <CheckCircle className="h-7 w-7" />
          <h2 className="mt-4 text-2xl font-black">ย้ำอีกครั้ง</h2>
          <p className="mt-3 leading-relaxed">
            ระบบนี้ช่วยประคองการสนทนาและจัดระเบียบความคิด แต่หากมีอาการรุนแรงหรือรู้สึกไม่ปลอดภัย ควรติดต่อผู้เชี่ยวชาญหรือหน่วยงานช่วยเหลือโดยตรง
          </p>
        </section>
      </main>
    </div>
  );
}
