import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Heart,
  Loader2,
  MessageCircle,
  Moon,
  Target,
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

interface CheckInHistoryItem extends RiskResult, CheckInData {
  id: number;
  created_at: string;
  additional_text?: string | null;
}

interface TrendPoint {
  label: string;
  value: number | null;
}

interface DayBucket {
  key: string;
  label: string;
  items: CheckInHistoryItem[];
}

const levelLabels = {
  low: "ต่ำ",
  medium: "ปานกลาง",
  high: "สูง",
};

const metricColors = {
  risk: "#059669",
  mood: "#0d9488",
  sleep: "#0284c7",
  deadline: "#d97706",
};

function getLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatScore(value: number | null, suffix = ""): string {
  if (value === null || Number.isNaN(value)) return "-";
  return `${Math.round(value)}${suffix}`;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getRiskBadgeClass(level: CheckInHistoryItem["risk_level"]): string {
  if (level === "low") return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (level === "medium") return "bg-amber-100 text-amber-800 ring-amber-200";
  return "bg-red-100 text-red-800 ring-red-200";
}

function buildSevenDayBuckets(history: CheckInHistoryItem[]): DayBucket[] {
  const byDay = new Map<string, CheckInHistoryItem[]>();

  history.forEach((item) => {
    const key = getLocalDayKey(new Date(item.created_at));
    byDay.set(key, [...(byDay.get(key) ?? []), item]);
  });

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = getLocalDayKey(date);
    return {
      key,
      label: date.toLocaleDateString("th-TH", { weekday: "short" }),
      items: byDay.get(key) ?? [],
    };
  });
}

function getTrendValue(bucket: DayBucket, selector: (item: CheckInHistoryItem) => number): number | null {
  return average(bucket.items.map(selector));
}

function TrendChart({
  title,
  description,
  points,
  max,
  suffix,
  color,
}: {
  title: string;
  description: string;
  points: TrendPoint[];
  max: number;
  suffix?: string;
  color: string;
}) {
  const width = 640;
  const height = 190;
  const padding = 24;
  const chartWidth = width - padding * 2;
  const chartHeight = 124;
  const baseline = padding + chartHeight;
  const plotted = points
    .map((point, index) => {
      if (point.value === null) return null;
      const x = padding + (points.length === 1 ? 0 : (chartWidth / (points.length - 1)) * index);
      const y = baseline - (Math.min(Math.max(point.value, 0), max) / max) * chartHeight;
      return { ...point, x, y };
    })
    .filter((point): point is TrendPoint & { x: number; y: number } => point !== null);

  const polyline = plotted.map((point) => `${point.x},${point.y}`).join(" ");
  const area =
    plotted.length > 1
      ? `${plotted[0].x},${baseline} ${polyline} ${plotted[plotted.length - 1].x},${baseline}`
      : "";

  const latestValue = [...points].reverse().find((point) => point.value !== null)?.value ?? null;

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-xl shadow-emerald-100/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-emerald-950">{title}</h3>
          <p className="mt-1 text-sm text-emerald-700">{description}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500">ล่าสุด</p>
          <p className="text-xl font-black text-emerald-900">{formatScore(latestValue, suffix)}</p>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-48 w-full overflow-visible">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + (chartHeight / 3) * line;
          return (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#d1fae5"
              strokeWidth="1"
            />
          );
        })}
        {area && <polygon points={area} fill={color} opacity="0.12" />}
        {polyline && (
          <polyline points={polyline} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {plotted.map((point) => (
          <g key={`${point.label}-${point.x}`}>
            <circle cx={point.x} cy={point.y} r="6" fill="white" stroke={color} strokeWidth="4" />
            <text x={point.x} y={point.y - 12} textAnchor="middle" className="fill-emerald-900 text-[18px] font-bold">
              {formatScore(point.value, suffix)}
            </text>
          </g>
        ))}
        {points.map((point, index) => {
          const x = padding + (points.length === 1 ? 0 : (chartWidth / (points.length - 1)) * index);
          return (
            <text key={point.label} x={x} y={height - 8} textAnchor="middle" className="fill-emerald-700 text-[16px] font-semibold">
              {point.label}
            </text>
          );
        })}
      </svg>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-xl shadow-emerald-100/70">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
        {icon}
      </div>
      <p className="text-sm font-semibold text-emerald-600">{label}</p>
      <p className="mt-1 text-3xl font-black text-emerald-950">{value}</p>
      <p className="mt-2 text-sm text-emerald-700">{detail}</p>
    </div>
  );
}

