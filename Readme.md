# My Gemini Chat App

An interactive chat application powered by Google's Gemini AI model that supports multi-turn conversations and file analysis.

## Features

- Real-time chat interface with Gemini AI
- Support for file uploads (documents, images, etc.)
- Customizable system instructions
- Streaming responses
- Multi-turn conversation support

## Prerequisites

1. **Node.js Installation**  
   Make sure Node.js is installed on your machine.  
   Run the following command in your terminal to verify:
   ```bash
   node -v
   ```

2. **Gemini API Key**  
   Obtain your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <https://github.com/ankitj885/my-gemini-app.git>
   cd my-gemini-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Add your Gemini API key in `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

5. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Using the Chat Interface

1. **Basic Chat**
   - Type your message in the text area
   - Click "Send" or press Enter to submit
   - Wait for the AI's response to stream in

2. **File Analysis**
   - Click "Choose File" to upload a document or image
   - Add your question about the file in the text area
   - Submit to get AI's analysis of the file

3. **Custom Instructions**
   - Use the "System Instructions" field to customize AI's behavior
   - Example: "You are a technical interviewer for a Java position"
   - Leave empty to use default settings

4. **Multi-turn Conversations**
   - Continue the conversation by sending follow-up messages
   - The AI maintains context from previous exchanges
   - Start a new session by refreshing the page

## Troubleshooting

- If the server doesn't start, check if:
  - Port 3000 is available
  - `.env` file is properly configured
  - All dependencies are installed
- If file upload fails, verify that:
  - File size is within limits
  - File format is supported

## Technical Details

- Backend: Node.js with Express
- Frontend: Vanilla JavaScript
- AI: Google's Gemini-2.5-flash model
- Real-time streaming using Server-Sent Events (SSE)

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Replace the dummy API key in `.env` with your actual Gemini API key:
   ```properties
   GEMINI_API_KEY=your_actual_api_key_here
   ```