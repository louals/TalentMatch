# generate_cover_letter.py
from openai import OpenAI
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def replace_placeholders(letter: str, parsed_info: dict) -> str:
    return (
        letter.replace("[Your Name]", parsed_info.get("name", ""))
              .replace("[Email]", parsed_info.get("email", ""))
              .replace("[Phone Number]", parsed_info.get("phone", ""))
              .replace("[Your Address]", parsed_info.get("address", ""))
              .replace("[City, State, ZIP]", parsed_info.get("location", "Montreal, QC"))
              .replace("[Today's Date]", datetime.now().strftime("%B %d, %Y"))
              .replace("[Company's Name]", parsed_info.get("company", ""))
              .replace("[Hiring Manager's Name]", parsed_info.get("hiring_manager", ""))
    )
    
async def generate_cover_letter(parsed_info: dict, job_info: dict) -> str:
    skills = parsed_info.get("skills") or parsed_info.get("tech_stack") or []
    education = parsed_info.get("education", [])
    experience = parsed_info.get("experience", [])

    prompt = f"""
    Write a professional and personalized cover letter based on:

    Candidate:
    Name: {parsed_info.get("name")}
    Email: {parsed_info.get("email")}
    Phone: {parsed_info.get("phone")}
    Skills: {", ".join(skills)}
    Education: {"; ".join([f"{e.get('degree', '')} at {e.get('institution', '')}" for e in education])}
    Experience: {"; ".join([f"{e.get('title', '')}: {e.get('description', '')}" for e in experience])}

    Job:
    Title: {job_info.get("title")}
    Description: {job_info.get("description")}
    Required Skills: {", ".join(job_info.get("required_skills", []))}

    Output a formal cover letter that includes placeholders like [Your Address], [City, State, ZIP], etc.
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    return response.choices[0].message.content.strip()