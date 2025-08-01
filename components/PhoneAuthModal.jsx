"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function PhoneAuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1) // 1: phone input, 2: code input
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendSMS = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
      } else {
        setError(data.message || 'Failed to send SMS')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('phone', {
        phone,
        code,
        redirect: true,
        callbackUrl: '/login-success'
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Invalid verification code. Please check and try again.')
        } else {
          setError('Login failed. Please try again.')
        }
      } else {
        // Success will be handled by redirect
        onClose()
        setStep(1)
        setPhone('')
        setCode('')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setPhone('')
    setCode('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {step === 1 ? 'Phone Authentication' : 'Enter Verification Code'}
          </h2>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendSMS}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Sending...' : 'Send SMS Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">
                Code sent to {phone}
              </p>
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
