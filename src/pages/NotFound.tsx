import { Link } from 'react-router-dom'
import { ArrowRight, SearchX } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.99_0.003_250)]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-blue/8 flex items-center justify-center mb-6">
            <SearchX className="h-8 w-8 text-brand-blue" />
          </div>
          <h1 className="text-5xl font-black text-[oklch(0.13_0.04_264)] mb-3">404</h1>
          <h2 className="text-xl font-bold text-[oklch(0.13_0.04_264)] mb-2">Page not found</h2>
          <p className="text-sm text-[oklch(0.50_0.022_258)] mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors">
              Go Home <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/drives" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[oklch(0.905_0.01_255)] px-6 py-3 text-sm font-semibold text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition-colors">
              Browse Drives
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
