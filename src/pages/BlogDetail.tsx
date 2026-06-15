import { useParams, Link } from 'react-router-dom'
import { Clock, ChevronRight, ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BLOG_POSTS } from './Blogs'

const FULL_CONTENT: Record<string, string> = {
  '1': `Walk-in interviews are unique — you show up, go through rounds on the same day, and often get an offer letter before you leave. But success depends on preparation.

**Before the drive**

Research the company thoroughly. Know their industry, size, and what role you're applying for. Companies like Genpact, Infosys BPM and Capgemini conduct hundreds of walk-ins a year, so standing out requires more than just showing up.

Prepare your documents (see our checklist article), iron your clothes the night before, and plan your route so you arrive 15-20 minutes early.

**At the venue**

Register immediately at the front desk. Be polite to everyone — HR staff, security, other candidates. First impressions begin before the interview room.

Most walk-in drives have 3 rounds:
1. **Written/Aptitude test** — Practice basic aptitude, verbal ability and logical reasoning
2. **HR round** — Focus on communication, salary expectations, joining date
3. **Technical/Operations round** — Role-specific questions

**Common HR questions and answers**

"Tell me about yourself" — Keep it under 2 minutes. Cover your education, skills and why you're interested in this role.

"What is your expected salary?" — Research market rates. Give a range, not a fixed number. Never say "anything is fine."

"Why do you want to join us?" — Mention something specific about the company, not generic praise.

**After the interview**

Ask for the hiring manager's card. Send a thank-you email within 24 hours. Follow up if you haven't heard back in 3 business days.`,

  '2': `Bengaluru accounts for nearly 40% of all walk-in drives listed on our platform. Here are the top companies currently hiring:

**1. Genpact** — Customer Support, Finance & Accounting, Analytics roles. 40-60 openings per drive. Freshers welcome.

**2. Infosys BPM** — Process Associates, Data Entry, F&A roles. Reliable hiring at multiple Bengaluru centres.

**3. Capgemini** — Java, .NET, SAP, Cloud roles. More technical but excellent growth trajectory.

**4. Tech Mahindra** — Network, Voice Support, Technical roles. Regular drives every 2-3 weeks.

**5. Wipro** — Data Engineering, QA, Business Analysis. Experienced candidates preferred (1-3 years).

**6. LTIMindtree** — Full Stack, React, Senior roles. Strong campus in Electronic City.

**7. Hewlett Packard Enterprise** — Server, Networking, IT Infrastructure. Niche but very well-paying.

**8. Sopra Steria** — SAP Consulting, Digital Transformation. Senior roles primarily.

**9. ICICI Bank** — Relationship Managers, Credit Analysts. BFSI background preferred.

**10. Kotak Mahindra Bank** — CASA Acquisition, Sales. Freshers with strong communication skills.

**How to maximise your chances**

Apply to multiple companies on the same week. Keep 3 copies of your resume ready. Carry all documents even if not explicitly asked.`,
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function renderContent(text: string) {
  return text.split('\n\n').map((block, i) => {
    if (block.startsWith('**') && block.endsWith('**') && !block.slice(2).includes('**')) {
      return <h3 key={i} className="text-lg font-bold text-[oklch(0.13_0.04_264)] mt-6 mb-2">{block.slice(2, -2)}</h3>
    }
    // Handle inline bold
    const parts = block.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-[oklch(0.28_0.03_264)] leading-relaxed">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="font-semibold text-[oklch(0.13_0.04_264)]">{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    )
  })
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const post    = BLOG_POSTS.find(p => p.id === id)
  const related = BLOG_POSTS.filter(p => p.id !== id && p.category === post?.category).slice(0, 3)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.99_0.003_250)]">
        <div className="text-center">
          <p className="text-lg font-semibold text-[oklch(0.50_0.022_258)]">Article not found.</p>
          <Link to="/blogs" className="mt-3 inline-block text-brand-blue font-semibold hover:underline">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  const content = FULL_CONTENT[post.id]

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.003_250)] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-1.5 text-sm text-[oklch(0.50_0.022_258)]">
              <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/blogs" className="hover:text-brand-blue transition-colors">Blog</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[oklch(0.13_0.04_264)] font-medium truncate max-w-[200px]">{post.category}</span>
            </div>
          </div>
        </div>

        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">

          {/* Back */}
          <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm text-[oklch(0.50_0.022_258)] hover:text-brand-blue transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[11px] font-bold text-brand-blue bg-brand-blue/8 px-2.5 py-1 rounded-md">{post.category}</span>
            <span className="flex items-center gap-1.5 text-sm text-[oklch(0.60_0.018_258)]"><Clock className="h-3.5 w-3.5" />{post.readTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-[oklch(0.13_0.04_264)] leading-tight mb-5">{post.title}</h1>

          {/* Author row */}
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-[oklch(0.905_0.01_255)]">
            <span className="h-9 w-9 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-bold flex items-center justify-center">
              {post.author[0]}
            </span>
            <div>
              <p className="text-sm font-semibold text-[oklch(0.13_0.04_264)] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[oklch(0.60_0.018_258)]" /> {post.author}
              </p>
              <p className="text-xs text-[oklch(0.60_0.018_258)] flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-3 w-3" /> {fmtDate(post.date)}
              </p>
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-[oklch(0.965_0.007_252)]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>

          {/* Excerpt lead */}
          <p className="text-[17px] text-[oklch(0.28_0.03_264)] leading-relaxed font-medium mb-6 border-l-2 border-brand-blue pl-4">
            {post.excerpt}
          </p>

          {/* Full content or placeholder */}
          {content ? (
            <div className="space-y-4 text-base">
              {renderContent(content)}
            </div>
          ) : (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <p key={i} className="text-[oklch(0.28_0.03_264)] leading-relaxed">
                  {i === 1 && 'This is a detailed guide on the topic. We cover everything you need to know to succeed in your walk-in interview drive and land the job you deserve.'}
                  {i === 2 && 'Walk-in drives are one of the fastest ways to get hired in India. Unlike traditional job applications that can take weeks, a well-prepared candidate can walk in and walk out with an offer the same day.'}
                  {i === 3 && 'Keep checking Walkins.in for the latest drives in your city — we update our listings daily and send instant alerts to subscribers the moment new drives are posted.'}
                </p>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 p-6 rounded-2xl bg-[oklch(0.975_0.005_250)] border border-[oklch(0.905_0.01_255)] flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="font-bold text-[oklch(0.13_0.04_264)]">Ready to find your next walk-in drive?</p>
              <p className="text-sm text-[oklch(0.50_0.022_258)] mt-0.5">Browse verified drives happening near you today.</p>
            </div>
            <Link to="/drives" className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors">
              Browse Drives <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="border-t border-[oklch(0.905_0.01_255)] bg-white py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[oklch(0.13_0.04_264)] mb-6">Related Articles</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(p => (
                  <Link key={p.id} to={`/blogs/${p.id}`} className="group block">
                    <div className="rounded-xl border border-[oklch(0.905_0.01_255)] overflow-hidden hover:border-brand-blue/30 hover:shadow-sm transition-all">
                      <div className="aspect-[16/9] overflow-hidden bg-[oklch(0.965_0.007_252)]">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-semibold text-brand-blue mb-1.5">{p.category}</p>
                        <h3 className="text-sm font-bold text-[oklch(0.13_0.04_264)] group-hover:text-brand-blue transition-colors line-clamp-2">{p.title}</h3>
                        <p className="mt-1.5 text-xs text-[oklch(0.60_0.018_258)] flex items-center gap-1"><Clock className="h-3 w-3" />{p.readTime} min</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
