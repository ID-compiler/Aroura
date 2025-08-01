import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'

export default function CustomSignIn() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('phone') // 'phone' or 'code'
  const [loading, setLoading] = useState(false)

  // Send SMS code
  const sendCode = async () => {
    setLoading(true)
    try {
      // Call your API to send SMS code
      const response = await fetch('/api/auth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      if (response.ok) {
        setStep('code')
      } else {
        alert('Failed to send code')
      }
    } catch (error) {
      alert('Error sending code')
    }
    setLoading(false)
  }

  // Verify SMS code and sign in
  const verifyAndSignIn = async () => {
    setLoading(true)
    try {
      const result = await signIn('phone', {
        phone,
        code,
        redirect: false
      })
      
      if (result?.ok) {
        window.location.href = '/' // Redirect on success
      } else {
        alert('Invalid code')
      }
    } catch (error) {
      alert('Sign-in failed')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      {/* Google Sign In */}
      <button
        onClick={() => signIn('google')}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-4 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>

      <div className="text-center text-gray-500 mb-4">or</div>

      {/* Phone Sign In */}
      {step === 'phone' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button
            onClick={sendCode}
            disabled={loading || !phone}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button
            onClick={verifyAndSignIn}
            disabled={loading || !code}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-2"
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </button>
          <button
            onClick={() => setStep('phone')}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Phone Number
          </button>
        </div>
      )}
    </div>
  )
}
