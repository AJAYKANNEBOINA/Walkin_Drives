import { Eye, Share2, ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type BlogPost = {
  title: string
  excerpt: string
  url: string
  category: string
  date: string
  cover: string
  views: number
  shares: number
}

const blogPosts: BlogPost[] = [
  {
    title: 'How to Prepare for a Walk-In Interview',
    excerpt: 'What to wear, what to carry, and the exact prep checklist trusted by lakhs of candidates across India.',
    url: 'https://www.naukri.com/blog/how-to-prepare-for-a-walk-in-interview/',
    category: 'Checklist',
    date: '26 Jun 2025',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=70',
    views: 4596679,
    shares: 1240,
  },
  {
    title: 'Ace Your Next Walk-in Interview: Tips & Guide',
    excerpt: 'An updated playbook on what walk-ins look like today and how to win them on the spot.',
    url: 'https://internshala.com/blog/what-is-a-walk-in-interview/',
    category: 'Guide',
    date: '23 Apr 2025',
    cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=70',
    views: 312770,
    shares: 503,
  },
  {
    title: 'Walk-in Interview Preparation Tips & Questions',
    excerpt: 'Common questions asked at walk-ins along with sample answers and confidence boosters.',
    url: 'https://www.foundit.in/career-advice/walk-in-interview/',
    category: 'Q&A',
    date: '29 Apr 2025',
    cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=70',
    views: 78460,
    shares: 167,
  },
  {
    title: 'Guide to Prepare for a Walk-in Job Interview',
    excerpt: 'Meaning, tips and the end-to-end process of walk-in hiring explained for Indian job seekers.',
    url: 'https://apna.co/career-central/tips-to-prepare-for-a-walk-in-interview-a-quick-guide/',
    category: 'Process',
    date: '13 Mar 2025',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=70',
    views: 156320,
    shares: 289,
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Freshers':       'bg-blue-500/10 text-blue-600',
  'Checklist':      'bg-emerald-500/10 text-emerald-600',
  'Guide':          'bg-amber-500/10 text-amber-600',
  'Q&A':            'bg-rose-500/10 text-rose-600',
  'Process':        'bg-cyan-500/10 text-cyan-600',
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function BlogCard({ post }: { post: BlogPost }) {
  const categoryStyle = CATEGORY_COLORS[post.category] ?? 'bg-secondary text-muted-foreground'

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-brand-blue/40 hover:shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.2)] hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={post.cover}
          alt={post.title}
          loading="lazy"
          className="w-full h-48 object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryStyle}`}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs text-muted-foreground">{post.date}</p>

        <h3 className="mt-1.5 text-base font-bold text-foreground leading-snug group-hover:text-brand-blue transition-colors">
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer row */}
        <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {formatCount(post.views)}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Share2 className="h-3.5 w-3.5" />
              {post.shares}
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground group-hover:border-brand-blue group-hover:text-brand-blue transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function Blogs() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">

          {/* Page header */}
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
            FROM THE BLOG
          </span>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Walk-in drive insights<br className="hidden sm:block" /> &amp; tips.
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              Hand-picked articles from India's top career platforms to help you crack your next walk-in.
            </p>
          </div>

          {/* Grid */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.map((post) => (
              <BlogCard key={post.url} post={post} />
            ))}
          </div>

        </section>
      </main>
      <Footer />
    </div>
  )
}
