from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo


# Initialize Flask app and set up CORS
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Set up MongoDB URI for local MongoDB or use MongoDB Atlas connection string
app.config["MONGO_URI"] = "mongodb+srv://austintran616:HMw5ST6kB91brIKN@cluster0.cc5kh.mongodb.net/flashcard_db?retryWrites=true&w=majority&appName=Cluster0"

mongo = PyMongo(app)

from routes import *
from auth import auth_bp
app.register_blueprint(auth_bp)


# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
