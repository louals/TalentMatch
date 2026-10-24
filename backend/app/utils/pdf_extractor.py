# app/utils/pdf_extractor.py

import fitz  # PyMuPDF
from typing import Optional

def extract_text_from_pdf(file_bytes: bytes) -> Optional[str]:
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")  
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        print(f"[PDF Extract Error] {e}")
        return None
