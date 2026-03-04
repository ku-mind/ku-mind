import {
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: Clock,
      title: "พร้อมรับฟังตลอด 24/7",
      description: "ไม่ว่าจะเวลาใด เรายินดีรับฟังและให้คำปรึกษาคุณ",
    },
    {
      icon: Shield,
      title: "ปลอดภัยและเป็นส่วนตัว",
      description: "การสนทนาของคุณมีความเป็นส่วนตัวและปลอดภัย",
    },
    {
      icon: Heart,
      title: "ให้คำปรึกษาด้วยความเห็นอกเห็นใจ",
      description: "AI ที่ออกแบบมาเพื่อเข้าใจและให้กำลังใจคุณ",
    },
    {
      icon: Sparkles,
      title: "ไม่มีการตัดสิน",
      description: "พื้นที่ปลอดภัยที่คุณสามารถเป็นตัวของตัวเองได้",
    },
  ];

  const topics = [
    "ความเครียดและความกังวล",
    "ความสัมพันธ์",
    "การทำงานและการเรียน",
    "ครอบครัว",
    "การพัฒนาตัวเอง",
    "ความโดดเดี่ยว",
    "ความมั่นใจในตัวเอง",
    "การนอนหลับ",
  ];

  const steps = [
    {
      title: "เล่าสิ่งที่กำลังรู้สึก",
      description: "พิมพ์สั้นหรือยาวก็ได้ เริ่มจากสิ่งที่อยู่ในใจตอนนี้",
    },
    {
      title: "AI ช่วยให้เข้าใจตัวเองมากขึ้น",
      description: "AI ช่วยสรุปความคิดและมุมมอง เพื่อให้เห็นภาพชัดขึ้น",
    },
    {
      title: "ออกแบบแผนเล็กๆ ของวันนี้",
      description: "และรับคำแนะนำที่นำไปใช้ได้จริง",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-emerald-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 -top-16 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-4 py-4 md:px-5">
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

          <nav className="hidden items-center gap-7 text-sm font-medium text-emerald-700/90 md:flex">
            <a href="#features" className="transition-colors hover:text-emerald-900">
              จุดเด่น
            </a>
            <a href="#topics" className="transition-colors hover:text-emerald-900">
              หัวข้อ
            </a>
            <a href="#start" className="transition-colors hover:text-emerald-900">
              เริ่มต้น
            </a>
          </nav>

          <button
            onClick={goToLogin}
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
          >
            เริ่มพูดคุย
          </button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles className="h-4 w-4" />
            ที่ปรึกษาด้านจิตใจที่พร้อมรับฟังคุณ
          </div>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            คุณไม่ได้
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> อยู่คนเดียว</span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-emerald-700">
            พื้นที่ปลอดภัยสำหรับการแชร์ความรู้สึก ความคิด และความกังวลของคุณ
          <br />
            AI ที่ออกแบบมาเพื่อรับฟังและให้คำปรึกษาด้วยความเห็นอกเห็นใจ
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-emerald-700">
            
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm">
            <Heart className="h-4 w-4 text-emerald-500" />
            พร้อมรับฟังทุกเวลา
          </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm">
              <Shield className="h-4 w-4 text-emerald-500" />
              เน้นความเป็นส่วนตัว
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={goToLogin}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-white shadow-xl shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-600 hover:shadow-2xl"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">เริ่มการสนทนา</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="rounded-full border-2 border-emerald-200 bg-white px-8 py-4 font-semibold text-emerald-700 transition-all hover:bg-emerald-50">
              เรียนรู้เพิ่มเติม
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-r from-emerald-200/70 to-cyan-200/60 blur-xl" />
          <div className="relative rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-2xl shadow-emerald-100 backdrop-blur md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-emerald-700">ตัวอย่างการสนทนา</p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Online</span>
            </div>

            <div className="space-y-3">
              <div className="ml-auto max-w-[60%] rounded-2xl rounded-br-md bg-emerald-50 p-3 text-sm text-emerald-800">
                วันนี้รู้สึกเครียดมาก ไม่ค่อยมีแรงทำอะไรเลย
              </div>
              <div className="max-w-[95%] rounded-2xl rounded-bl-md bg-teal-500 p-3 text-sm text-white">
                ขอบคุณที่เล่าให้ฟังนะ คุณอยากเริ่มจากเรื่องที่กังวลที่สุดตอนนี้ก่อนดีไหม
              </div>
              
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">Quick Summary</p>
              <ul className="mt-2 space-y-2 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                  กำลังรู้สึกกดดันจากงานและพักผ่อนไม่พอ
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                  ตั้งเป้าหมายเล็กๆ ค่อยๆ ฟื้นฟูตัวเอง
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto px-4 md:px-6 flex justify-center">
          <div className="inline-block rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 md:p-6">
            <p className="text-sm leading-relaxed text-amber-800">
              <strong>ข้อควรระวัง:</strong> ระบบนี้เป็นเพียงเครื่องมือให้คำแนะนำเบื้องต้น
              ไม่สามารถทดแทนการรักษาจากนักจิตวิทยาหรือจิตแพทย์มืออาชีพได้
              หากมีอาการรุนแรง โปรดปรึกษาผู้เชี่ยวชาญโดยตรง
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative overflow-hidden border-y border-emerald-100/70 bg-gradient-to-b from-white/75 via-emerald-50/70 to-cyan-50/55 py-20 backdrop-blur-sm"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-14 top-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute right-0 top-24 h-44 w-44 rounded-full bg-cyan-200/35 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Core Benefits
            </div>
            <h3 className="text-3xl font-bold text-emerald-900 md:text-4xl">ทำไมต้องเลือกเรา</h3>
            <p className="mt-3 text-lg text-emerald-600">เราออกแบบมาเพื่อให้คุณรู้สึกปลอดภัยและได้รับการดูแลที่ดีที่สุด</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-3xl border border-emerald-100/90 bg-white/95 p-6 shadow-[0_12px_35px_-22px_rgba(16,185,129,0.45)] transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-[0_25px_55px_-25px_rgba(13,148,136,0.45)]"
              >
                <div className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 opacity-70" />
                <p className="mb-4 text-xs font-bold tracking-[0.14em] text-emerald-500">0{index + 1}</p>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 ring-1 ring-emerald-100 transition-transform group-hover:scale-105">
                  <feature.icon className="h-7 w-7 text-emerald-600" />
                </div>
                <h4 className="mb-2 text-2xl font-bold leading-tight text-emerald-900">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-emerald-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" id="topics">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold text-emerald-900 md:text-4xl">หัวข้อที่เราสามารถช่วยได้</h3>
            <p className="mt-3 text-lg text-emerald-600">ไม่ว่าคุณจะกำลังเผชิญกับอะไร เรายินดีรับฟังและให้คำแนะนำ</p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <button
                key={topic}
                className="group flex items-center justify-between gap-3 rounded-xl border-2 border-emerald-100 bg-white p-5 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50"
              >
                <span className="font-medium text-emerald-800 group-hover:text-emerald-900">{topic}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-3xl border border-emerald-100 bg-white/75 p-6 shadow-xl shadow-emerald-100 backdrop-blur md:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-emerald-900 md:text-3xl">เริ่มใช้งานง่ายใน 3 ขั้นตอน</h3>
              <span className="hidden rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 md:inline-flex">
                ใช้เวลาน้อยกว่า 1 นาที
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-emerald-100 bg-white p-5">
                  <p className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {index + 1}
                  </p>
                  <h4 className="text-lg font-semibold text-emerald-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-emerald-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20" id="start">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-10 text-center text-white shadow-2xl shadow-emerald-200 md:p-12">
            <Heart className="mx-auto mb-6 h-16 w-16" fill="white" />
            <h3 className="text-3xl font-bold md:text-4xl">พร้อมที่จะเริ่มต้นหรือยัง?</h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-50">
              ก้าวแรกสู่สุขภาพจิตที่ดีขึ้น เริ่มต้นด้วยการพูดคุยกับเราวันนี้
            </p>
            <button
              onClick={goToLogin}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-emerald-600 shadow-xl transition-all hover:bg-emerald-50"
            >
              <MessageCircle className="h-5 w-5" />
              <span>เริ่มการสนทนาตอนนี้</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-emerald-900 py-12 text-emerald-100">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                  <Heart className="h-5 w-5 text-white" fill="white" />
                </div>
                <span className="font-semibold text-white">AI ที่ปรึกษาด้านจิตใจ</span>
              </div>
              <p className="text-sm text-emerald-300">พื้นที่ปลอดภัยสำหรับการดูแลสุขภาพจิตของคุณ</p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">แหล่งความช่วยเหลือ</h4>
              <ul className="space-y-2 text-sm text-emerald-300">
                <li>สายด่วนสุขภาพจิต: 1323</li>
                <li>สายด่วนป้องกันการฆ่าตัวตาย: 1422</li>
                <li>กรมสุขภาพจิต: 02-149-5555</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-sm text-emerald-300">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    เกี่ยวกับโครงการ
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    ข้อกำหนดการใช้งาน
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-800 pt-8 text-center text-sm text-emerald-400">
            <p>© 2026 AI ที่ปรึกษาด้านจิตใจ. สร้างขึ้นด้วยความห่วงใยและเทคโนโลยี</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
