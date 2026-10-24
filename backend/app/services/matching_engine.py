import numpy as np
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_embedding(text: str, model: str = "text-embedding-3-large") -> list[float]:
    response = client.embeddings.create(
        model=model,
        input=text
    )
    return response.data[0].embedding

def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    if np.linalg.norm(vec1) == 0 or np.linalg.norm(vec2) == 0:
        return 0.0
    return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

def batch_similarity(cv_embedding: list[float], job_embeddings: list[list[float]]) -> list[float]:
    return [cosine_similarity(cv_embedding, job_emb) for job_emb in job_embeddings]

def serialize_cv(cv_parsed: dict) -> str:
    parts = []
    if "skills" in cv_parsed:
        parts.append("Skills: " + ", ".join(cv_parsed["skills"]))
    if "education" in cv_parsed:
        edu_strs = []
        for edu in cv_parsed["education"]:
            edu_strs.append(f"{edu.get('degree', '')} at {edu.get('institution', '')}")
        parts.append("Education: " + "; ".join(edu_strs))
    if "experience" in cv_parsed:
        exp_strs = []
        for exp in cv_parsed["experience"]:
            exp_strs.append(f"{exp.get('title', '')} ({exp.get('year', '')}): {exp.get('description', '')}")
        parts.append("Experience: " + " | ".join(exp_strs))
    return " ".join(parts)

def serialize_job_offer(job_offer: dict) -> str:
    parts = []
    if "title" in job_offer:
        parts.append(f"Job Title: {job_offer['title']}")
    if "description" in job_offer:
        parts.append(f"Description: {job_offer['description']}")
    if "required_skills" in job_offer:
        parts.append("Required Skills: " + ", ".join(job_offer["required_skills"]))
    return " ".join(parts)

def compute_similarity_score(cv_text: str, job_text: str) -> float:
    try:
        cv_embedding = get_embedding(cv_text)
        job_embedding = get_embedding(job_text)
        return cosine_similarity(cv_embedding, job_embedding)
    except Exception as e:
        print(f"[Similarity Error] {e}")
        return 0.0
    
async def generate_justification(cv_text: str, job_text: str) -> str:
    prompt = f"""
Tu es un assistant RH. Compare le profil du candidat avec l'offre d'emploi et explique pourquoi ce match est pertinent ou non.

CV du candidat:
{cv_text}

Offre d'emploi:
{job_text}

Justification du match:
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",  # or "gpt-3.5-turbo"
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[Justification Error] {e}")
        return "Justification non disponible."