from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

# This auto-loads OPENAI_API_KEY from env
client = OpenAI()

def extract_cv_info_with_openai(cv_text: str) -> dict:
    prompt = f"""
You are an intelligent CV parser. Extract structured info from this resume:

\"\"\"{cv_text}\"\"\"

Return it in this exact JSON format (don't explain anything):
IMPORTANT: Do NOT explain anything. Just return a valid, parsable JSON. No markdown. No commentary.

{{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "education": [],
  "experience": []
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        content = response.choices[0].message.content.strip()
        return json.loads(content)

    except json.JSONDecodeError as e:
        return {
            "error": "Invalid JSON from OpenAI",
            "raw_output": content,
            "exception": str(e)
        }

    except Exception as e:
        return {
            "error": "OpenAI API call failed",
            "exception": str(e)
        }
