from flask import request, jsonify, Blueprint
from app import app, mongo
from bson import ObjectId
import datetime

routes_bp = Blueprint('routes', __name__)

# Route to create a flashcard (POST request)
@app.route('/api/flashcards', methods=['POST'])
def create_flashcard():
    # Get the JSON data from the request body
    data = request.json
    user_email = data.get('user_email')
    
    flashcard = {
        'question': data['question'],
        'answer': data['answer'],
        'category': data.get('category', ''),
        'user_email': user_email,
        'created_at': datetime.datetime.utcnow()
    }
    # Insert the flashcard into MongoDB
    mongo.db.flashcards.insert_one(flashcard)
    return jsonify({"message": "Flashcard created successfully!"}), 201

# Route to get all flashcards (GET request)
@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    user_email = request.args.get('user_email')
    
    if not user_email:
        return jsonify({"error": "User email required"}), 400

    # Fetch only flashcards that match the given user_email
    flashcards = list(mongo.db.flashcards.find({"user_email": user_email}, {"_id": 0}))  
    
    return jsonify(flashcards)

# Route to get a specific flashcard by ID (GET request)
@app.route('/api/flashcards/<id>', methods=['GET'])
def get_flashcard(id):
    flashcard = mongo.db.flashcards.find_one({'_id': ObjectId(id)})
    if flashcard:
        return jsonify({
            'question': flashcard['question'],
            'answer': flashcard['answer'],
            'category': flashcard['category']
        })
    else:
        return jsonify({"message": "Flashcard not found!"}), 404

# Route to update a flashcard (PUT request)
@app.route('/api/flashcards/<id>', methods=['PUT'])
def update_flashcard(id):
    data = request.json
    updated_flashcard = {
        'question': data['question'],
        'answer': data['answer'],
        'category': data.get('category', '')
    }
    result = mongo.db.flashcards.update_one(
        {'_id': ObjectId(id)},
        {'$set': updated_flashcard}
    )
    if result.matched_count > 0:
        return jsonify({"message": "Flashcard updated successfully!"})
    else:
        return jsonify({"message": "Flashcard not found!"}), 404

# Route to delete a flashcard (DELETE request)
@app.route('/api/flashcards/<id>', methods=['DELETE'])
def delete_flashcard(id):
    result = mongo.db.flashcards.delete_one({'_id': ObjectId(id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Flashcard deleted successfully!"})
    else:
        return jsonify({"message": "Flashcard not found!"}), 404
    
# Route to delete all flashcards (DELETE request)
@app.route('/api/flashcards', methods=['DELETE'])
def delete_all_flashcards():
    try:
        mongo.db.flashcards.delete_many({})
        return jsonify({"message": "All flashcards deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
