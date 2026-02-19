from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json, pickle, traceback, re
from PyPDF2 import PdfReader
import google.generativeai as genai
from dotenv import load_dotenv

# ==========================================================
# 🔹 SETUP
# ==========================================================
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, "ai_models")
UPLOAD_DIR = os.path.join(BASE, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)
# Gemini Setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

# ==========================================================
# 🔹 MOCK DATA BY DOMAIN
# ==========================================================
MOCK_QUESTIONS = {
    "python": {
        "technical": [
            "What is the difference between list and tuple in Python?",
            "Explain decorators in Python.",
            "What are generators and how do they work?"
        ],
        "coding": [
            "Write a function to reverse a string without using built-in methods.",
            "Find duplicate elements in an array and return them."
        ],
        "behavioral": [
            "Tell me about a challenging Python project you solved.",
            "How do you debug complex Python code?"
        ]
    },
    "java": {
        "technical": [
            "Explain the four OOP principles in Java.",
            "What is the difference between HashMap and Hashtable?",
            "What is the JVM and how does garbage collection work?"
        ],
        "coding": [
            "Reverse a string without using built-in methods.",
            "Find the first non-repeating character in a string."
        ],
        "behavioral": [
            "Describe a challenging Java project you worked on.",
            "How do you handle code reviews and feedback?"
        ]
    },
    "frontend": {
        "technical": [
            "Explain the Virtual DOM in React and how it improves performance.",
            "What are CSS Grid and Flexbox? When would you use each?",
            "Explain event delegation and how it works in browsers."
        ],
        "coding": [
            "Write a React Hook to fetch data on component mount.",
            "Create a debounce function to handle API calls."
        ],
        "behavioral": [
            "Describe a responsive design project you built.",
            "How do you approach performance optimization?"
        ]
    },
    "backend": {
        "technical": [
            "Explain REST API principles and HTTP methods.",
            "What is the difference between SQL and NoSQL databases?",
            "How do you implement authentication and authorization?"
        ],
        "coding": [
            "Design a database schema for a social media platform.",
            "Write an API endpoint that handles pagination."
        ],
        "behavioral": [
            "Describe a backend system you designed from scratch.",
            "How do you handle database scaling?"
        ]
    },
    "data science": {
        "technical": [
            "Explain the bias-variance tradeoff.",
            "What is cross-validation and why is it important?",
            "How do you handle missing data in a dataset?"
        ],
        "coding": [
            "Build a simple machine learning model using scikit-learn.",
            "Write code to normalize a pandas DataFrame."
        ],
        "behavioral": [
            "Describe a machine learning project you led end-to-end.",
            "How do you communicate insights to non-technical stakeholders?"
        ]
    },
    "devops": {
        "technical": [
            "Explain CI/CD pipelines and their benefits.",
            "What is containerization? How does Docker work?",
            "Explain Infrastructure as Code (IaC)."
        ],
        "coding": [
            "Write a Dockerfile for a Node.js application.",
            "Create a basic Kubernetes deployment YAML."
        ],
        "behavioral": [
            "Describe your experience managing production deployments.",
            "How do you handle system outages?"
        ]
    },
    "cloud": {
        "technical": [
            "Explain the difference between IaaS, PaaS, and SaaS.",
            "Design a scalable cloud architecture for an e-commerce platform.",
            "How do you ensure security in cloud deployments?"
        ],
        "coding": [
            "Write Infrastructure as Code for cloud deployment.",
            "Configure cloud storage and database services."
        ],
        "behavioral": [
            "Describe a cloud migration project you managed.",
            "How do you handle cloud cost optimization?"
        ]
    },
    "qa": {
        "technical": [
            "Explain the difference between manual and automated testing.",
            "What is test coverage and why does it matter?",
            "How do you prioritize which tests to automate?"
        ],
        "coding": [
            "Write a test case for a login functionality.",
            "Create an automated test using Selenium or Cypress."
        ],
        "behavioral": [
            "Describe a critical bug you discovered and how you reported it.",
            "How do you work with developers to resolve issues?"
        ]
    },
    "full stack": {
        "technical": [
            "Design a 3-tier architecture for a web application.",
            "Explain how you optimize both frontend and backend performance.",
            "How do you manage state across frontend and backend?"
        ],
        "coding": [
            "Build an API endpoint and its corresponding React component.",
            "Implement user authentication across the full stack."
        ],
        "behavioral": [
            "Describe a full stack project you built independently.",
            "How do you balance frontend and backend work?"
        ]
    },
    "general": {
        "technical": [
            "What is REST API and how do you design one?",
            "Explain the difference between SQL and NoSQL databases.",
            "What is time complexity and space complexity?"
        ],
        "coding": [
            "Write a factorial function.",
            "Reverse an array without using extra space."
        ],
        "behavioral": [
            "Tell me about yourself and your career journey.",
            "How do you approach learning new technologies?"
        ]
    }
}

