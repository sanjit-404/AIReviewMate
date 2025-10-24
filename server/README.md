# AIReviewMate — Backend

This is the **backend API** for **AIReviewMate**, responsible for handling code review requests and integrating with **Google Gemini 2.0 Flash AI** to generate intelligent feedback and suggestions.

Built with **Node.js** and **Express**, the backend serves RESTful endpoints for real-time AI code analysis.

**Live API:** [https://aireviewmate.onrender.com/](https://aireviewmate.onrender.com/)
---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **AI Integration** | Google Gemini 2.0 Flash |
| **Deployment** | Render |
| **Environment Management** | dotenv |
| **HTTP Client** | node-fetch |

---

## Folder Structure

```
server/
 ├─ server.js             # Express server entry point
 ├─ package.json          # Dependencies and scripts
 ├─ .env                  # Environment variables (Google API Key)

Routes/
 ├─ /review               # AI code review endpoint
 ├─ /                     # Health check endpoint
```

---

## AI Integration (Google Gemini 2.0 Flash)

The backend uses Google Gemini’s **code understanding model** to analyze source code.  
It processes structured prompts and returns categorized suggestions in JSON format.

### Example Response:
```json
{
  "improved_code": "function hello() { console.info('hello') }",
  "explanation": "Replaced console.log with console.info for better practices",
  "category": "Best Practices"
}
```

---

## Installation & Setup

### **Prerequisites**
- Node.js ≥ 18.0  
- npm ≥ 9.0  
- Google Gemini API Key  

### **Steps**
```bash
# Clone repository
git clone <repository-url>
cd CodeMentor-Al-twofold-updated

# Install dependencies
npm install

# Create .env file
echo "GOOGLE_API_KEY=your_gemini_api_key_here" >> .env
echo "PORT=4000" >> .env

# Start server
npm start
```

Server runs at **http://localhost:4000**

---

## API Endpoints

### `POST /review`
Analyze the provided code and return AI-generated feedback.

#### Request
```json
{
  "code": "function hello() { console.log('hello') }",
  "language": "javascript"
}
```

#### Response
```json
{
  "improved_code": "function hello() { console.info('hello') }",
  "explanation": "Replaced console.log with console.info for better practices",
  "category": "Best Practices"
}
```

### `GET /`
Health check endpoint that returns server status.

---

## Deployment (Render)

1. Push your backend repository to GitHub  
2. Create a **Web Service** on **Render**  
3. Connect your repository  
4. Set environment variables:  
   - `GOOGLE_API_KEY`  
   - `PORT`  
5. Deploy — Render automatically builds and runs the server  

---

## Error Handling & Reliability

- Fallback responses when AI API is unavailable  
- Request validation for required parameters  
- Structured error messages with status codes  

---

## Future Plans

- Authentication for secure access  
- Rate limiting to prevent API abuse  
- Logging & analytics integration  
- Support for custom model selection  

---

## Author

**Sanjit Kumar Srinivasan**  
[sanjitkumar.srinivasan@gmail.com](mailto:sanjitkumar.srinivasan@gmail.com)  
[LinkedIn](https://www.linkedin.com/in/sanjit-kumar-srinivasan-2a6261389/)  
[GitHub](https://github.com/sanjit-404)
