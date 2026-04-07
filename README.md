# KU Mind

KU Mind เป็นเว็บแอปช่วยดูแลสุขภาพใจเบื้องต้นสำหรับนักศึกษา ใช้สำหรับคุยสะท้อนความรู้สึก, ทำ check-in, ดูแนวโน้มสุขภาพใจย้อนหลัง และบันทึกรายงาน PDF เพื่อใช้ประกอบการคุยกับ counselor หรืออาจารย์ที่ปรึกษา

> ระบบนี้ไม่ใช่การวินิจฉัยโรค และไม่สามารถทดแทนผู้เชี่ยวชาญด้านสุขภาพจิตได้

## Tech Stack

- Frontend: React 19, TypeScript, Vite, React Router, Tailwind CDN, lucide-react
- Backend: FastAPI, SQLAlchemy, SQLite หรือ PostgreSQL, JWT auth
- AI/NLP: Gemini API, Hugging Face transformers, local keyword/risk fallback

## Features

### Auth และ Privacy

- สมัครสมาชิกและเข้าสู่ระบบด้วย email/password
- เก็บ JWT token และ user info ใน `localStorage`
- route ส่วนตัวสำหรับ `/chat`, `/checkin`, `/insights`
- Consent modal ก่อนใช้งานครั้งแรก
- หน้านโยบายความเป็นส่วนตัว `/privacy`
- หน้าข้อกำหนดการใช้งาน `/terms`

### Chat

- คุยกับ KU Mind ผ่าน backend endpoint `/api/chat/with-context`
- ส่ง chat history ล่าสุดเป็น context ให้ Gemini
- วิเคราะห์ NLP context เช่น sentiment, emotion, themes
- ตั้งชื่อ session อัตโนมัติจากเนื้อหา/ธีม
- แยกประวัติแชทตามบัญชีผู้ใช้
- สร้าง, สลับ, ลบ, และ rename chat session ได้
- `Focus Time` นับเวลาจริงของ session ปัจจุบัน
- ปุ่ม `Quick Summary` สำหรับสรุปภาพรวมของ chat session
- fallback reply ถ้า Gemini ใช้งานไม่ได้หรือ quota เต็ม
- ลิงก์ KU Happy Place สำหรับคุยกับคนจริง

### Check-in

- ประเมินจาก 6 ค่า:
  - ภาระงาน
  - ชั่วโมงนอน
  - ความเหนื่อยล้า
  - ความกดดันทางสังคม
  - จำนวนเดดไลน์
  - อารมณ์โดยรวม
- คำนวณ risk score และระดับความเสี่ยง: ต่ำ / ปานกลาง / สูง
- แสดง score breakdown รายด้าน
- แสดงคำแนะนำและแหล่งช่วยเหลือตามระดับความเสี่ยง
- บันทึกผล check-in ลงฐานข้อมูล
- แสดงประวัติ check-in ล่าสุด

### Insights Dashboard

- หน้า `/insights` แสดงแนวโน้มสุขภาพใจจากประวัติ check-in
- การ์ดสรุป:
  - คะแนนเสี่ยงเฉลี่ย 7 วัน
  - อารมณ์เฉลี่ย
  - ชั่วโมงนอนเฉลี่ย
  - ปัจจัยเด่นล่าสุด
- กราฟ:
  - คะแนนความเสี่ยงย้อนหลัง 7 วัน
  - Mood trend
  - Sleep trend
  - Deadline trend
- แสดง Latest Check-in และประวัติล่าสุด
- ปุ่ม `บันทึก PDF` เพื่อ export รายงาน check-in เป็น PDF

### Informational Pages

- `/learn-more`: อธิบายโปรเจกต์, flow การใช้งาน, ข้อมูลที่ระบบใช้, และลิงก์ KU Happy Place
- `/privacy`: นโยบายความเป็นส่วนตัว
- `/terms`: ข้อกำหนดการใช้งาน

