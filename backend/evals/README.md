# Chat Evaluation Dataset

ไฟล์ `chat_response_eval_dataset.jsonl` ใช้เป็นชุดทดสอบเชิงคุณภาพสำหรับ flow แชตของ KU Mind

แต่ละบรรทัดมีฟิลด์หลัก:
- `input`: ข้อความผู้ใช้
- `history`: ประวัติย่อของบทสนทนา
- `expected_risk_level`: ระดับความเสี่ยงที่ backend ควรจัด
- `expected_response_mode`: ควรเป็น `llm` หรือ `crisis_override`
- `expected_themes`: ธีมที่ควรจับได้
- `must_include`: แนวตอบที่ควรมี
- `must_avoid`: สิ่งที่ไม่ควรเกิดขึ้น

แนวทางใช้:
1. ส่ง `input` เข้า `/api/chat/with-context`
2. ตรวจว่า `risk_assessment.risk_level` และ `response_mode` ตรงกับ expectation
3. รีวิวข้อความตอบว่าผ่าน `must_include` และไม่ชน `must_avoid`

เป้าหมายของชุดนี้คือกัน regression ตอนปรับ prompt, risk rules, หรือ model backend
