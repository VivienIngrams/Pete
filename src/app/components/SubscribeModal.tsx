'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json() // ✅ read body once
      if (!res.ok) throw new Error(data.error || 'Subscription failed')

      setSuccess(true)
      setEmail('')
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white dark:bg-black rounded-sm shadow-xl p-8 w-[90%] max-w-md text-center">
              <h2 className="text-2xl text-black dark:text-white font-light mb-4">
                Subscribe
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Join our list to receive updates on new series and exhibitions.
              </p>

              {success ? (
                <p className="text-green-600 dark:text-green-400 font-medium mb-4">
                  ✅ Subscribed successfully!
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Subscribe'}
                  </button>
                  {error && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                  )}
                </form>
              )}

              <button
                onClick={onClose}
                className="mt-6 text-sm text-black dark:text-white underline underline-offset-2 hover:text-gray-700"
              >
                close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SubscribeModal
