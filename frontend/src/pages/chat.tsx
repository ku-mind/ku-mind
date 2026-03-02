import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Send, LogOut, MessageCircle } from "lucide-react";

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
      content: "สวัสดีค่ะ ฉันคือ Ku mind ผู้ช่วยด้านสุขภาพจิตของคุณ 💚\n\nวันนี้คุณรู้สึกเป็นยังไงบ้าง? มีอะไรอยากเล่าให้ฟังไหมคะ?",
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-emerald-700 hidden sm:block">
              สวัสดี, {user.name || user.email || "คุณ"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-emerald-700 border-2 border-emerald-200 rounded-full hover:bg-emerald-50 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-white" fill="white" />
                </div>
              )}
              <div
                className={`max-w-sm lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-tr-sm"
                    : "bg-white border-2 border-emerald-100 text-emerald-900 rounded-tl-sm shadow-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <div className="bg-white border-2 border-emerald-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border-t border-emerald-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์ข้อความของคุณ... (Enter เพื่อส่ง)"
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border-2 border-emerald-100 focus:border-emerald-400 focus:outline-none transition-colors text-emerald-900 placeholder:text-emerald-300 resize-none text-sm"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-center text-xs text-emerald-400 mt-2">
          <MessageCircle className="w-3 h-3 inline mr-1" />
          ระบบนี้ไม่สามารถทดแทนการรักษาจากผู้เชี่ยวชาญได้
        </p>
      </div>
    </div>
  );
}