export default function Insights() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<CheckInHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("ku_mind_token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const apiBase = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiBase}/api/checkins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("ku_mind_user");
          localStorage.removeItem("ku_mind_token");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "โหลดข้อมูลไม่สำเร็จ");
        }

        const data: CheckInHistoryItem[] = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const buckets = useMemo(() => buildSevenDayBuckets(history), [history]);
  const latest = history[0];
  const sevenDayItems = buckets.flatMap((bucket) => bucket.items);
  const averageRisk = average(sevenDayItems.map((item) => item.risk_score * 100));
  const averageMood = average(sevenDayItems.map((item) => item.mood));
  const averageSleep = average(sevenDayItems.map((item) => item.sleep_hours));

  const riskTrend = buckets.map((bucket) => ({
    label: bucket.label,
    value: getTrendValue(bucket, (item) => item.risk_score * 100),
  }));
  const moodTrend = buckets.map((bucket) => ({
    label: bucket.label,
    value: getTrendValue(bucket, (item) => item.mood),
  }));
  const sleepTrend = buckets.map((bucket) => ({
    label: bucket.label,
    value: getTrendValue(bucket, (item) => item.sleep_hours),
  }));
  const deadlineTrend = buckets.map((bucket) => ({
    label: bucket.label,
    value: getTrendValue(bucket, (item) => item.deadline_count),
  }));

  const strongestFactor = latest
    ? Object.entries(latest.score_breakdown).sort((a, b) => b[1] - a[1])[0]
    : null;
  const factorLabels: Record<string, string> = {
    workload: "ภาระงาน",
    sleep: "การนอน",
    fatigue: "ความเหนื่อยล้า",
    mood: "อารมณ์",
    social_pressure: "ความกดดันสังคม",
    deadlines: "เดดไลน์",
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d9fff3_0%,_#e4fffb_38%,_#eaf7f7_100%)] px-4 py-6 text-emerald-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-xl shadow-emerald-100/70 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/chat")}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 text-emerald-700 transition-colors hover:bg-emerald-50"
                aria-label="กลับหน้าแชท"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-500">Mind Dashboard</p>
                <h1 className="text-2xl font-black text-emerald-950 md:text-4xl">แนวโน้มสุขภาพใจ</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/checkin")}
                className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                ทำ Check-in
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                กลับไปคุย
              </button>
            </div>
          </div>
        </header>

        {isLoading && (
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-emerald-100 bg-white/80">
            <div className="text-center text-emerald-700">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-3 font-semibold">กำลังโหลดประวัติ check-in</p>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
            <p className="font-bold">โหลด Dashboard ไม่สำเร็จ</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && history.length === 0 && (
          <div className="rounded-3xl border border-emerald-100 bg-white/85 p-10 text-center shadow-xl shadow-emerald-100/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-emerald-950">ยังไม่มีข้อมูลสำหรับทำ Dashboard</h2>
            <p className="mx-auto mt-2 max-w-lg text-emerald-700">
              ทำ check-in ครั้งแรกก่อน แล้วหน้านี้จะเริ่มวาดแนวโน้มคะแนน ความรู้สึก การนอน และเดดไลน์ให้
            </p>
            <button
              onClick={() => navigate("/checkin")}
              className="mt-6 rounded-full bg-emerald-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              ไปทำ Check-in
            </button>
          </div>
        )}

        {!isLoading && !error && history.length > 0 && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Activity className="h-5 w-5" />}
                label="คะแนนเสี่ยงเฉลี่ย 7 วัน"
                value={formatScore(averageRisk, "/100")}
                detail="ยิ่งต่ำยิ่งเบาใจ"
              />
              <StatCard
                icon={<Heart className="h-5 w-5" />}
                label="อารมณ์เฉลี่ย"
                value={formatScore(averageMood, "/10")}
                detail="คำนวณจาก check-in ใน 7 วันล่าสุด"
              />
              <StatCard
                icon={<Moon className="h-5 w-5" />}
                label="การนอนเฉลี่ย"
                value={formatScore(averageSleep, " ชม.")}
                detail="ช่วยดูความสัมพันธ์กับคะแนนเสี่ยง"
              />
              <StatCard
                icon={<Target className="h-5 w-5" />}
                label="ปัจจัยเด่นล่าสุด"
                value={strongestFactor ? factorLabels[strongestFactor[0]] ?? strongestFactor[0] : "-"}
                detail={strongestFactor ? `${strongestFactor[1]}% จาก check-in ล่าสุด` : "ยังไม่มีข้อมูล"}
              />
            </section>

            <section className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-950 p-6 text-white shadow-2xl shadow-emerald-200">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Latest Check-in</p>
                  <h2 className="mt-2 text-3xl font-black">
                    ระดับความเสี่ยงล่าสุด: {levelLabels[latest.risk_level]}
                  </h2>
                  <p className="mt-2 max-w-3xl text-emerald-50">{latest.summary}</p>
                </div>
                <div className="rounded-3xl bg-white/12 px-5 py-4 text-right ring-1 ring-white/15">
                  <p className="text-sm text-emerald-100">{formatDateTime(latest.created_at)}</p>
                  <p className="text-4xl font-black">{Math.round(latest.risk_score * 100)}/100</p>
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-2">
              <TrendChart
                title="คะแนนความเสี่ยงย้อนหลัง 7 วัน"
                description="ค่าเฉลี่ยคะแนนจาก check-in ในแต่ละวัน"
                points={riskTrend}
                max={100}
                suffix="%"
                color={metricColors.risk}
              />
              <TrendChart
                title="Mood trend"
                description="อารมณ์โดยรวม ยิ่งสูงยิ่งดี"
                points={moodTrend}
                max={10}
                suffix="/10"
                color={metricColors.mood}
              />
              <TrendChart
                title="Sleep trend"
                description="จำนวนชั่วโมงนอนเมื่อคืน"
                points={sleepTrend}
                max={12}
                suffix=" ชม."
                color={metricColors.sleep}
              />
              <TrendChart
                title="Deadline trend"
                description="จำนวนงานเดดไลน์ใน 1 สัปดาห์"
                points={deadlineTrend}
                max={20}
                suffix=""
                color={metricColors.deadline}
              />
            </section>

            <section className="mt-5 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/70">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-emerald-950">ประวัติล่าสุด</h3>
                  <p className="text-sm text-emerald-700">แสดง check-in ล่าสุดสูงสุด 10 ครั้ง</p>
                </div>
                <MessageCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-3">
                {history.slice(0, 10).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-bold text-emerald-950">{formatDateTime(item.created_at)}</p>
                        <p className="mt-1 text-sm text-emerald-700">
                          งาน {item.workload}/10 · นอน {item.sleep_hours} ชม. · เหนื่อย {item.fatigue}/10 · เดดไลน์ {item.deadline_count}
                        </p>
                      </div>
                      <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ring-1 ${getRiskBadgeClass(item.risk_level)}`}>
                        {levelLabels[item.risk_level]} · {Math.round(item.risk_score * 100)}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
