import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BlogPost } from '../types'

interface FeedPageProps {
  posts: BlogPost[]
}

export function FeedPage({ posts }: FeedPageProps) {
  const [filter, setFilter] = useState<string>('All')
  const [sort, setSort] = useState<string>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, sort, searchQuery])
  const navigate = useNavigate()

  let basePosts = filter === 'All'
    ? posts.filter(p => p.status === 'approved')
    : posts.filter(p => p.category === filter && p.status === 'approved')

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    basePosts = basePosts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q)
    )
  }

  const filteredPosts = [...basePosts].sort((a, b) => {
    switch (sort) {
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'highest': return (b.rating ?? 0) - (a.rating ?? 0)
      case 'lowest': return (a.rating ?? 0) - (b.rating ?? 0)
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // newest
    }
  })

  const POSTS_PER_PAGE = 6
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const PaginationControls = ({ className = 'my-6 w-full' }: { className?: string }) => {
    const displayTotal = Math.max(1, totalPages)

    const getPageNumbers = () => {
      const pages = []
      if (displayTotal <= 5) {
        for (let i = 1; i <= displayTotal; i++) pages.push(i)
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', displayTotal)
        } else if (currentPage >= displayTotal - 2) {
          pages.push(1, '...', displayTotal - 3, displayTotal - 2, displayTotal - 1, displayTotal)
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', displayTotal)
        }
      }
      return pages
    }

    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        {getPageNumbers().map((num, i) => (
          num === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-zinc-400">...</span>
          ) : (
            <button
              key={`page-${num}`}
              onClick={() => setCurrentPage(num as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-semibold transition-colors ${currentPage === num ? 'bg-zinc-900 text-white' : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
            >
              {num}
            </button>
          )
        ))}

        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === displayTotal || displayTotal === 1}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    )
  }

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Review':
        return 'bg-red-50 text-red-700 border border-red-100'
      case 'Recommendation':
        return 'bg-green-50 text-green-700 border border-green-100'
      case 'News':
        return 'bg-blue-50 text-blue-700 border border-blue-100'
      case 'Watchlist':
        return 'bg-orange-50 text-orange-700 border border-orange-100'
      default:
        return 'bg-zinc-50 text-zinc-600 border border-zinc-200'
    }
  }

  // Helper to map category names to plural forms user requested
  const getFilterDisplayName = (cat: string) => {
    if (cat === 'All') return '🎬 All'
    if (cat === 'Review') return '🍿 Reviews'
    if (cat === 'Recommendation') return '🌟 Recommendations'
    if (cat === 'News') return '📰 News'
    if (cat === 'Watchlist') return '📌 Watchlists'
    return cat
  }

  return (
    <div className="w-full text-center">
      {/* Hero Header Section */}
      <div className="max-w-3xl mx-auto my-[40px] px-4">
        <h1 className="text-[36px] md:text-[46px] font-extrabold tracking-tight text-zinc-950 leading-tight">
          Heartfelt <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Reflections</span>: Stories of Art, Drama, and Magic
        </h1>
        <p className="text-[15px] text-zinc-500 mt-[15px] leading-relaxed">
          Welcome to the ultimate source for fresh film takes! Explore curated reviews, recommendations, and cinema insights to engage your inner critic.
        </p>
      </div>

      {/* Categories Filter Tag Buttons + Sort Row */}
      <div className="flex gap-[12px] flex-wrap justify-center mb-4 px-4">
        {['All', 'Review', 'Recommendation', 'News', 'Watchlist'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-[16px] py-[8px] text-[13px] font-semibold border rounded-[30px] transition-all duration-200 cursor-pointer shadow-sm ${filter === cat
              ? 'bg-red-600 border-red-600 text-white shadow'
              : 'bg-white border-zinc-200 text-zinc-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
              }`}
          >
            {getFilterDisplayName(cat)}
          </button>
        ))}
      </div>

            {/* Search Bar */}
      <div className="flex justify-center mb-4 px-4 w-full">
        <div className="relative w-full max-w-md">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-[8px] pl-10 pr-4 py-[9px] text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors shadow-sm placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-center gap-3 mb-[35px] px-4">
        <span className="text-[13px] text-zinc-400 font-medium">Sort by:</span>
        {[
          { key: 'newest', label: 'Newest' },
          { key: 'oldest', label: 'Oldest' },
          { key: 'highest', label: 'Highest Rated' },
          { key: 'lowest', label: 'Lowest Rated' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={`px-[12px] py-[5px] text-[12px] font-semibold rounded-[20px] border transition-all duration-200 cursor-pointer ${sort === s.key
              ? 'bg-zinc-900 border-zinc-900 text-white'
              : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-800'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Split Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left w-full items-start px-4">

        {/* Left column (2/3 width): Blog posts card list */}
        <div className="lg:col-span-2 space-y-8">
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-[16px] p-12 text-center shadow-sm">
              <p className="text-zinc-400">No posts found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedPosts.map(post => (
                <div
                  key={post.id}
                  className="flex flex-col group cursor-pointer"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {/* Card Image Banner */}
                  <div className="w-full h-[220px] rounded-[16px] overflow-hidden relative bg-zinc-100 border border-zinc-200 shadow-sm select-none">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-103"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'; }}
                    />
                    {/* Floating absolute badge tag */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`inline-block px-[10px] py-[4px] rounded-[20px] text-[11px] font-bold uppercase tracking-[0.5px] shadow-sm border ${getCategoryBadgeClass(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Metadata details */}
                  <div className="text-[13px] text-zinc-400 font-semibold mt-4 flex items-center gap-1">
                    <span className="text-red-600 hover:underline cursor-pointer">{post.author}</span>
                    <span>on {post.createdAt}</span>
                  </div>

                  {/* Star Rating Review Overlay */}
                  {post.rating !== undefined && (
                    <div className="flex items-center gap-[2px] text-[13px] text-amber-500 mt-2 font-bold select-none">
                      {'★'.repeat(post.rating)}
                      {'☆'.repeat(5 - post.rating)}
                    </div>
                  )}

                  {/* Post Title */}
                  <h3 className="text-[19px] font-extrabold text-zinc-950 leading-snug mt-2 group-hover:text-red-600 transition-colors duration-200 cursor-pointer">
                    {post.title}
                  </h3>

                  {/* Description Snip */}
                  <p className="text-zinc-500 text-[14px] leading-relaxed mt-2 line-clamp-3">
                    {post.content}
                  </p>
                </div>
              ))}
              </div>
              <PaginationControls />
            </>
          )}
        </div>

        {/* Right column (1/3 width): Sidebar widgets */}
        <aside className="space-y-8">

          {/* Widget 1: Portal Critic Bio Card */}
          <div className="bg-white border border-zinc-200 rounded-[16px] p-6 shadow-sm">
            <h4 className="font-extrabold text-zinc-400 text-[11px] uppercase tracking-[1.5px] mb-4 select-none">About Portal</h4>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-[18px] select-none">
                P
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-[15px]">Prabhava Critic</h5>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.5px]">Portal Curator</p>
              </div>
            </div>
            <p className="text-[14px] text-zinc-500 leading-relaxed text-left">
              Prabhava shares thoughtful takes, expert recommendations, and cinematic insights to inspire movie lovers and critics worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-[12px] text-zinc-400 font-bold mt-4 select-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>Cinema World</span>
            </div>
            {/* Social link icons placeholder */}
            <div className="flex gap-4 mt-5 text-[13px] font-bold text-zinc-500 select-none">
              <span className="hover:text-red-600 cursor-pointer transition-colors">Letterboxd</span>
              <span className="hover:text-red-600 cursor-pointer transition-colors">X</span>
              <span className="hover:text-red-600 cursor-pointer transition-colors">Instagram</span>
            </div>
          </div>

          {/* Widget 2: Featured Review Overlay Card */}
          <div
            onClick={() => navigate('/post/3')}
            className="bg-black text-white rounded-[16px] overflow-hidden relative shadow-md p-6 h-[260px] flex flex-col justify-end group select-none cursor-pointer"
          >
            {/* Dark banner backdrop image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-500 group-hover:scale-103"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="relative z-10 text-left">
              <span className="bg-red-600 text-white text-[9px] uppercase font-bold tracking-[1.5px] px-2.5 py-1 rounded-full">
                Featured review
              </span>
              <h4 className="text-[17px] font-extrabold mt-3.5 leading-snug hover:underline cursor-pointer">
                The Witcher: A Deep Dive Into Geralt's Moral Conflicts
              </h4>
              <p className="text-[12px] text-zinc-400 mt-2 font-medium">
                Written by admin • 5★ Review
              </p>
            </div>
          </div>

          {/* Widget 3: Critic Toolkits List */}
          <div className="bg-white border border-zinc-200 rounded-[16px] p-6 shadow-sm">
            <h4 className="font-extrabold text-zinc-400 text-[11px] uppercase tracking-[1.5px] mb-4 select-none">Critic Toolkits</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="text-[20px] select-none">🎬</div>
                <div>
                  <a href="https://letterboxd.com" target="_blank" rel="noreferrer" className="text-[14px] font-bold text-zinc-900 hover:text-red-600 transition-colors">Letterboxd</a>
                  <p className="text-[12px] text-zinc-450 mt-0.5">Track, rate, and review cinema logs.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-[20px] select-none">🏆</div>
                <div>
                  <a href="https://imdb.com" target="_blank" rel="noreferrer" className="text-[14px] font-bold text-zinc-900 hover:text-red-600 transition-colors">IMDb</a>
                  <p className="text-[12px] text-zinc-450 mt-0.5">Movie details, trailers, and trivia guides.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-[20px] select-none">🍅</div>
                <div>
                  <a href="https://rottentomatoes.com" target="_blank" rel="noreferrer" className="text-[14px] font-bold text-zinc-900 hover:text-red-600 transition-colors">Rotten Tomatoes</a>
                  <p className="text-[12px] text-zinc-450 mt-0.5">Aggregated film critic review scoring databases.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 4: Portal Highlights links */}
          <div className="bg-white border border-zinc-200 rounded-[16px] p-6 shadow-sm">
            <h4 className="font-extrabold text-zinc-400 text-[11px] uppercase tracking-[1.5px] mb-4 select-none">Portal Highlights</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[14px] font-semibold text-zinc-800 hover:text-red-600 transition-colors flex items-center justify-between">
                  <span>Oscars 2026 Prediction Lists</span>
                  <span className="text-[11px] text-zinc-400">↗</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] font-semibold text-zinc-800 hover:text-red-600 transition-colors flex items-center justify-between">
                  <span>Best Cinematography of the Decade</span>
                  <span className="text-[11px] text-zinc-400">↗</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] font-semibold text-zinc-800 hover:text-red-600 transition-colors flex items-center justify-between">
                  <span>Indie Directors to Watch Out For</span>
                  <span className="text-[11px] text-zinc-400">↗</span>
                </a>
              </li>
            </ul>
          </div>

        </aside>
      </div>

      {/* Newsletter Subscription Block */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-[16px] p-8 md:p-10 text-center my-16 max-w-2xl mx-auto w-full shadow-sm">
        <h3 className="text-[24px] font-extrabold text-zinc-900">Subscribe to our Newsletter</h3>
        <p className="text-zinc-500 text-[14px] mt-1.5 mb-6">Stay updated with the latest film reviews, movie discussions, and community news.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            required
            className="bg-white border border-zinc-200 px-4 py-2.5 rounded-[8px] text-[14px] focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 flex-grow"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-[14px] px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}
