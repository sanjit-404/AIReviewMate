# AIReviewMate — Frontend

This is the **frontend** of **AIReviewMate**, an intelligent code review assistant that provides real-time feedback and code improvements using **Google Gemini AI**.  
Built with **Next.js**, **React**, and **Tailwind CSS**, it offers a smooth and responsive developer experience with real-time AI analysis and code diff visualization.

**Live Demo:** [https://ai-review-mate-xi.vercel.app/](https://ai-review-mate-xi.vercel.app/)

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **UI Library** | React.js |
| **Styling** | Tailwind CSS |
| **Code Editor** | Monaco Editor |
| **Diff Viewer** | React Diff Viewer Continued |
| **HTTP Client** | Axios |
| **Deployment** | Vercel |

---

## Key Features

-  **Real-time Code Analysis** — Automatic AI feedback as you type  
-  **Multi-language Support** — Supports JavaScript, Python, Java, C++, HTML, and CSS  
-  **Diff Viewer** — Side-by-side comparison of original and improved code  
-  **Dark/Light Mode** — Persistent theme preferences  
-  **Monaco Editor Integration** — Smooth editing with syntax highlighting  
-  **Smart Debouncing** — 1.5s delay to reduce unnecessary API calls  
-  **Responsive Design** — Works on all screen sizes  

---

##  Folder Structure

```
app/
 ├─ page.js               # Main application page
 ├─ layout.js             # Root layout with theme provider
 ├─ globals.css           # Global styles and Tailwind imports

components/
 ├─ Monaco Editor         # Code editor component
 ├─ Diff Viewer           # Code comparison component
 ├─ Theme Toggle          # Dark/Light mode switcher
 ├─ Language Selector     # Dropdown for selecting programming language
```

---

##  Setup & Installation

### **Prerequisites**
- Node.js ≥ 18.0  
- npm ≥ 9.0  
- Backend URL (Render deployment)

### **Steps**
```bash
# Clone repository
git clone <repository-url>
cd CodeMentor-Al-twofold-updated

# Install dependencies
npm install

# Create environment variable file
echo "NEXT_PUBLIC_API_URL=https://aireviewmate.onrender.com" >> .env.local

# Run development server
npm run dev
```

Access the frontend at **[https://ai-review-mate-xi.vercel.app/](https://ai-review-mate-xi.vercel.app/)**
---

##  API Integration

The frontend communicates with the backend API hosted on **Render** via the `/review` endpoint.  
All code reviews and AI improvements are fetched dynamically using Axios requests.

---

## Theming

- Persistent **Dark/Light mode** toggle using local storage.  
- Global styles managed via Tailwind CSS configuration.  

---

## Deployment (Vercel)

1. Push your frontend code to GitHub  
2. Connect the repository to **Vercel**  
3. Add environment variable: `NEXT_PUBLIC_API_URL`  
4. Deploy directly from your GitHub repository  

---

## Author

**Sanjit Kumar Srinivasan**  
[sanjitkumar.srinivasan@gmail.com](mailto:sanjitkumar.srinivasan@gmail.com)  
[LinkedIn](https://www.linkedin.com/in/sanjit-kumar-srinivasan-2a6261389/)  
[GitHub](https://github.com/sanjit-404)
