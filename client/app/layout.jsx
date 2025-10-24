import './globals.css'
import Header from '../components/Header'

export const metadata = { title: 'CodeMentor AI' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Header />
        {children}
      </body>
    </html>
  )
}
