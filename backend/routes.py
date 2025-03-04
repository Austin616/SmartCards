from flask import request, jsonify, Blueprint
from app import app, mongo, OPEN_AI
from bson import ObjectId
import datetime
import openai
import os
from dotenv import load_dotenv


routes_bp = Blueprint('routes', __name__)

openai.api_key = OPEN_AI

@app.route('/')
def index():
    return "Welcome to the Flashcard API!"


# -------------- AI Routes --------------- 
@app.route('/api/test', methods=['GET'])
def test():
    try:
        # Use the updated OpenAI API (chat completion instead of text completion)
        response = openai.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": "Hello, world!"}])
        return jsonify({"message": "Test successful!", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text')
    
    if not text:
        return jsonify({"error": "Text is required"}), 400
    
    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": f"Summarize the following text: {text}"}]
        )
        summary = response.choices[0].message.content.strip()
        return jsonify({"summary": summary}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    context = data.get('context')  # This can be the summary or the full text

    if not question or not context:
        return jsonify({"error": "Question and context are required"}), 400

    try:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a friendly and empathetic assistant, always responding with kindness and positivity."},
                {"role": "user", "content": f"Can you help me with the following question based on this context? {context}\n\nQuestion: {question}"}
            ]
        )
        answer = response.choices[0].message.content.strip()
        return jsonify({"answer": answer}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# -------------- Set Routes --------------
@app.route('/api/sets', methods=['POST'])
def create_set():
    data = request.json
    set_name = data.get('name')
    user_email = data.get('user_email')

    if not set_name or not user_email:
        return jsonify({"error": "Set name and user email are required"}), 400

    new_set = {
        'name': set_name,
        'user_email': user_email,  # Associate set with a specific user
        'created_at': datetime.datetime.now()
    }
    
    result = mongo.db.sets.insert_one(new_set)
    return jsonify({"message": "Set created successfully!", "set_id": str(result.inserted_id)}), 201


@app.route('/api/sets', methods=['GET'])
def get_sets():
    user_email = request.args.get('user_email')
    
    if not user_email:
        return jsonify({"error": "User email is required"}), 400

    sets = list(mongo.db.sets.find({"user_email": user_email}, {"_id": 1, "name": 1}))
    for set_data in sets:
        set_data["_id"] = str(set_data["_id"])  # Convert ObjectId to string

    return jsonify(sets)

@app.route('/api/sets/<set_id>', methods=['PUT'])
def update_set(set_id):
    data = request.json
    set_name = data.get('name')
    
    if not set_name:
        return jsonify({"error": "Set name is required"}), 400

    try:
        result = mongo.db.sets.update_one(
            {'_id': ObjectId(set_id)},
            {'$set': {'name': set_name}}
        )
        
        if result.modified_count == 1:
            return jsonify({"message": "Set updated successfully!"}), 200
        else:
            return jsonify({"error": "Set not found or no changes made"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/sets/<set_id>', methods=['GET'])
def get_set_by_id(set_id):
    set = mongo.db.sets.find_one({"_id": ObjectId(set_id)}, {"_id": 0})
    if set:
        return jsonify(set)
    else:
        return jsonify({"error": "Set not found"}), 404

@app.route('/api/sets/<set_id>', methods=['DELETE'])
def delete_set(set_id):
    user_email = request.args.get('user_email')

    if not user_email:
        return jsonify({"error": "User email is required"}), 400

    set_to_delete = mongo.db.sets.find_one({'_id': ObjectId(set_id), 'user_email': user_email})

    if not set_to_delete:
        return jsonify({"error": "Set not found or you do not have permission to delete it"}), 404

    mongo.db.sets.delete_one({'_id': ObjectId(set_id)})
    mongo.db.flashcards.delete_many({'set_id': set_id})  # Delete associated flashcards

    return jsonify({"message": "Set and associated flashcards deleted successfully!"}), 200


# -------------- Flashcard Routes --------------
@app.route('/api/flashcards', methods=['POST'])
def create_flashcard():
    data = request.json
    user_email = data.get('user_email')
    set_id = data.get('set_id')
    
    if not user_email or not set_id:
        return jsonify({"error": "User email and set ID are required"}), 400
    
    flashcard = {
        'question': data['question'],
        'answer': data['answer'],
        'category': data.get('category', ''),
        'user_email': user_email,
        'set_id': set_id,
        'created_at': datetime.datetime.now()
    }
    
    # Insert the flashcard and get the inserted ID
    result = mongo.db.flashcards.insert_one(flashcard)
    
    # Add the _id to the flashcard response
    flashcard['_id'] = str(result.inserted_id)
    
    return jsonify(flashcard), 201


@app.route('/api/sets/<set_id>/flashcards', methods=['GET'])
def get_flashcards_by_set(set_id):
    flashcards = list(mongo.db.flashcards.find({"set_id": set_id}))
    
    # Ensure the _id is returned as a string
    for flashcard in flashcards:
        flashcard["_id"] = str(flashcard["_id"])  # Convert ObjectId to string
    
    return jsonify(flashcards)


@app.route('/api/flashcards', methods=['DELETE'])
def delete_all_flashcards():
    user_email = request.args.get('user_email')
    
    if not user_email:
        return jsonify({"error": "User email required"}), 400

    try:
        result = mongo.db.flashcards.delete_many({'user_email': user_email})
        return jsonify({"message": f"{result.deleted_count} flashcards deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sets/<set_id>/flashcards', methods=['DELETE'])
def delete_flashcards_by_set(set_id):
    try:
        result = mongo.db.flashcards.delete_many({'set_id': set_id})
        return jsonify({"message": f"{result.deleted_count} flashcards deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/flashcards/<flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    try:
        result = mongo.db.flashcards.delete_one({'_id': ObjectId(flashcard_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Flashcard deleted successfully!"}), 200
        else:
            return jsonify({"error": "Flashcard not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test_db_connection')
def test_db_connection():
    try:
        # Try to fetch a document from a collection to verify the connection
        mongo.db.sets.find_one()
        return "Connection successful!"
    except Exception as e:
        return f"Error: {str(e)}"
