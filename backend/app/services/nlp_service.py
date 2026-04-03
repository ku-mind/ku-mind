from transformers import pipeline
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class NLPService:
    """
    NLP Service สำหรับวิเคราะห์ข้อความใน KU Mind
    ใช้ Hugging Face transformers สำหรับ sentiment และ emotion analysis
    """

    def __init__(self):
        self._sentiment_model = None
        self._emotion_model = None
        self._summarizer = None
        self._initialized = False

    @property
    def sentiment_analyzer(self):
        """Lazy loading สำหรับ sentiment analysis model"""
        self._ensure_initialized()
        if self._sentiment_model is None:
            try:
                # ใช้ model ที่ lightweight และไม่ต้องใช้ PIL
                self._sentiment_model = pipeline(
                    "text-classification",
                    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                    return_all_scores=True,
                    device=-1  # Force CPU
                )
                logger.info("✅ Sentiment model loaded successfully")
            except Exception as e:
                logger.error(f"❌ Failed to load sentiment model: {e}")
                raise
        return self._sentiment_model

    @property
    def emotion_detector(self):
        """Lazy loading สำหรับ emotion detection model"""
        self._ensure_initialized()
        if self._emotion_model is None:
            try:
                # Emotion detection model
                self._emotion_model = pipeline(
                    "text-classification",
                    model="j-hartmann/emotion-english-distilroberta-base",
                    return_all_scores=True,
                    device=-1
                )
                logger.info("✅ Emotion model loaded successfully")
            except Exception as e:
                logger.error(f"❌ Failed to load emotion model: {e}")
                raise
        return self._emotion_model

    @property
    def summarizer(self):
        """Lazy loading สำหรับ text summarization"""
        self._ensure_initialized()
        if self._summarizer is None:
            try:
                self._summarizer = pipeline(
                    "summarization",
                    model="facebook/bart-large-cnn",
                    device=-1
                )
                logger.info("✅ Summarizer model loaded successfully")
            except Exception as e:
                logger.error(f"❌ Failed to load summarizer model: {e}")
                raise
        return self._summarizer

    def analyze_sentiment(self, text: str) -> Dict:
        """
        วิเคราะห์ sentiment ของข้อความ
        Returns: {"label": "POSITIVE/NEGATIVE/NEUTRAL", "score": 0.85, "all_scores": [...]}
        """
        try:
            results = self.sentiment_analyzer(text)

            # Convert to our format
            if isinstance(results, list) and len(results) > 0:
                scores = results[0] if isinstance(results[0], list) else results

                # Map labels to Thai
                label_map = {
                    "LABEL_0": "NEGATIVE",
                    "LABEL_1": "NEUTRAL",
                    "LABEL_2": "POSITIVE",
                    "negative": "NEGATIVE",
                    "neutral": "NEUTRAL",
                    "positive": "POSITIVE"
                }

                # Find highest score
                best_result = max(scores, key=lambda x: x['score'])
                best_label = label_map.get(best_result['label'], best_result['label'])

                return {
                    "label": best_label,
                    "score": round(best_result['score'], 3),
                    "all_scores": scores
                }

            return {"label": "NEUTRAL", "score": 0.5, "all_scores": []}

        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            return {"label": "NEUTRAL", "score": 0.5, "all_scores": [], "error": str(e)}

    def analyze_emotion(self, text: str) -> Dict:
        """
        วิเคราะห์ emotion ของข้อความ
        Returns: {"primary_emotion": "sadness", "confidence": 0.75, "all_emotions": [...]}
        """
        try:
            results = self.emotion_detector(text)

            if isinstance(results, list) and len(results) > 0:
                scores = results[0] if isinstance(results[0], list) else results

                # Find highest score
                best_result = max(scores, key=lambda x: x['score'])

                return {
                    "primary_emotion": best_result['label'],
                    "confidence": round(best_result['score'], 3),
                    "all_emotions": scores
                }

            return {"primary_emotion": "neutral", "confidence": 0.5, "all_emotions": []}

        except Exception as e:
            logger.error(f"Error in emotion analysis: {e}")
            return {"primary_emotion": "neutral", "confidence": 0.5, "all_emotions": [], "error": str(e)}

    def extract_themes(self, text: str) -> List[str]:
        """
        สกัด themes หรือ keywords จากข้อความ (simple keyword matching)
        """
        themes = []

        # Define theme keywords (Thai + English)
        theme_keywords = {
            "stress": ["เครียด", "กดดัน", "stress", "pressure", "anxious"],
            "work": ["งาน", "เรียน", "assignment", "deadline", "exam", "สอบ"],
            "sleep": ["นอน", "หลับ", "ง่วง", "sleep", "tired"],
            "relationship": ["เพื่อน", "ครอบครัว", "คนรัก", "relationship", "friend"],
            "loneliness": ["เหงา", "โดดเดี่ยว", "alone", "lonely"],
            "mood": ["เศร้า", "sad", "happy", "ดีใจ", "อารมณ์"],
            "health": ["ป่วย", "เจ็บ", "สุขภาพ", "health", "sick"]
        }

        text_lower = text.lower()
        for theme, keywords in theme_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                themes.append(theme)

        return themes[:3]  # Return max 3 themes

    def summarize_conversation(self, messages: List[str], max_length: int = 100) -> str:
        """
        สรุป conversation เป็นข้อความสั้นๆ
        """
        try:
            # Combine all messages
            combined_text = " ".join(messages[-5:])  # Last 5 messages

            if len(combined_text) < 50:
                return "การสนทนาสั้นๆ เกี่ยวกับความรู้สึกและความเครียด"

            summary = self.summarizer(
                combined_text,
                max_length=max_length,
                min_length=30,
                do_sample=False
            )

            return summary[0]['summary_text']

        except Exception as e:
            logger.error(f"Error in summarization: {e}")
            return "ไม่สามารถสรุปได้ กรุณาดูข้อความทั้งหมด"

    def analyze_message(self, text: str) -> Dict:
        """
        วิเคราะห์ข้อความแบบครบถ้วน
        Returns: รวม sentiment, emotion, themes
        """
        sentiment = self.analyze_sentiment(text)
        emotion = self.analyze_emotion(text)
        themes = self.extract_themes(text)

        # Calculate risk score based on analysis
        risk_score = self._calculate_risk_from_nlp(sentiment, emotion, themes)

        return {
            "sentiment": sentiment,
            "emotion": emotion,
            "themes": themes,
            "nlp_risk_score": risk_score,
            "analysis_timestamp": "2024-01-01T00:00:00Z"  # TODO: Add real timestamp
        }

    def _ensure_initialized(self):
        """Initialize models only when first called"""
        if not self._initialized:
            try:
                # Disable PIL import to avoid architecture issues
                import transformers
                transformers.image_utils.is_pil_available = lambda: False

                from transformers import pipeline
                self._initialized = True
                logger.info("✅ NLP Service initialized successfully")
            except ImportError as e:
                logger.error(f"❌ Failed to import transformers: {e}")
                raise RuntimeError("Transformers library not available") from e
            except Exception as e:
                logger.error(f"❌ Failed to initialize NLP service: {e}")
                raise RuntimeError(f"NLP initialization failed: {e}") from e

    def _calculate_risk_from_nlp(self, sentiment: Dict, emotion: Dict, themes: List[str]) -> float:
        """
        คำนวณ risk score จาก NLP analysis (0-1 scale)
        """
        risk_score = 0.0

        # Sentiment contribution
        if sentiment['label'] == 'NEGATIVE':
            risk_score += 0.4 * sentiment['score']
        elif sentiment['label'] == 'POSITIVE':
            risk_score -= 0.2 * sentiment['score']

        # Emotion contribution
        high_risk_emotions = ['sadness', 'anger', 'fear']
        if emotion['primary_emotion'] in high_risk_emotions:
            risk_score += 0.3 * emotion['confidence']

        # Theme contribution
        high_risk_themes = ['stress', 'loneliness', 'work']
        theme_risk = len([t for t in themes if t in high_risk_themes]) / len(high_risk_themes)
        risk_score += 0.3 * theme_risk

        return min(max(risk_score, 0.0), 1.0)


# Global instance
nlp_service = NLPService()