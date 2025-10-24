'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import DiffViewer from 'react-diff-viewer-continued'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function Page() {
  const [code, setCode] = useState(`// Welcome to CodeMentor AI
const greet = (name = 'Web Enthusiast') => {
  return \`Hello, \${name}! Ready to level up your code?\`;
}`)
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [debouncedCode, setDebouncedCode] = useState('')
  const [language, setLanguage] = useState('javascript') // ← ADDED LANGUAGE STATE

  // SIMPLE theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setDarkMode(savedTheme === 'dark')
  }, [])

  // DEBOUNCING EFFECT
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code)
    }, 1500) // Wait 1.5 seconds after user stops typing
    
    return () => clearTimeout(timer) // Cancel if user types again
  }, [code])

  // AUTO-REVIEW EFFECT
  useEffect(() => {
    if (debouncedCode && debouncedCode.trim().length > 10) { // Only if meaningful code
      requestReview()
    }
  }, [debouncedCode])

  // SIMPLE theme functions
  const setLightMode = () => {
    console.log('LIGHT button clicked')
    localStorage.setItem('theme', 'light')
    setDarkMode(false)
  }

  const setDarkModeFunc = () => {
    console.log('DARK button clicked')  
    localStorage.setItem('theme', 'dark')
    setDarkMode(true)
  }

  async function requestReview() {
    if (loading) return // ← PREVENT MULTIPLE REQUESTS
    
    setLoading(true)
    setSuggestion(null)
    try {
      const resp = await axios.post((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/review', { 
        code: debouncedCode || code, // Use debounced code if available
        language: language // ← SEND LANGUAGE TO BACKEND
      })
      setSuggestion(resp.data)
    } catch (err) {
      console.error(err)
      // Don't show alert for auto-requests to avoid spam
    }
    setLoading(false)
  }

  // UPDATE DEFAULT CODE WHEN LANGUAGE CHANGES
  useEffect(() => {
    const defaultCode = {
      javascript: `// Welcome to CodeMentor AI
const greet = (name = 'Web Enthusiast') => {
  return \`Hello, \${name}! Ready to level up your code?\`;
}`,
      python: `# Welcome to CodeMentor AI
def greet(name="Web Enthusiast"):
    return f"Hello, {name}! Ready to level up your code?"`,
      java: `// Welcome to CodeMentor AI
public class Main {
    public static String greet(String name) {
        return "Hello, " + (name != null ? name : "Web Enthusiast") + "! Ready to level up your code?";
    }
}`,
      cpp: `// Welcome to CodeMentor AI
#include <string>
using namespace std;

string greet(string name = "Web Enthusiast") {
    return "Hello, " + name + "! Ready to level up your code?";
}`,
      html: `<!DOCTYPE html>
<!-- Welcome to CodeMentor AI -->
<html>
<head>
    <title>CodeMentor AI</title>
</head>
<body>
    <h1>Hello, Web Enthusiast! Ready to level up your code?</h1>
</body>
</html>`,
      css: `/* Welcome to CodeMentor AI */
.welcome-message {
    font-family: 'Arial', sans-serif;
    color: #333;
    text-align: center;
    margin: 2rem;
}

.welcome-message::before {
    content: "Hello, Web Enthusiast! Ready to level up your code?";
}`
    }
    setCode(defaultCode[language])
  }, [language])

  return (
    <div style={{ 
      backgroundColor: darkMode ? '#1f2937' : 'white',
      color: darkMode ? 'white' : 'black',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* SIMPLE header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px',
        padding: '16px',
        backgroundColor: darkMode ? '#374151' : '#f3f4f6',
        borderRadius: '12px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>CodeMentor AI</h1>
        
        {/* SIMPLE buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* LANGUAGE SELECTOR - ADDED */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
              color: darkMode ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>

          <button
            onClick={setLightMode}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: !darkMode ? '#4b5563' : '#9ca3af',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ☀️ Light
          </button>
          <button
            onClick={setDarkModeFunc}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: darkMode ? '#6b7280' : '#d1d5db', 
              color: darkMode ? 'white' : '#4b5563',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🌙 Dark
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Code Editor - ALWAYS DARK */}
        <div style={{ 
          backgroundColor: '#111827', 
          borderRadius: '12px', 
          overflow: 'hidden',
          border: '2px solid #374151'
        }}>
          <MonacoEditor 
            height="400px" 
            language={language} // ← CHANGED TO DYNAMIC LANGUAGE
            value={code} 
            onChange={(v)=>setCode(v||'')} 
            theme="vs-dark"
            options={{
              automaticLayout: true,
              minimap: { enabled: false }
            }} 
          />
          <div style={{ padding: '16px', backgroundColor: '#1f2937' }}>
            <button 
              onClick={requestReview} 
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4b5563',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
              disabled={loading}
            >
              {loading ? 'Reviewing...' : 'Review Code'}
            </button>
          </div>
        </div>
        
        {/* Suggestions Panel */}
        <div style={{ 
          backgroundColor: darkMode ? '#374151' : 'white',
          border: `2px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            AI Suggestions {loading && '(Analyzing...)'}
          </h2>
          
          {suggestion ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Suggestion</span>
                  <div style={{ 
                    fontSize: '14px', 
                    marginTop: '4px',
                    color: darkMode ? '#d1d5db' : '#6b7280'
                  }}>
                    {suggestion.explanation}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: darkMode ? '#4b5563' : '#e5e7eb',
                  color: darkMode ? 'white' : '#374151'
                }}>
                  {suggestion.category}
                </span>
              </div>
              <DiffViewer 
                oldValue={code} 
                newValue={suggestion.improved_code || suggestion.improvedCode || ''} 
                splitView={true} 
                hideLineNumbers={false} 
                showDiffOnly={false}
              />
              
              {/* ✅ ACCEPT/DECLINE BUTTONS */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  onClick={() => {
                    setCode(suggestion.improved_code || suggestion.improvedCode || '')
                    setSuggestion(null)
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    flex: 1
                  }}
                >
                  ✅ Accept Changes
                </button>
                <button 
                  onClick={() => setSuggestion(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    flex: 1
                  }}
                >
                  ❌ Decline
                </button>
              </div>
            </div>
          ) : loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 0',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>🔄</div>
              Analyzing your code...
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 0',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              AI suggestions will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}