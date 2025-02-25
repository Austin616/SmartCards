from flask import request, jsonify, Blueprint
from app import app, mongo
from bson import ObjectId
import datetime

routes_bp = Blueprint('routes', __name__)

# -------------- Set Routes --------------
@app.route('/api/sets', methods=['POST'])
def create_set():
    data = request.json
    set_name = data.get('name')
    
    if not set_name:
        return jsonify({"error": "Set name is required"}), 400

    new_set = {
        'name': set_name,
        'created_at': datetime.datetime.utcnow()
    }
    
    result = mongo.db.sets.insert_one(new_set)
    return jsonify({"message": "Set created successfully!", "set_id": str(result.inserted_id)}), 201

@app.route('/api/sets', methods=['GET'])
def get_sets():
    sets = list(mongo.db.sets.find({}, {"_id": 1, "name": 1}))  # Only fetch _id and name
    for set_data in sets:
        set_data["_id"] = str(set_data["_id"])  # Convert ObjectId to string
    return jsonify(sets)


@app.route('/api/sets/<set_id>', methods=['GET'])
def get_set_by_id(set_id):
    set = mongo.db.sets.find_one({"_id": ObjectId(set_id)}, {"_id": 0})
    if set:
        return jsonify(set)
    else:
        return jsonify({"error": "Set not found"}), 404

@app.route('/api/sets/<set_id>', methods=['DELETE'])
def delete_set(set_id):
    try:
        result = mongo.db.sets.delete_one({'_id': ObjectId(set_id)})
        
        if result.deleted_count == 1:
            mongo.db.flashcards.delete_many({'set_id': set_id})
            return jsonify({"message": "Set and associated flashcards deleted successfully!"}), 200
        else:
            return jsonify({"error": "Set not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        'created_at': datetime.datetime.utcnow()
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
