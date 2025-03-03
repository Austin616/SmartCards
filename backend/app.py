from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv
import openai


load_dotenv()
# Initialize OpenAI API
OPEN_AI = os.getenv("OPENAI_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_AUTH")

# Initialize Flask app and set up CORS
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Set up MongoDB URI for local MongoDB or use MongoDB Atlas connection string
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

mongo = PyMongo(app)

from routes import *
from auth import auth_bp
app.register_blueprint(auth_bp)


# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
