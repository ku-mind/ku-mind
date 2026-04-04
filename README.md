# KU Mind

Anonymous AI-based early screening and support system  
for stress and burnout among Kasetsart University students.

## Key Features
- Anonymous check-in and chat
- Early screening (non-diagnostic)
- Human-in-the-loop support & voluntary referral
- Privacy-by-design

## Team
Cross-disciplinary team from
- Software Engineering
- Economics

## Note
This project is developed for the KU AI Pioneers: Forward Challenge.

## Project Status

This repository has been created to demonstrate the basic use of GitHub for project organization and collaboration.

At this stage, only the repository structure and README documentation have been set up. The purpose is to present the initial project concept, scope, and development approach.

No system implementation has been started yet.

If the proposal is approved, the project team will proceed immediately with full development, including system design, AI model implementation, and prototype deployment.


## Run backend
- open Docker
- docker compose up db -d
- sed -i '' 's/@db:/@localhost:/g' .env
- ใส่ GEMINI_API_KEY ของตัวเองใน .env (สร้างได้ที่ https://aistudio.google.com/app/apikey)
- cd backend 
- python3 -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt
- uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Run front end
- cd frontend
- npm install
- npm run dev