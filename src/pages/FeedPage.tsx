import { useState } from 'react'
import type { BlogPost, User } from '../types'

interface FeedPageProps {
  posts: BlogPost[]
  currentUser: User | null
  onDelete: (id: string) => void
}

export function FeedPage({ posts, currentUser, onDelete }: FeedPageProps) {
  const [filter, setFilter] = useState<string>('All')

  const filteredPosts = filter === 'All' 
    ? posts 
    : posts.filter(post => post.category === filter)

  const getCategoryBadgeClass = (category: string) => {
    switch(category) {
      case 'Review': 
        return 'bg-red-600/20 text-[#ff4d4d] border border-red-600/30'
      case 'Recommendation': 
        return 'bg-green-600/20 text-green-300 border border-green-600/30'
      case 'News': 
        return 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
      case 'Watchlist': 
        return 'bg-orange-600/20 text-orange-300 border border-orange-600/30'
      default: 
        return 'bg-white/10 text-white border border-white/20'
    }
  }

  return (
    <div className="bg-white/8 backdrop-blur-[20px] border border-white/15 rounded-[16px] p-6 md:p-[35px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[25px] gap-[15px]">
        <h2 className="text-[28px] font-bold text-white">Explore Movie Posts</h2>
        
        {/* Navigation Category Filter Tags */}
        <div className="flex gap-[10px] flex-wrap">
          {['All', 'Review', 'Recommendation', 'News', 'Watchlist'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`px-[14px] py-[6px] text-[13px] font-semibold border rounded-[6px] transition-all duration-200 cursor-pointer ${
                filter === cat 
                  ? 'bg-white/15 border-white/60 text-white' 
                  : 'bg-transparent border-white/15 hover:bg-white/8 hover:border-white/30 text-white/80'
              }`}
            >
              {cat}s
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <p className="text-white/60 text-center py-[40px]">
          No posts found in this category.
        </p>
      ) : (
        <div className="space-y-[20px]">
          {filteredPosts.map(post => (
            <div 
              key={post.id} 
              className="bg-white/5 border border-white/10 rounded-[12px] p-[25px] transition-all duration-200 hover:translate-y-[-2px] hover:border-white/20"
            >
              <div className="flex justify-between items-start gap-[15px] mb-[12px]">
                <h3 className="text-[20px] font-semibold text-white">{post.title}</h3>
                <span className={`inline-block px-[10px] py-[4px] rounded-[20px] text-[12px] font-semibold uppercase tracking-[0.5px] ${getCategoryBadgeClass(post.category)}`}>
                  {post.category} {post.rating ? `• ${post.rating}/5` : ''}
                </span>
              </div>
              
              <p className="text-white/85 text-[15px] leading-[1.6] mb-[20px] white-space-pre-line">
                {post.content}
              </p>

              <div className="flex justify-between items-center border-t border-white/8 pt-[12px] text-[13px] text-white/50">
                <span>Published by <strong className="text-white">{post.author}</strong> on {post.createdAt}</span>
                {(currentUser?.role === 'admin' || currentUser?.username === post.author) && (
                  <button 
                    onClick={() => onDelete(post.id)} 
                    className="bg-red-600/20 text-[#ff4d4d] border border-red-600/40 rounded-[6px] px-[12px] py-[6px] text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600/30 hover:border-red-600/80"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
