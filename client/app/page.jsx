'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import DiffViewer from 'react-diff-viewer-continued'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function Page() {
  const [code, setCode] = useState(`function greet(name) {
  console.log('Hello, ' + name)
}

greet('Developer')`)
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // SIMPLE theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setDarkMode(savedTheme === 'dark')
  }, [])

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
    setLoading(true)
    setSuggestion(null)
    try {
      const resp = await axios.post((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/review', { code })
      setSuggestion(resp.data)
    } catch (err) {
      console.error(err)
      alert('Review failed: ' + (err?.response?.data?.error || err.message || 'Unknown error'))
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      backgroundColor: darkMode ? '#111827' : 'white', // Changed to dark grey
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
        backgroundColor: darkMode ? '#1f2937' : '#f8fafc', // Changed to grey
        borderRadius: '12px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>CodeMentor AI</h1>
        
        {/* SIMPLE buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={setLightMode}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: !darkMode ? '#374151' : '#6b7280', // Changed to grey
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
              backgroundColor: darkMode ? '#4b5563' : '#d1d5db', // Changed to grey
              color: darkMode ? 'white' : '#374151',
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
          backgroundColor: '#111827', // Dark grey
          borderRadius: '12px', 
          overflow: 'hidden',
          border: '2px solid #374151' // Grey border
        }}>
          <MonacoEditor 
            height="400px" 
            defaultLanguage="javascript" 
            value={code} 
            onChange={(v)=>setCode(v||'')} 
            theme="vs-dark"
            options={{
              automaticLayout: true,
              minimap: { enabled: false }
            }} 
          />
          <div style={{ padding: '16px', backgroundColor: '#1f2937' }}> {/* Dark grey */}
            <button 
              onClick={requestReview} 
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#374151', // Changed to grey
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
          backgroundColor: darkMode ? '#1f2937' : 'white', // Changed to dark grey
          border: `2px solid ${darkMode ? '#374151' : '#e5e7eb'}`, // Grey borders
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            AI Suggestions
          </h2>
          
          {suggestion ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Suggestion</span>
                  <div style={{ 
                    fontSize: '14px', 
                    marginTop: '4px',
                    color: darkMode ? '#d1d5db' : '#6b7280' // Grey text
                  }}>
                    {suggestion.explanation}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: darkMode ? '#374151' : '#f1f5f9', // Grey backgrounds
                  color: darkMode ? 'white' : '#374151' // Grey text
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
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 0',
              color: darkMode ? '#9ca3af' : '#6b7280' // Grey text
            }}>
              AI suggestions will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}