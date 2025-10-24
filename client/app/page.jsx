'use client'
import React, { useState } from 'react'
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

  async function requestReview() {
    setLoading(true)
    setSuggestion(null)
    try {
      const resp = await axios.post((process.env.NEXT_PUBLIC_SERVER_URL || '') + '/review', { code })
      setSuggestion(resp.data)
    } catch (err) {
      console.error(err)
      alert('Review failed: ' + (err?.response?.data?.error || err.message))
    }
    setLoading(false)
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">CodeMentor AI</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <MonacoEditor height="60vh" defaultLanguage="javascript" value={code} onChange={(v)=>setCode(v||'')} options={{automaticLayout:true, minimap:{enabled:false}}} />
          <div className="mt-3 flex gap-2">
            <button onClick={requestReview} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Reviewing…' : 'Review Code'}</button>
          </div>
        </div>
        <div>
          {suggestion ? (
            <div className="mt-4 border p-4 rounded bg-white shadow">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-sm font-semibold">Suggestion</span>
                  <div className="text-xs text-gray-600">{suggestion.explanation}</div>
                </div>
                <div><span className="px-2 py-1 rounded-full text-sm bg-gray-200">{suggestion.category}</span></div>
              </div>
              <DiffViewer oldValue={code} newValue={suggestion.improved_code || suggestion.improvedCode || ''} splitView={true} hideLineNumbers={false} showDiffOnly={false} />
            </div>
          ) : (
            <div className="mt-4 text-gray-500">AI suggestions will appear here.</div>
          )}
        </div>
      </div>
    </main>
  )
}
