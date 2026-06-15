import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ChevronRight, Search, ArrowRight, BookOpen, TrendingUp, Briefcase, Users } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export interface BlogPost {
  id:       string
  title:    string
  excerpt:  string
  category: string
  author:   string
  date:     string
  readTime: number
  image:    string
  featured?: boolean
}

const CATEGORIES = ['All', 'Interview Tips', 'Career Advice', 'Resume', 'Salary', 'Companies']

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1', featured: true,
    title:    'How to Crack a Walk-In Interview: Complete Guide for 2026',
    excerpt:  "Walk-in interviews are your best shot at same-day hiring. Here's everything you need — what to carry, how to dress, and how to answer the most common HR questions.",
    category: 'Interview Tips', author: 'Priya Sharma', date: '2026-06-01', readTime: 8,
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80',
  },
  {
    id: '2', featured: true,
    title:    'Top 10 Companies Hiring Freshers via Walk-In Drives in Bengaluru',
    excerpt:  "Bengaluru remains India's top city for walk-in hiring. Genpact, Infosys BPM, Capgemini and 7 more are actively conducting drives for 2026 graduates.",
    category: 'Companies', author: 'Rahul Verma', date: '2026-06-03', readTime: 5,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    id: '3',
    title:    'What Documents to Carry for a Walk-In Interview (Checklist)',
    excerpt:  'Nothing is worse than reaching the venue and realising you forgot your PAN card. This checklist covers everything you need for BPO, IT and BFSI drives.',
    category: 'Interview Tips', author: 'Sneha Pillai', date: '2026-06-05', readTime: 4,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  {
    id: '4',
    title:    'BPO vs IT Walk-In Drives: Which Should You Attend?',
    excerpt:  'Both sectors are booming with walk-in opportunities, but they require very different skill sets and offer very different career trajectories.',
    category: 'Career Advice', author: 'Arjun Nair', date: '2026-06-07', readTime: 6,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  {
    id: '5',
    title:    'How to Write a Resume for a Walk-In Drive (With Template)',
    excerpt:  'Your resume has 30 seconds to impress an HR manager. Learn what to include, what to remove, and how to format it for maximum impact.',
    category: 'Resume', author: 'Meera Iyer', date: '2026-06-08', readTime: 7,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
  },
  {
    id: '6',
    title:    'Expected Salaries in Walk-In Drives 2026: City-wise Breakdown',
    excerpt:  'We analysed 500+ walk-in drives to give you a realistic picture of what you can expect in Hyderabad, Mumbai, Chennai and Bengaluru.',
    category: 'Salary', author: 'Vikram Rao', date: '2026-06-09', readTime: 6,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
  },
  {
    id: '7',
    title:    '5 Mistakes to Avoid at Your Next Walk-In Interview',
    excerpt:  'Arriving late, skipping research, dressing incorrectly — these avoidable mistakes cost thousands of candidates their dream jobs every year.',
    category: 'Interview Tips', author: 'Priya Sharma', date: '2026-06-10', readTime: 5,
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80',
  },
  {
    id: '8',
    title:    'How to Negotiate Salary at a Walk-In Interview',
    excerpt:  "Most candidates accept the first number offered. Walk-in interviews do allow negotiation — here's exactly how to do it without losing the offer.",
    category: 'Salary', author: 'Arjun Nair', date: '2026-06-11', readTime: 5,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  },
]

const CAT_ICONS: Record<string, React.ReactNode> = {
  'Interview Tips': <TrendingUp className="h-3.5 w-3.5" />,
  'Career Advice':  <Briefcase  className="h-3.5 w-3.5" />,
  'Resume':         <BookOpen   className="h-3.5 w-3.5" />,
  'Salary':         <TrendingUp className="h-3.5 w-3.5" />,
  'Companies':      <Users      className="h-3.5 w-3.5" />,
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="h-5 w-5 rounded-full bg-brand-blue/10 text-brand-blue text-[9px] font-bold flex items-center justify-center shrink-0">
      {name[0]}
    </span>
  )
}

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={post.author} />
      <span className="text-xs text-[oklch(0.50_0.022_258)] truncate">{post.author}</span>
      <span className="text-[oklch(0.82_0.01_255)] shrink-0">·</span>
      <span className="text-xs text-[oklch(0.60_0.018_258)] shrink-0">{fmtDate(post.date)}</span>
    </div>
  )
}

