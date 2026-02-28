import {
  Heart,
  MessageCircle,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="w-full px-4 md:px-6 py-4 flex items-center justify-between">
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
          <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl">
            เริ่มพูดคุย
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">ที่ปรึกษาด้านจิตใจที่พร้อมรับฟังคุณ</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-6 leading-tight">
            คุณไม่ได้
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              {" "}
              อยู่คนเดียว
            </span>
          </h2>

          <p className="text-xl text-emerald-700 mb-10 leading-relaxed">
            พื้นที่ปลอดภัยสำหรับการแชร์ความรู้สึก ความคิด และความกังวลของคุณ
            <br />
            AI ที่ออกแบบมาเพื่อรับฟังและให้คำปรึกษาด้วยความเห็นอกเห็นใจ
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-xl shadow-emerald-200 hover:shadow-2xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">เริ่มการสนทนา</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-200 rounded-full hover:bg-emerald-50 transition-all">
              เรียนรู้เพิ่มเติม
            </button>
          </div>

          <div className="mt-12 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl max-w-2xl mx-auto">
            <p className="text-sm text-amber-800">
              <strong>ข้อควรระวัง:</strong> ระบบนี้เป็นเพียงเครื่องมือให้คำแนะนำเบื้องต้น
              ไม่สามารถทดแทนการรักษาจากนักจิตวิทยาหรือจิตแพทย์มืออาชีพได้
              หากมีอาการรุนแรง โปรดปรึกษาผู้เชี่ยวชาญโดยตรง
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">ทำไมต้องเลือกเรา</h3>
            <p className="text-emerald-600 text-lg">
              เราออกแบบมาเพื่อให้คุณรู้สึกปลอดภัยและได้รับการดูแลที่ดีที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-emerald-900 mb-2">{feature.title}</h4>
                <p className="text-emerald-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">หัวข้อที่เราสามารถช่วยได้</h3>
            <p className="text-emerald-600 text-lg">
              ไม่ว่าคุณจะกำลังเผชิญกับอะไร เรายินดีรับฟังและให้คำแนะนำ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border-2 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center gap-3 cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-emerald-800 font-medium group-hover:text-emerald-900">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 text-center text-white shadow-2xl shadow-emerald-200">
            <Heart className="w-16 h-16 mx-auto mb-6" fill="white" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">พร้อมที่จะเริ่มต้นหรือยัง?</h3>
            <p className="text-emerald-50 text-lg mb-8">
              ก้าวแรกสู่สุขภาพจิตที่ดีขึ้น เริ่มต้นด้วยการพูดคุยกับเราวันนี้
            </p>
            <button className="px-8 py-4 bg-white text-emerald-600 rounded-full hover:bg-emerald-50 transition-all shadow-xl font-medium inline-flex items-center gap-2 group">
              <MessageCircle className="w-5 h-5" />
              <span>เริ่มการสนทนาตอนนี้</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-emerald-900 text-emerald-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="font-semibold text-white">AI ที่ปรึกษาด้านจิตใจ</span>
              </div>
              <p className="text-emerald-300 text-sm">พื้นที่ปลอดภัยสำหรับการดูแลสุขภาพจิตของคุณ</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">แหล่งความช่วยเหลือ</h4>
              <ul className="space-y-2 text-sm text-emerald-300">
                <li>สายด่วนสุขภาพจิต: 1323</li>
                <li>สายด่วนป้องกันการฆ่าตัวตาย: 1422</li>
                <li>กรมสุขภาพจิต: 02-149-5555</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-sm text-emerald-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    เกี่ยวกับโครงการ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
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
