import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10">
          <MailCheck className="h-8 w-8 text-brand-blue" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We sent a verification link to your email address. Click the link to activate your account and start applying to walk-in drives.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Didn't receive it? Check your spam folder.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
