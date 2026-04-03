import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Users,
  User,
} from "lucide-react";

interface CheckInData {
  workload: number;
  sleep_hours: number;
  fatigue: number;
  social_pressure: number;
  deadline_count: number;
  mood: number;
}

interface RiskResult {
  risk_level: "low" | "medium" | "high";
  risk_score: number;
  score_breakdown: {
    workload: number;
    sleep: number;
    fatigue: number;
    mood: number;
    social_pressure: number;
    deadlines: number;
  };
  recommendations: string[];
  referral_options: Array<{
    type: string;
    label: string;
    description: string;
    contact?: string;
    show_for: string[];
  }>;
  summary: string;
}

export default function CheckIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckInData>({
    workload: 5,
    sleep_hours: 7,
    fatigue: 5,
    social_pressure: 5,
    deadline_count: 2,
    mood: 6,
  });

  const [result, setResult] = useState<RiskResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const labels = {
    workload: {
      th: "ภาระงาน/เดดไลน์ วันนี้ หนักแค่ไหน?",
      min: "น้อย",
      max: "มาก",
    },
    sleep_hours: {
      th: "ชั่วโมงนอนเมื่อคืน",
      min: "0 ชั่วโมง",
      max: "12 ชั่วโมง",
    },
    fatigue: {
      th: "ความเหนื่อยล้า",
      min: "ไม่เหนื่อย",
      max: "เหนื่อยมาก",
    },
    social_pressure: {
      th: "ความกดดันทางสังคม จากครอบครัว เพื่อน หรือการเรียน",
      min: "ไม่มี",
      max: "รุนแรง",
    },
    deadline_count: {
      th: "จำนวนงานเดดไลน์ภายใน 1 สัปดาห์",
      min: "0 เดดไลน์",
      max: "20+ เดดไลน์",
    },
    mood: {
      th: "อารมณ์โดยรวม วันนี้",
      min: "แย่มาก",
      max: "ดีเยี่ยม",
    },
  };

  const handleSliderChange = (key: keyof CheckInData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "sleep_hours" ? parseFloat(value.toFixed(1)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const apiBase = import.meta.env.VITE_API_URL || "";
    const apiUrl = `${apiBase}/api/checkin`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit check-in - ${response.status} ${response.statusText} ${errorText}`);
      }

      const data: RiskResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการส่งข้อมูล (เช่น backend ไม่ทำงานหรือ CORS)",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-emerald-50 border-emerald-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "high":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50";
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-emerald-700";
      case "medium":
        return "text-yellow-700";
      case "high":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-emerald-100 text-emerald-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (result) {
    const levelLabels = {
      low: "ต่ำ",
      medium: "ปานกลาง",
      high: "สูง",
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">i</span>
              </div>
              <h1 className="text-3xl font-bold text-emerald-900">KU Mind</h1>
            </div>
            <p className="text-emerald-700 text-sm">
              เช็กสภาพจิตโดยอ้างอิงข้อมูลจริง — ไม่ประมาณตัวอน เไม่มีการวินิจฉัย
            </p>
          </div>

          {/* Risk Assessment Card */}
          <div className={`rounded-lg border-2 p-6 mb-6 ${getRiskColor(result.risk_level)}`}>
            <div className="flex items-start gap-4">
              <div>
                {result.risk_level === "low" && (
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                )}
                {result.risk_level === "medium" && (
                  <AlertCircle className="w-12 h-12 text-yellow-600" />
                )}
                {result.risk_level === "high" && (
                  <AlertCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className={`text-2xl font-bold ${getRiskTextColor(result.risk_level)}`}>
                    ระดับความเสี่ยง: {levelLabels[result.risk_level]}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadgeColor(result.risk_level)}`}>
                    Score: {Math.round(result.risk_score * 100)}/100
                  </span>
                </div>
                <p className="text-gray-700">{result.summary}</p>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">การวิเคราะห์รายด้าน</h3>
            <div className="space-y-3">
              {Object.entries(result.score_breakdown).map(([key, value]) => {
                const labelMap: { [key: string]: string } = {
                  workload: "ภาระงาน",
                  sleep: "การนอน",
                  fatigue: "ความเหนื่อยล้า",
                  mood: "อารมณ์",
                  social_pressure: "ความกดดันสังคม",
                  deadlines: "เดดไลน์",
                };

                return (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {labelMap[key]}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {value}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          value < 33
                            ? "bg-emerald-500"
                            : value < 67
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">💡 คำแนะนำสำหรับคุณ</h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-emerald-600 font-bold flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Referral Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              🤝 แหล่งความช่วยเหลือที่เหมาะสม
            </h3>
            <div className="space-y-3">
              {result.referral_options.map((option, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {option.type === "peer" && <Users className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {option.type === "advisor" && <User className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {option.type === "counseling" && <Heart className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {option.type === "crisis" && <PhoneCall className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                    {option.type === "self" && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                      {option.contact && (
                        <p className="text-sm font-mono text-emerald-700 mt-2">
                          📞 {option.contact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResult(null);
                setFormData({
                  workload: 5,
                  sleep_hours: 7,
                  fatigue: 5,
                  social_pressure: 5,
                  deadline_count: 2,
                  mood: 6,
                });
              }}
              className="flex-1 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-colors"
            >
              ทำการ Check-in ใหม่
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              เข้าแชทกับ KU Mind
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">i</span>
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">KU Mind</h1>
          </div>
          <p className="text-emerald-700">
            เช็กสภาพจิตโดยอ้างอิงข้อมูลจริง — ไม่ประมาณตัวอน ไม่มีการวินิจฉัย
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 border border-emerald-100"
        >
          <h2 className="text-xl font-bold text-emerald-900 mb-6">
            CHECK-IN วันนี้
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Sliders */}
          <div className="space-y-8">
            {(Object.keys(formData) as Array<keyof CheckInData>).map((key) => (
              <div key={key}>
                <label className="block mb-3">
                  <span className="text-sm font-semibold text-emerald-900">
                    {labels[key].th}
                  </span>
                  <input
                    type="range"
                    min={key === "sleep_hours" ? 0 : key === "deadline_count" ? 0 : 1}
                    max={key === "sleep_hours" ? 12 : key === "deadline_count" ? 20 : 10}
                    step={key === "sleep_hours" ? 0.5 : 1}
                    value={formData[key]}
                    onChange={(e) =>
                      handleSliderChange(key, parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                  />
                </label>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{labels[key].min}</span>
                  <span className="text-emerald-700 font-bold">
                    {key === "sleep_hours"
                      ? `${formData[key]} ชม.`
                      : key === "deadline_count"
                      ? `${formData[key]} รายการ`
                      : `${formData[key]}/10`}
                  </span>
                  <span>{labels[key].max}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "กำลังประเมินผล..." : "ประเมินผล"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex justify-center items-center">
            🔒 ข้อมูลของคุณจะเป็นส่วนตัวและไม่ถูกบันทึก
          </div>
        </form>
      </div>
    </div>
  );
}
