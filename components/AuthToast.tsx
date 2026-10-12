import { useEffect, useState } from 'react'

type AuthToastProps = { message: string; tone: 'success' | 'error' }

export default function AuthToast({ message, tone }: AuthToastProps) {
  const [visible, setVisible] = useState(Boolean(message))

  useEffect(() => {
    setVisible(Boolean(message))
    if (!message) return
    const timeout = window.setTimeout(() => setVisible(false), 6000)
    return () => window.clearTimeout(timeout)
  }, [message])

  if (!message || !visible) return null

  const error = tone === 'error'
  return (
    <div className="fixed inset-x-4 top-4 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-xl border bg-white p-4 shadow-lg sm:left-auto sm:right-5" role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>
      <span aria-hidden="true" className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${error ? 'bg-red-600' : 'bg-emerald-600'}`} />
      <p className="flex-1 text-sm text-gray-800">{message}</p>
      <button type="button" onClick={() => setVisible(false)} className="rounded px-1 text-gray-500 outline-none hover:text-gray-900 focus:ring-2 focus:ring-gray-900/20" aria-label="Dismiss notification">×</button>
    </div>
  )
}