AI_Career_Portal_Backend_v2

Structure:
- backend/         (Node Express app, runs on port 8000)
- ai_service/      (Flask AI service, runs on port 5000)
  - ai_models/     (place your .pkl models here: ai_role_recommender.pkl, vectorizer.pkl, ats.pkl)

Run Flask:
$ cd ai_service
$ python -m venv venv
$ venv\Scripts\activate    # on Windows
$ pip install -r requirements.txt
$ python app.py

Run Node:
$ cd backend
$ npm install
$ npm run dev   # starts on PORT from .env (8000)

Notes:
- Node calls Flask at FLASK_API_URL=http://localhost:5000
- Ensure models are valid (joblib or pickle). The service attempts joblib first then pickle.
