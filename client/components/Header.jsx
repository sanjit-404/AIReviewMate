'use client'
import React, { useEffect, useState } from 'react'

export default function Header() {
  const [dark, setDark] = useState(false)

  useEffect(()=>{
    const s = localStorage.getItem('theme')
    if (s === 'dark') { document.documentElement.classList.add('dark'); setDark(true) }
  },[])

  function toggle(){
    const nd = !dark; setDark(nd)
    if (nd) { document.documentElement.classList.add('dark'); localStorage.setItem('theme','dark') }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme','light') }
  }

  return (
    <header className="w-full border-b mb-4 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <div className="text-lg font-semibold">CodeMentor AI</div>
        <button onClick={toggle} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  )
}
