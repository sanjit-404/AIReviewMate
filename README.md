#  AIReviewMate

**AIReviewMate** is an intelligent code review assistant that provides **real-time feedback and improvements** as you type.  
Built with **modern web technologies** and powered by **Google Gemini AI**, it analyzes your code instantly and suggests optimizations across multiple programming languages.

**Live Demo:** [https://ai-review-mate-xi.vercel.app/](https://ai-review-mate-xi.vercel.app/)  
**Backend API:** [https://aireviewmate.onrender.com/](https://aireviewmate.onrender.com/)

---

## Features

-  **Real-time Code Analysis** — AI-powered reviews trigger automatically as you type  
-  **Multi-language Support** — JavaScript, Python, Java, C++, HTML, CSS  
-  **Smart Debouncing** — Optimized API calls with 1.5s delay after typing stops  
-  **Side-by-side Diff Viewer** — Visual comparison of original vs improved code  
-  **Categorized Suggestions** — Best Practices, Performance, Bug Fixes with explanations  
-  **One-click Apply** — Accept/Decline suggestions with instant code replacement  
-  **Dark/Light Theme** — Toggle with persistent preferences  
-  **Monaco Editor** — Professional code editing experience with syntax highlighting  
-  **Responsive Design** — Works seamlessly across all devices  

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend Framework** | Next.js 14 (App Router) |
| **UI Library** | React.js |
| **Styling** | Tailwind CSS |
| **Code Editor** | Monaco Editor |
| **Diff Visualization** | React Diff Viewer Continued |
| **Backend Runtime** | Node.js + Express |
| **AI Integration** | Google Gemini 2.0 Flash |
| **Deployment** | Vercel (Frontend) + Render (Backend) |
| **HTTP Client** | Axios |

---

## Project Structure

### **Frontend (Vercel)**
```
app/
 ├─ page.js               # Main application page
 ├─ layout.js             # Root layout with theme provider
 ├─ globals.css           # Global styles and Tailwind imports

components/
 ├─ Monaco Editor         # Code editor component
 ├─ Diff Viewer           # Code comparison component
 ├─ Theme Toggle          # Dark/Light mode switcher
 ├─ Language Selector     # Multi-language support
```

### **Backend (Render)**
```
server/
 ├─ server.js             # Express server setup
 ├─ package.json          # Dependencies and scripts
 ├─ .env                  # Environment variables (Google API Key)

Routes/
 ├─ /review               # AI code review endpoint
 ├─ /                     # Health check endpoint
```

---

## Installation & Setup

### **Prerequisites**
- Node.js ≥ 18.0  
- npm ≥ 9.0  
- Google Gemini API Key  

### **Frontend Setup (Vercel)**
```bash
# Clone the repository
git clone <repository-url>
cd CodeMentor-Al-twofold-updated

# Install dependencies
npm install

# Set up environment variables
echo "NEXT_PUBLIC_API_URL=https://aireviewmate.onrender.com" >> .env.local

# Run development server
npm run dev
```

### **Backend Setup (Render)**
```bash
# Install dependencies
npm install

# Set up environment variables
echo "GOOGLE_API_KEY=your_gemini_api_key_here" >> .env
echo "PORT=4000" >> .env

# Start the server
npm start
```

Access the app at **[https://ai-review-mate-xi.vercel.app/](https://ai-review-mate-xi.vercel.app/)**

---

## API Endpoints

### `POST /review`
Analyzes code and returns AI suggestions.

#### **Request**
```json
{
  "code": "function hello() { console.log('hello') }",
  "language": "javascript"
}
```

#### **Response**
```json
{
  "improved_code": "function hello() { console.info('hello') }",
  "explanation": "Replaced console.log with console.info for better practices",
  "category": "Best Practices"
}
```

---

## Deployment

### **Frontend (Vercel)**
1. Connect your GitHub repository to Vercel  
2. Set environment variable: `NEXT_PUBLIC_API_URL`  
3. Deploy automatically on **git push**

### **Backend (Render)**
1. Create a new **Web Service** on Render  
2. Connect your backend repository  
3. Set environment variables: `GOOGLE_API_KEY`, `PORT`  
4. Deploy and obtain your backend URL  

---

## AI Integration

The app uses **Google Gemini 2.0 Flash** for intelligent code analysis.

- **Prompt Engineering** — Structured prompts for consistent JSON responses  
- **Error Handling** — Fallback mock responses when API is unavailable  
- **Response Parsing** — Robust JSON parsing with multiple fallback strategies  
- **Category Classification** — Automatic categorization of AI suggestions  

---

## Performance Optimizations

- **Debounced Input** — 1.5-second delay prevents excessive API calls  
- **Request Cancellation** — “Latest-wins” logic for overlapping requests  
- **Loading States** — Smooth feedback during AI processing  
- **Error Boundaries** — Graceful fallback during API failures  

---

## Future Enhancements

- GitHub PR Integration — Automated pull requests with AI suggestions  
- User Authentication — Manage code review history  
---

## Author

**Sanjit Kumar Srinivasan**  
241ME348  

Email: [sanjitkumar.srinivasan@gmail.com](mailto:sanjitkumar.srinivasan@gmail.com)  
[LinkedIn](https://www.linkedin.com/in/sanjit-kumar-srinivasan-2a6261389/)  
[GitHub](https://github.com/sanjit-404)

---