MOCK_EVALUATION = {
    "average_score": 7.5,
    "strengths": "Good understanding of core concepts, clear communication, and problem-solving approach",
    "improvements": "Could provide more detailed explanations, practice coding problems regularly, and improve time management",
    "final_feedback": "You demonstrated solid technical knowledge and good communication skills. Work on deeper understanding of advanced topics and practice coding problems under time pressure.",
    "suggestions": [
        "Study system design patterns",
        "Practice coding problems daily",
        "Build real-world projects",
        "Participate in code reviews"
    ]
}

# ==========================================================
# 🔹 LOAD ML MODELS
# ==========================================================

def load_model(path):
    try:
        import joblib
        return joblib.load(path)
    except Exception:
        with open(path, "rb") as f:
            return pickle.load(f)

try:
    role_model = load_model(os.path.join(MODEL_DIR, "resume_role_predictor.pkl"))
    vectorizer = load_model(os.path.join(MODEL_DIR, "vectorizer.pkl"))
    print("✅ Models loaded")
except Exception as e:
    print("❌ Model load error:", e)
    role_model, vectorizer = None, None

# ==========================================================
# 🔹 UTILITIES
# ==========================================================

def extract_text_from_pdf(path):
    text = ""
    reader = PdfReader(path)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()

def safe_generate(prompt, timeout=25):
    try:
        res = model.generate_content(
            prompt,
            request_options={"timeout": timeout}
        )

        if not res or not getattr(res, "text", None):
            return "No response generated."

        return res.text.strip()

    except Exception as e:
        print("❌ Gemini error:", e)
        return "AI evaluation unavailable right now."

def extract_score(text):
    nums = re.findall(r"\d+", text)
    for n in nums:
        n = int(n)
        if 0 <= n <= 10:
            return n
    return 5

# ==========================================================
# 🔹 HOME
# ==========================================================

@app.route("/")
def home():
    return jsonify({"message": "AI Flask backend running ✅"})

# ==========================================================
# 🔹 ROLE PREDICTOR
# ==========================================================

@app.route("/predict_role", methods=["POST"])
def predict_role():
    try:
        if role_model is None or vectorizer is None:
            return jsonify({"error": "Model not loaded"}), 500

        data = request.get_json()
        text = data.get("resume_text", "").strip()

        X = vectorizer.transform([text])
        pred = role_model.predict(X)[0]

        return jsonify({"predicted_role": str(pred)})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


TECH_Q = 3
CODING_Q = 2
BEHAVIOR_Q = 2

def get_mock_questions(domain):
    """Get mock questions for a domain (fallback when API fails)"""
    domain_lower = domain.lower()
    
    # Try exact match first
    if domain_lower in MOCK_QUESTIONS:
        q_data = MOCK_QUESTIONS[domain_lower]
    else:
        # Try to find partial match
        for key in MOCK_QUESTIONS.keys():
            if key in domain_lower or domain_lower in key:
                q_data = MOCK_QUESTIONS[key]
                break
        else:
            # Default to general
            q_data = MOCK_QUESTIONS["general"]
    
    return q_data