## Project Structure

```text
ku-mind/
├── backend/
│   ├── app/
│   │   ├── api/routes/        # auth, chat, nlp routes
│   │   ├── core/              # config, security
│   │   ├── db/                # SQLAlchemy session
│   │   ├── models/            # User, CheckInResult
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # auth, chat, nlp, risk services
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/             # home, chat, checkin, insights, docs pages
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
├── .env.example
├── docker-compose.yml
└── README.md
```

## Environment

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```bash
cp .env.example .env
```

ค่าที่สำคัญ:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
JWT_SECRET_KEY=change-this-secret-in-production
```

สร้าง Gemini API key ได้จาก Google AI Studio:

```text
https://aistudio.google.com/app/apikey
```

ถ้าแชทตอบ fallback เช่น “ระบบตอบกลับหลักขัดข้องชั่วคราว” ให้ดู terminal backend:

- `429` = quota/rate limit เต็ม
- `403` = key ใช้ไม่ได้, key ถูก block, หรือ key ถูกมองว่า leaked
- `400/404` = model name อาจผิด
- `503` = Gemini service มีปัญหาชั่วคราว

หลังแก้ `.env` ต้อง restart backend ใหม่ทุกครั้ง

## Run Locally With SQLite

โหมดนี้ง่ายสุดและไม่ต้องเปิด Docker เพราะ backend default เป็น SQLite ถ้าไม่ตั้ง `DATABASE_URL`

### 1. Backend

```bash
cd /Users/killua/Desktop/winner/ku-mind/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

เช็ก backend:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/health
```

### 2. Frontend

เปิด terminal อีกหน้าหนึ่ง:

```bash
cd /Users/killua/Desktop/winner/ku-mind/frontend
npm install
npm run dev
```

เปิดเว็บ:

```text
http://localhost:5173
```

## Run With PostgreSQL

ถ้าต้องการใช้ Postgres ผ่าน Docker Compose:

1. แก้ `.env` ให้ใช้ `DATABASE_URL` ของ Docker:

```env
DATABASE_URL=postgresql+psycopg://kumind:kumind@db:5432/kumind
POSTGRES_USER=kumind
POSTGRES_PASSWORD=kumind
POSTGRES_DB=kumind
```

2. รัน backend + db ด้วย Docker:

```bash
cd /Users/killua/Desktop/winner/ku-mind
docker compose up --build
```

3. รัน frontend แยก:

```bash
cd /Users/killua/Desktop/winner/ku-mind/frontend
npm install
npm run dev
```

หมายเหตุ: ถ้ารัน backend บนเครื่องโดยตรง แต่ใช้ Postgres container ให้เปลี่ยน host ใน `DATABASE_URL` จาก `db` เป็น `localhost`

```env
DATABASE_URL=postgresql+psycopg://kumind:kumind@localhost:5432/kumind
```

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Chat

- `POST /api/chat`
- `POST /api/chat/with-context`

### NLP

- `POST /api/nlp/analyze`
- `POST /api/nlp/summarize`
- `GET /api/nlp/health`

### Check-in

- `POST /api/checkin`
- `POST /api/checkin-with-text`
- `GET /api/checkins`

### Health

- `GET /`
- `GET /health`

## Useful Commands

Frontend build:

```bash
cd frontend
npm run build
```

Backend syntax check:

```bash
backend/.venv/bin/python -m compileall backend/app
```

Stop backend:

```bash
Ctrl + C
```

Restart backend after `.env` changes:

```bash
cd /Users/killua/Desktop/winner/ku-mind/backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Notes

- SQLite database file is created automatically when backend starts.
- SQLAlchemy creates tables on startup via `Base.metadata.create_all`.
- Chat history is currently stored in browser `localStorage`, separated by user account.
- Check-in results are stored in the backend database.
- PDF export is generated client-side from the Insights dashboard.
- Do not commit real `.env` files or real Gemini API keys.
