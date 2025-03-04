from flask import Blueprint, request, jsonify
import google.auth.transport.requests
import google.oauth2.id_token
from app import GOOGLE_CLIENT_ID


auth_bp = Blueprint('auth', __name__) # Create a blueprint for authentication

@auth_bp.route('/login', methods=['POST'])
def google_login():
    try:
        # Get the token from the request
        token = request.json.get('token')
        if not token:
            return jsonify({"error": "Token is missing"}), 400

        # Verify the token
        id_info = google.oauth2.id_token.verify_oauth2_token(
            token,
            google.auth.transport.requests.Request(),
            GOOGLE_CLIENT_ID
        )

        if 'email' not in id_info:
            return jsonify({"error": "Invalid token"}), 400

        # Extract user information
        user_data = {
            "email": id_info['email'],
            "name": id_info.get('name', ''),
            "picture": id_info.get('picture', '')
        }
        
        # Return the user data to the frontend
        return jsonify(user_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400