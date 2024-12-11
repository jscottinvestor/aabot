from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for messages
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

# Set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        response = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": msg.role, "content": msg.content} for msg in request.messages],
        )
        return response.choices[0].message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