export default function Blogs() {
  const [cat, setCat]     = useState('All')
  const [query, setQuery] = useState('')

  const filtered   = BLOG_POSTS.filter(p =>
    (cat === 'All' || p.category === cat) &&
    (!query || p.title.toLowerCase().includes(query.toLowerCase()))
  )
  const featured   = BLOG_POSTS.filter(p => p.featured)
  const showFilter = cat !== 'All' || !!query

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.003_250)] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── Header ── */}
        <section className="bg-white border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-1.5 text-sm text-[oklch(0.50_0.022_258)] mb-5">
              <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[oklch(0.13_0.04_264)] font-medium">Blog</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[oklch(0.13_0.04_264)]">Career Insights & Interview Tips</h1>
                <p className="mt-1 text-sm text-[oklch(0.50_0.022_258)]">Expert advice to help you land your next walk-in job</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.60_0.018_258)]" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search articles…"
                  className="w-full rounded-lg border border-[oklch(0.905_0.01_255)] bg-[oklch(0.975_0.005_250)] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={[
                    'shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold border transition-all',
                    cat === c
                      ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                      : 'border-[oklch(0.905_0.01_255)] text-[oklch(0.42_0.022_258)] hover:border-brand-blue/30 hover:text-[oklch(0.13_0.04_264)] bg-white',
                  ].join(' ')}
                >
                  {c !== 'All' && CAT_ICONS[c]}
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

          {/* Featured */}
          {!showFilter && featured.length > 0 && (
            <div className="mb-12">
              <p className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-5">Featured</p>
              <div className="grid lg:grid-cols-2 gap-5">
                {featured.map(post => (
                  <Link key={post.id} to={`/blogs/${post.id}`} className="group block">
                    <article className="overflow-hidden rounded-2xl border border-[oklch(0.905_0.01_255)] bg-white hover:border-brand-blue/30 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-200">
                      <div className="aspect-[16/9] overflow-hidden bg-[oklch(0.965_0.007_252)]">
                        <img src={post.image} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[11px] font-bold text-brand-blue bg-brand-blue/8 px-2 py-0.5 rounded-md">{post.category}</span>
                          <span className="text-[11px] text-[oklch(0.60_0.018_258)] flex items-center gap-1.5"><Clock className="h-3 w-3" />{post.readTime} min read</span>
                        </div>
                        <h2 className="text-[18px] font-bold text-[oklch(0.13_0.04_264)] group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">{post.title}</h2>
                        <p className="mt-2 text-sm text-[oklch(0.50_0.022_258)] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <PostMeta post={post} />
                          <span className="text-xs font-semibold text-brand-blue flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Read <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Article grid */}
          {!showFilter && <p className="text-xs font-bold tracking-widest text-[oklch(0.50_0.022_258)] uppercase mb-5">All Articles</p>}

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[oklch(0.905_0.01_255)] py-16 text-center">
              <p className="text-sm text-[oklch(0.50_0.022_258)]">No articles found.</p>
              <button onClick={() => { setQuery(''); setCat('All') }} className="mt-2 text-sm text-brand-blue font-semibold hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(showFilter ? filtered : filtered.filter(p => !p.featured)).map(post => (
                <Link key={post.id} to={`/blogs/${post.id}`} className="group block">
                  <article className="bg-white rounded-xl border border-[oklch(0.905_0.01_255)] overflow-hidden hover:border-brand-blue/30 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-200 h-full flex flex-col">
                    <div className="aspect-[16/9] overflow-hidden bg-[oklch(0.965_0.007_252)]">
                      <img src={post.image} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/8 px-2 py-0.5 rounded-md">{post.category}</span>
                        <span className="text-[10px] text-[oklch(0.60_0.018_258)] flex items-center gap-1.5"><Clock className="h-3 w-3" />{post.readTime} min</span>
                      </div>
                      <h2 className="text-[15px] font-bold text-[oklch(0.13_0.04_264)] group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug flex-1">{post.title}</h2>
                      <p className="mt-2 text-sm text-[oklch(0.50_0.022_258)] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      <div className="mt-4 pt-3.5 border-t border-[oklch(0.965_0.007_252)]">
                        <PostMeta post={post} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
