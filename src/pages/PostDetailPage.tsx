import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { BlogPost } from '../types'

interface PostDetailPageProps {
  posts: BlogPost[]
}

export function PostDetailPage({ posts }: PostDetailPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()

  const post = posts.find(p => p.id === id)

  // Scroll to top instantly when viewing a post or switching posts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!post) {
    return (
      <div className="bg-white border border-zinc-200 rounded-[16px] p-12 text-center shadow-sm max-w-2xl mx-auto my-12 text-left">
        <h2 className="text-[24px] font-bold text-zinc-900 mb-4">Post Not Found</h2>
        <p className="text-zinc-500 mb-6">The movie review you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/feed')} 
          className="bg-red-650 hover:bg-red-750 text-white font-semibold text-[14px] px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer"
        >
          Return to Explore Feed
        </button>
      </div>
    )
  }

  // Filter related content (same category or others, max 3)
  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  if (relatedPosts.length < 3) {
    const others = posts
      .filter(p => p.id !== post.id && !relatedPosts.some(r => r.id === p.id))
      .slice(0, 3 - relatedPosts.length)
    relatedPosts.push(...others)
  }

  const getCategoryBadgeClass = (category: string) => {
    switch(category) {
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

  return (
    <div className="w-full text-left">
      {/* Back navigation */}
      <button 
        onClick={() => navigate('/feed')} 
        className="flex items-center gap-1.5 text-zinc-500 hover:text-red-600 font-bold text-[14px] transition-colors mb-6 cursor-pointer focus:outline-none select-none"
      >
        ← Back to Explore
      </button>

      {/* Split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start px-1">
        
        {/* Left column (2/3 width): Post full article content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover image banner */}
          <div className="w-full h-[360px] md:h-[420px] rounded-[16px] overflow-hidden bg-zinc-150 border border-zinc-200 shadow-sm select-none">
            <img 
              src={post.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'; }}
            />
          </div>

          {/* Heading meta information */}
          <div className="flex justify-between items-center gap-4 flex-wrap mt-6">
            <span className={`inline-block px-[10px] py-[4px] rounded-[20px] text-[11px] font-bold uppercase tracking-[0.5px] shadow-sm border ${getCategoryBadgeClass(post.category)}`}>
              {post.category}
            </span>

            {post.rating !== undefined && (
              <div className="flex items-center gap-[2px] text-[14px] text-amber-500 font-bold select-none">
                {'★'.repeat(post.rating)}
                {'☆'.repeat(5 - post.rating)}
              </div>
            )}
          </div>

          <h1 className="text-[28px] md:text-[38px] font-black text-zinc-950 leading-tight">
            {post.title}
          </h1>

          <div className="text-[13px] text-zinc-400 font-semibold border-b border-zinc-100 pb-4">
            Published by <span className="text-red-600 font-bold">{post.author}</span> on {post.createdAt}
          </div>

          {/* Complete scrollable text body */}
          <p className="text-zinc-700 text-[16px] md:text-[17px] leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Right column (1/3 width): Sidebar related posts and toolkits */}
        <aside className="space-y-8">
          
          {/* Widget 1: Related Content List */}
          <div className="bg-white border border-zinc-200 rounded-[16px] p-6 shadow-sm">
            <h4 className="font-extrabold text-zinc-400 text-[11px] uppercase tracking-[1.5px] mb-4 select-none">Related Content</h4>
            <div className="space-y-4">
              {relatedPosts.map(rel => (
                <div 
                  key={rel.id} 
                  onClick={() => navigate(`/post/${rel.id}`)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="w-[70px] h-[70px] rounded-[8px] overflow-hidden flex-shrink-0 bg-zinc-100 border border-zinc-200 select-none">
                    <img 
                      src={rel.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'} 
                      alt={rel.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'; }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-bold text-[13px] text-zinc-950 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      By {rel.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: Critic Toolkits List */}
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

          {/* Widget 3: Portal Critic Bio Card */}
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
