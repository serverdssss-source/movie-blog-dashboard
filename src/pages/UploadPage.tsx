import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BlogPost, User } from '../types'

interface UploadPageProps {
  currentUser: User
  onAddPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void
}

export function UploadPage({ currentUser, onAddPost }: UploadPageProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'Review' | 'Recommendation' | 'News' | 'Watchlist'>('Review')
  const [rating, setRating] = useState<number>(5)
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onAddPost({
        title: title.trim(),
        category,
        rating: category !== 'News' ? rating : undefined,
        content: content.trim(),
        author: currentUser.username
      })
      navigate('/feed')
    }
  }

  return (
    <div className="max-w-[700px] mx-auto bg-white/8 backdrop-blur-[20px] border border-white/15 rounded-[16px] p-6 md:p-[35px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <h2 className="text-[28px] font-bold mb-[25px] text-white">Create Movie Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-[20px]">
          <label className="block text-[14px] font-semibold mb-[8px] text-white/90">Title</label>
          <input 
            type="text" 
            className="bg-white/7 border border-white/15 rounded-[8px] text-white px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none focus:bg-white/12 focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200 placeholder-white/30"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Dune: Part Two review" 
            required 
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-[20px] mb-[20px]">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[14px] font-semibold mb-[8px] text-white/90">Category</label>
            <select 
              className="bg-white/7 border border-white/15 rounded-[8px] text-white px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none focus:bg-white/12 focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200"
              value={category} 
              onChange={(e) => setCategory(e.target.value as any)}
              style={{ colorScheme: 'dark' }}
            >
              <option value="Review" className="bg-[#1e1e24] text-white">Review</option>
              <option value="Recommendation" className="bg-[#1e1e24] text-white">Recommendation</option>
              <option value="News" className="bg-[#1e1e24] text-white">News</option>
              <option value="Watchlist" className="bg-[#1e1e24] text-white">Watchlist</option>
            </select>
          </div>
          
          {category !== 'News' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[14px] font-semibold mb-[8px] text-white/90">Rating</label>
              <select 
                className="bg-white/7 border border-white/15 rounded-[8px] text-white px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none focus:bg-white/12 focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200"
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ colorScheme: 'dark' }}
              >
                <option value={5} className="bg-[#1e1e24] text-white">5 ★ - Masterpiece</option>
                <option value={4} className="bg-[#1e1e24] text-white">4 ★ - Very Good</option>
                <option value={3} className="bg-[#1e1e24] text-white">3 ★ - Average</option>
                <option value={2} className="bg-[#1e1e24] text-white">2 ★ - Disappointing</option>
                <option value={1} className="bg-[#1e1e24] text-white">1 ★ - Avoid</option>
              </select>
            </div>
          )}
        </div>

        <div className="mb-[25px]">
          <label className="block text-[14px] font-semibold mb-[8px] text-white/90">Write Content</label>
          <textarea 
            className="bg-white/7 border border-white/15 rounded-[8px] text-white px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none focus:bg-white/12 focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200 placeholder-white/30"
            rows={8} 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Write your review, movie suggestions, watchlist description, or industry news here..." 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="bg-white text-[#121212] border-none rounded-[8px] px-[24px] py-[12px] text-[15px] font-semibold cursor-pointer w-full transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:-translate-y-[1px]"
        >
          Publish Review
        </button>
      </form>
    </div>
  )
}
