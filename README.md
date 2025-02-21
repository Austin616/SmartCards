# Flashcard AI App

## Overview

Flashcard AI is a full-stack application that converts PDFs or text files into interactive flashcards using AI. The app includes gamification elements, a leveling system, and a social feature where users can add friends and track their progress.

## Features

- **AI-Powered Flashcards**: Automatically generate flashcards from PDFs and text files.
- **Gamification**: Leveling system to track progress.
- **Social Features**: Add friends and see their progress on a leaderboard.
- **Authentication**: Google OAuth for secure login.
- **Full-Stack Architecture**: Built with React, Flask, MongoDB, and OpenAI API.

## Technologies Used

- **Frontend**: React + Vite
- **Backend**: Flask
- **Database**: MongoDB
- **AI Integration**: OpenAI API
- **Authentication**: Google OAuth

## Installation

### Backend Setup (Flask)

1. **Create a virtual environment and install dependencies:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

2. **Start the Flask server:**
   ```sh
   flask run
   ```

### Frontend Setup (React)

1. **Navigate to the frontend folder:**
   ```sh
   cd ../frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the React development server:**
   ```sh
   npm run dev
   ```

## Usage

- Upload a PDF or text file to generate flashcards.
- Review flashcards and track progress.
- Add friends and view their progress in the leaderboard.
- Level up by completing flashcard sessions.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```sh
   git push origin feature-name
   ```
5. Open a pull request.

## Contact

For any questions or support, reach out via email at austintran616@gmail.com or open an issue on GitHub.
