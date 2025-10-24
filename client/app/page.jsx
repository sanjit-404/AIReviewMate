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

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme ? savedTheme === 'dark' : systemPrefersDark
    setDarkMode(initialTheme)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  async function requestReview() {
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
    setLoading(true)
    setSuggestion(null)
    try {
      const resp = await axios.post((process.env.NEXT_PUBLIC_API_URL || '') + '/review', { code })
      setSuggestion(resp.data)
    } catch (err) {
      console.error(err)
      alert('Review failed: ' + (err?.response?.data?.error || err.message))
    }
    setLoading(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <main className={darkMode ? 'dark bg-gray-900 min-h-screen' : 'min-h-screen'}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">CodeMentor AI</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <MonacoEditor 
              height="60vh" 
              defaultLanguage="javascript" 
              value={code} 
              onChange={(v)=>setCode(v||'')} 
              theme={darkMode ? 'vs-dark' : 'vs-light'}
              options={{automaticLayout:true, minimap:{enabled:false}}} 
            />
            <div className="mt-3 flex gap-2">
              <button 
                onClick={requestReview} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" 
                disabled={loading}
              >
                {loading ? 'Reviewing…' : 'Review Code'}
              </button>
            </div>
          </div>
          <div>
            {suggestion ? (
              <div className="mt-4 border dark:border-gray-600 p-4 rounded bg-white dark:bg-gray-800 shadow">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-semibold dark:text-white">Suggestion</span>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{suggestion.explanation}</div>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700 dark:text-white">
                      {suggestion.category}
                    </span>
                  </div>
                </div>
                <DiffViewer 
                  oldValue={code} 
                  newValue={suggestion.improved_code || suggestion.improvedCode || ''} 
                  splitView={true} 
                  hideLineNumbers={false} 
                  showDiffOnly={false}
                  styles={{
                    diffContainer: {
                      backgroundColor: darkMode ? '#2d3748' : 'white',
                      color: darkMode ? '#e2e8f0' : 'black',
                    },
                    line: {
                      color: darkMode ? '#e2e8f0' : 'black',
                    }
                  }}
                />
              </div>
            ) : (
              <div className="mt-4 text-gray-500 dark:text-gray-400">AI suggestions will appear here.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}