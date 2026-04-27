import { Suspense } from 'react'
import VerifyContent from './VerifyContent'

export const metadata = {
  title: 'Verify Email',
  description: 'Enter your one-time verification code.',
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
