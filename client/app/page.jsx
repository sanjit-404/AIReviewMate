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

  // Initialize theme
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
      alert('Review failed: ' + (err?.response?.data?.error || err.message || 'Unknown error'))
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CodeMentor AI
          </h1>
          
          {/* Theme Toggle */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setDarkMode(false)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                !darkMode 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-lg">☀️</span>
              Light
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gray-800 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-lg">🌙</span>
              Dark
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Code Editor - ALWAYS DARK */}
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-700">
            <div className="p-1 bg-gray-800 border-b border-gray-700">
              <div className="flex gap-1.5 px-4 py-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <MonacoEditor 
              height="55vh" 
              defaultLanguage="javascript" 
              value={code} 
              onChange={(v)=>setCode(v||'')} 
              theme="vs-dark" // Always dark for code editor
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 1.5,
                fontFamily: 'Monaco, Menlo, Consolas, monospace'
              }} 
            />
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <button 
                onClick={requestReview} 
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Reviewing Code...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>🔍</span>
                    Review Code
                  </div>
                )}
              </button>
            </div>
          </div>
          
          {/* Suggestions Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-gray-200 dark:border-gray-700 transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>💡</span>
              AI Suggestions
            </h2>
            
            {suggestion ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Suggestion</span>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.explanation}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {suggestion.category}
                  </span>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <DiffViewer 
                    oldValue={code} 
                    newValue={suggestion.improved_code || suggestion.improvedCode || ''} 
                    splitView={true} 
                    hideLineNumbers={false} 
                    showDiffOnly={false}
                    styles={{
                      diffContainer: {
                        backgroundColor: darkMode ? '#1f2937' : 'white',
                        color: darkMode ? '#f9fafb' : 'black',
                      },
                      line: {
                        color: darkMode ? '#f9fafb' : 'black',
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">👨‍💻</div>
                <p>AI suggestions will appear here</p>
                <p className="text-sm mt-2">Write some code and click Review Code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}