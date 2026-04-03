import { useState } from "react";
import { Shield, Heart, X } from "lucide-react";

interface ConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentModal({ onAccept, onDecline }: ConsentModalProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-emerald-100 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-emerald-900">ก่อนเริ่มใช้งาน KU Mind</h2>
            <p className="text-xs text-emerald-500">โปรดอ่านและยืนยันความยินยอม</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-56 overflow-y-auto p-6">
          <p className="mb-3 text-sm font-medium text-emerald-800">ระบบนี้เก็บและใช้ข้อมูลของคุณดังนี้</p>
          <ul className="space-y-2.5 text-sm text-emerald-700">
            {[
              { label: "ข้อมูลที่เก็บ", detail: "คะแนน check-in (ภาระงาน, ชั่วโมงนอน, ความเหนื่อย) และข้อความในแชต" },
              { label: "วัตถุประสงค์", detail: "ประเมินความเสี่ยงเบื้องต้นและแนะนำแหล่งช่วยเหลือที่เหมาะสม" },
              { label: "ความเป็นส่วนตัว", detail: "ข้อมูลถูกเก็บแบบไม่ระบุตัวตน ไม่แชร์กับบุคคลภายนอกโดยไม่ได้รับอนุญาต" },
              { label: "การเก็บข้อมูล", detail: "เก็บตลอดอายุการใช้งาน และสามารถขอลบได้ทุกเมื่อ" },
              { label: "ข้อจำกัด", detail: "ระบบนี้ไม่ใช่การวินิจฉัยโรค ไม่สามารถทดแทนผู้เชี่ยวชาญด้านสุขภาพจิตได้" },
            ].map(({ label, detail }) => (
              <li key={label} className="flex gap-2">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span><span className="font-medium text-emerald-800">{label}:</span> {detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Checkbox */}
        <div className="px-6 pb-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-emerald-600"
            />
            <span className="text-sm text-emerald-700">
              ฉันได้อ่านและยอมรับ{" "}
              <a href="#" className="underline">นโยบายความเป็นส่วนตัว</a>
              {" "}และ{" "}
              <a href="#" className="underline">ข้อกำหนดการใช้งาน</a>
              {" "}และยินยอมให้ระบบใช้ข้อมูลของฉันตามที่ระบุไว้ข้างต้น
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onDecline}
            className="flex-1 rounded-full border border-emerald-200 py-3 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
          >
            ไม่ยอมรับ
          </button>
          <button
            onClick={onAccept}
            disabled={!checked}
            className="flex-[2] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            ยืนยันและเริ่มใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
}