'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SubscribeModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // 🔧 TODO: connect to your email service or Sanity form endpoint
    console.log('Subscribed:', email)
    setEmail('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white rounded-sm shadow-xl p-8 w-[90%] max-w-md text-center">
              <h2 className="text-2xl text-black font-light mb-4">Subscribe</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Join our list to receive updates on new series and exhibitions.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white"
                />
                <button
                  type="submit"
                  className="bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                  Subscribe
                </button>
              </form>
              <button
                onClick={onClose}
                className="mt-6 text-sm text-black underline underline-offset-2 hover:text-gray-700"
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