@app.route("/start_interview", methods=["POST"])
def start_interview():
    try:
        data = request.get_json()
        domain = data.get("domain", "General")

        try:
            # ===== TRY GEMINI API FIRST =====
            prompt = f"""
            Create interview questions for {domain}.

            IMPORTANT:
            - Return ONLY ONE valid JSON object.
            - No explanation.
            - No markdown.
            - No code blocks.
            - Format:
            {{
                "technical": [],
                "coding": [],
                "behavioral": []
            }}
            """

            ai_response = safe_generate(prompt)

            # Validate AI response
            if not ai_response:
                raise Exception("Empty or invalid AI response")

            # extract JSON safely
            match = re.search(r'\{.*\}', ai_response, re.DOTALL)

            if not match:
                raise Exception("AI did not return valid JSON")

            json_text = match.group(0)

            # parse JSON safely
            try:
                q_data = json.loads(json_text)
            except json.JSONDecodeError:
                raise Exception("Invalid JSON from AI")

        except Exception as api_error:
            # ===== FALLBACK TO MOCK DATA =====
            print(f"⚠️ API Error: {api_error} - Using mock data for domain: {domain}")
            q_data = get_mock_questions(domain)

        # ----------------------------
        # 🔹 Build questions (fixed size)
        # ----------------------------
        questions = [
            "Please introduce yourself briefly (education, skills, projects)."
        ]

        questions += q_data.get("technical", [])[:TECH_Q]
        questions += q_data.get("coding", [])[:CODING_Q]
        questions += q_data.get("behavioral", [])[:BEHAVIOR_Q]

        return jsonify({
            "questions": questions,
            "state": {
                "domain": domain,
                "total_questions": len(questions)
            }
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ==========================================================
# 🔹 FINAL EVALUATION (ONE AI CALL)
# ==========================================================

@app.route("/final_evaluate", methods=["POST"])
def final_evaluate():
    try:
        data = request.get_json(silent=True) or {}

        questions = data.get("questions", [])
        answers = data.get("answers", [])

        # ----- validation -----
        if not questions or not answers:
            return jsonify({
                "error": "questions and answers are required"
            }), 400

        try:
            # ===== TRY GEMINI API FIRST =====
            prompt = f"""
            Evaluate this interview professionally.

            Questions: {questions}
            Answers: {answers}

            Give JSON response with:
            - average_score (integer 0-10)
            - strengths (string)
            - improvements (string)
            - suggestions (array of strings)
            - final_feedback (string)

            Return ONLY valid JSON, no markdown, no code blocks.
            """

            feedback = safe_generate(prompt)

            if not feedback:
                raise Exception("Empty response from Gemini")

            # Extract JSON
            match = re.search(r'\{.*\}', feedback, re.DOTALL)
            if not match:
                raise Exception("No JSON found in response")

            result = json.loads(match.group(0))
            
            # Validate and fix suggestions format
            if "suggestions" in result:
                if isinstance(result["suggestions"], str):
                    # Convert comma-separated string to array
                    result["suggestions"] = [s.strip() for s in result["suggestions"].split(",")]
                elif not isinstance(result["suggestions"], list):
                    result["suggestions"] = []
            else:
                result["suggestions"] = []
            
            # Ensure suggestions is always a list
            if not isinstance(result.get("suggestions"), list):
                result["suggestions"] = []
            
            # Validate required fields
            if not all(k in result for k in ["average_score", "final_feedback", "suggestions"]):
                raise Exception("Missing required fields in response")
            
        except Exception as api_error:
            # ===== FALLBACK TO MOCK EVALUATION =====
            print(f"⚠️ Evaluation API Error: {api_error} - Using mock evaluation")
            
            # Enhance mock data based on answer length
            avg_answer_length = sum(len(a) for a in answers) / len(answers) if answers else 0
            
            mock_score = 7.5
            if avg_answer_length > 150:
                mock_score = 8.2
            elif avg_answer_length > 100:
                mock_score = 7.8
            elif avg_answer_length < 50:
                mock_score = 6.0
            
            result = {
                "average_score": mock_score,
                "strengths": MOCK_EVALUATION["strengths"],
                "improvements": MOCK_EVALUATION["improvements"],
                "final_feedback": MOCK_EVALUATION["final_feedback"],
                "suggestions": MOCK_EVALUATION["suggestions"] if isinstance(MOCK_EVALUATION["suggestions"], list) else [MOCK_EVALUATION["suggestions"]]
            }

        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ==========================================================
# 🔹 ATS SCORE
# ==========================================================

@app.route("/ats_score", methods=["POST"])
def ats_score():
    try:
        file = request.files["resume"]
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        file.save(file_path)

        resume_text = extract_text_from_pdf(file_path)

        prompt = f"""
        Give ATS score (0-100) with strengths and improvements.

        Resume:
        {resume_text}

        Return JSON.
        """

        response = safe_generate(prompt)

        start = response.find("{")
        end = response.rfind("}") + 1
        return jsonify(json.loads(response[start:end]))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================================================
# 🔹 DIGITAL TWIN (FILE INPUT)
# ==========================================================

@app.route("/digital_twin", methods=["POST"])
def digital_twin():
    try:
        # ---- Receive file ----
        if "resume" not in request.files:
            return jsonify({"error": "resume file required"}), 400

        file = request.files["resume"]
        target_role = request.form.get("target_role", "Software Engineer")

        # Save file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        file.save(file_path)

        # Extract resume text
        resume_text = extract_text_from_pdf(file_path)

        if not resume_text.strip():
            return jsonify({"error": "Could not extract text from PDF"}), 400

        try:
            # ===== GEMINI ANALYSIS =====
            prompt = f"""
            You are an AI career coach.

            Analyze this resume for the target role: {target_role}

            Resume:
            {resume_text}

            Return ONLY valid JSON:

            {{
              "career_readiness_score": number (0-100),
              "summary": string,
              "skill_gaps": [string],
              "recommended_learning_path": [string],
              
            }}

            No markdown.
            """

            ai_response = safe_generate(prompt)

            match = re.search(r"\{.*\}", ai_response, re.DOTALL)
            if not match:
                raise Exception("Invalid AI response")

            result = json.loads(match.group(0))

        except Exception as e:
            print("⚠️ Digital twin fallback:", e)

            # MOCK FALLBACK
            result = {
                "career_readiness_score": 65,
                "strengths": [
                    "Good project exposure",
                    "Strong fundamentals",
                    "Learning mindset"
                ],
                "skill_gaps": [
                    "System design",
                    "Advanced backend concepts",
                    "Cloud deployment"
                ],
                "recommended_learning_path": [
                    "Build one full-stack project",
                    "Practice DSA daily",
                    "Learn cloud basics"
                ],
                "recommended_roles": [
                    "Frontend Developer",
                    "Full Stack Developer"
                ],
                "summary": "Good foundation but needs deeper practical experience."
            }

        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ==========================================================
# 🔹 RUN
# ==========================================================

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
