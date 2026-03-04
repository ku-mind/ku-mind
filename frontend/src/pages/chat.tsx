import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Heart,
  LogOut,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "สวัสดีค่ะ ฉันคือ Ku mind ผู้ช่วยด้านสุขภาพจิตของคุณ 💚\n\nวันนี้คุณรู้สึกเป็นยังไงบ้าง? มีอะไรอยากเล่าให้ฟังไหมคะ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("ku_mind_user") || "{}");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem("ku_mind_user");
    localStorage.removeItem("ku_mind_token");
    navigate("/");
  };

  const sendMessage = async (rawMessage: string) => {
    const messageText = rawMessage.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("ku_mind_token");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error("API error");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "ขอบคุณที่เล่าให้ฟังนะคะ 💚 ฉันรับฟังคุณอยู่เสมอค่ะ",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    await sendMessage(input);
  };

  const handleQuickPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: Date) =>
    timestamp.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const quickPrompts = [
    "วันนี้เหนื่อยจากงานมาก อยากจัดการความเครียดยังไงดี",
    "ช่วยสรุปความคิดในหัวให้หน่อยได้ไหม",
    "อยากได้แผนดูแลใจแบบง่ายๆ สำหรับคืนนี้",
  ];

  return (
    <div className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#d9fff3_0%,_#d8f7f1_30%,_#d6ecee_100%)] text-emerald-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />
      </div>

      <header className="border-b border-emerald-100/70 bg-white/75 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-200">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 bg-clip-text text-3xl font-black leading-none tracking-wide text-transparent">
                Ku mind
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-emerald-500">Mental Wellness Companion</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-full border border-emerald-100 bg-white/70 px-4 py-2 text-sm text-emerald-700 lg:flex">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            เซสชันปลอดภัยและเป็นส่วนตัว
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-emerald-700 sm:block">
              สวัสดี, {user.name || user.email || "คุณ"}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <main className="grid h-[calc(100vh-81px)] grid-cols-1 gap-4 px-4 py-4 md:px-6 lg:grid-cols-[320px_1fr]">
        <aside className="hidden rounded-3xl border border-emerald-100/90 bg-white/65 p-5 shadow-xl shadow-emerald-100 backdrop-blur lg:flex lg:flex-col">
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Session Insight
            </div>
            <h2 className="mt-4 text-2xl font-black leading-tight text-emerald-900">คุยต่อเนื่อง\nแบบเข้าใจคุณ</h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-white/85 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.12em] text-emerald-500">Mood</p>
              <p className="font-semibold text-emerald-800">พร้อมรับฟังอย่างอ่อนโยน</p>
            </div>
            <div className="rounded-2xl bg-white/85 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.12em] text-emerald-500">Safety</p>
              <p className="inline-flex items-center gap-2 font-semibold text-emerald-800">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Private by design
              </p>
            </div>
            <div className="rounded-2xl bg-white/85 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.12em] text-emerald-500">Focus Time</p>
              <p className="inline-flex items-center gap-2 font-semibold text-emerald-800">
                <Timer className="h-4 w-4 text-emerald-500" />
                5-10 นาทีต่อ session
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-700">
            เริ่มด้วยการเล่าเหตุการณ์วันนี้ หรือพิมพ์ความรู้สึกสั้นๆ แล้วเราจะช่วยสะท้อนให้ชัดขึ้น
          </div>
        </aside>

        <section className="flex min-h-0 flex-col rounded-3xl border border-emerald-100/90 bg-white/55 shadow-2xl shadow-emerald-100 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-emerald-100/70 px-4 py-3 md:px-5">
            <div>
              <h3 className="text-base font-bold text-emerald-900 md:text-lg">พื้นที่สนทนาแบบไม่ตัดสิน</h3>
              <p className="text-xs text-emerald-600 md:text-sm">เล่าได้เต็มที่ เราจะช่วยคุณค่อยๆ คลี่ความคิด</p>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 md:inline-flex">
              <MessageCircle className="h-3.5 w-3.5" />
              Online
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
            <div className="space-y-5">
              <div className="mb-2 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-full border border-emerald-200 bg-white/85 px-3 py-1.5 text-xs text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3`}
                >
                  {message.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                      <Heart className="h-4 w-4 text-white" fill="white" />
                    </div>
                  )}

                  <div className="max-w-[82%] lg:max-w-[68%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap md:text-[15px] ${
                        message.role === "user"
                          ? "rounded-tr-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200"
                          : "rounded-tl-sm border border-emerald-100 bg-white/95 text-emerald-900 shadow-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p
                      className={`mt-1 text-[11px] ${
                        message.role === "user" ? "text-right text-emerald-500" : "text-emerald-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-5 items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-emerald-100/70 bg-white/80 px-4 py-4 backdrop-blur md:px-5">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="พิมพ์ข้อความของคุณ... (Enter เพื่อส่ง)"
                  rows={1}
                  className="w-full resize-none rounded-2xl border-2 border-emerald-100 px-4 py-3 text-sm text-emerald-900 transition-all placeholder:text-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  style={{ minHeight: "50px", maxHeight: "140px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = Math.min(target.scrollHeight, 140) + "px";
                  }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-200 transition-all hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-emerald-500">
              <MessageCircle className="mr-1 inline h-3 w-3" />
              ระบบนี้ไม่สามารถทดแทนการรักษาจากผู้เชี่ยวชาญได้
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
