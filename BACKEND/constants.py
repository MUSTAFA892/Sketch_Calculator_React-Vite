from dotenv import load_dotenv
import os
load_dotenv()

SERVER_URL = '0.0.0.0'  # Render requires the app to listen on 0.0.0.0
PORT = 5000  # Render will automatically assign the correct port through the web process
ENV = 'prod' 

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")