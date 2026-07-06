import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { BlogPost, User } from '../types'

interface EditPostPageProps {
  posts: BlogPost[]
  currentUser: User
  onUpdatePost: (id: string, fields: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'author'>>) => void
}

export function EditPostPage({ posts, currentUser, onUpdatePost }: EditPostPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()

  const post = posts.find(p => p.id === id)

  // Guard: post not found or not owned by this user
  if (!post || post.author !== currentUser.username) {
    return (
      <div className="max-w-[700px] mx-auto bg-white border border-zinc-200 rounded-[16px] p-10 text-center shadow-sm">
        <p className="text-zinc-500 mb-4">Post not found or you don't have permission to edit it.</p>
        <button onClick={() => navigate('/dashboard')} className="text-red-600 font-semibold hover:underline cursor-pointer">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const [title, setTitle] = useState(post.title)
  const [category, setCategory] = useState<'Review' | 'Recommendation' | 'News' | 'Watchlist'>(post.category)
  const [rating, setRating] = useState<number>(post.rating ?? 5)
  const [content, setContent] = useState(post.content)
  const [image, setImage] = useState(post.image || '')
  const [dragActive, setDragActive] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string)
          setImageError(false)
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please upload a valid image file.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onUpdatePost(post.id, {
        title: title.trim(),
        category,
        rating: category !== 'News' ? rating : undefined,
        content: content.trim(),
        image: image.trim() || undefined,
        status: 'pending'
      })
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-[700px] mx-auto bg-white border border-zinc-200 rounded-[16px] p-6 md:p-[35px] shadow-sm text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-[28px]">
        <div>
          <h1 className="text-[24px] font-black text-zinc-950">Edit Post</h1>
          <p className="text-[13px] text-zinc-500 mt-1">
            {post.status === 'approved'
              ? <>Editing a <strong className="text-green-700">published</strong> post will reset it to <strong className="text-amber-600">Pending</strong> for re-review.</>
              : <>Editing will reset status to <strong className="text-amber-600">Pending</strong> for re-review.</>
            }
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          ← Cancel
        </button>
      </div>

      {/* Rejection Reason Banner */}
      {post.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 mb-6">
          <p className="text-[12px] font-bold text-red-700 uppercase tracking-wider mb-1">Admin's Rejection Reason</p>
          <p className="text-[14px] text-red-800">"{post.rejectionReason}"</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter a compelling title..."
            className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[10px] text-[14px] font-sans w-full focus:outline-none transition-all duration-200 placeholder-zinc-400"
          />
        </div>

        {/* Category & Rating */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'Review' | 'Recommendation' | 'News' | 'Watchlist')}
              className="bg-white border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[10px] text-[14px] w-full focus:outline-none transition-all duration-200"
            >
              <option value="Review">Review</option>
              <option value="Recommendation">Recommendation</option>
              <option value="News">News</option>
              <option value="Watchlist">Watchlist</option>
            </select>
          </div>
          {category !== 'News' && (
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-white border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[10px] text-[14px] w-full focus:outline-none transition-all duration-200"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''} {'★'.repeat(r)}{'☆'.repeat(5 - r)}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Cover Image */}
        <div className="flex flex-col gap-3">
          <label className="block text-[14px] font-semibold text-zinc-800">Cover Image (Optional)</label>
          {image && (
            <div className="relative w-full rounded-[8px] overflow-hidden border border-zinc-200 shadow-inner group select-none">
              {imageError ? (
                <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 flex flex-col gap-2">
                  <p className="font-bold text-amber-800 text-[13px]">⚠️ Cannot load this image link</p>
                  <p className="text-amber-700 text-[12px]">Please use a direct image URL (ending in .jpg, .png, etc.)</p>
                  <button
                    type="button"
                    onClick={() => { setImage(''); setImageError(false); }}
                    className="self-start bg-amber-600 text-white text-[12px] font-semibold px-3 py-1 rounded-[6px] cursor-pointer hover:bg-amber-700 transition-colors"
                  >
                    Clear & Try Again
                  </button>
                </div>
              ) : (
                <div className="relative h-[200px]">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" onError={() => setImageError(true)} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <button type="button" onClick={() => { setImage(''); setImageError(false); }} className="bg-red-600 text-white text-[13px] font-semibold px-4 py-2 rounded-[6px] cursor-pointer hover:bg-red-700 transition-colors shadow">
                      Clear Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div
            className={`border-2 border-dashed rounded-[8px] p-5 text-center cursor-pointer transition-colors ${dragActive ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('edit-image-file-input')?.click()}
          >
            <input id="edit-image-file-input" type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileChange(e.target.files[0]); }} />
            <p className="text-[13px] font-medium text-zinc-600">Drag & drop, or <span className="underline font-semibold text-zinc-900">browse files</span></p>
            <p className="text-[11px] text-zinc-400 mt-0.5">JPG, PNG, GIF, WebP</p>
          </div>
          <input
            type="url"
            placeholder="Paste external image URL (e.g. https://...)"
            value={image.startsWith('data:image/') ? '' : image}
            onChange={(e) => { setImage(e.target.value); setImageError(false); }}
            className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[10px] text-[14px] font-sans w-full focus:outline-none transition-all duration-200 placeholder-zinc-400"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Write Content</label>
          <textarea
            className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none transition-all duration-200 placeholder-zinc-400"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your review, movie suggestions, watchlist description, or industry news here..."
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-[14px] rounded-[10px] text-[15px] transition-colors cursor-pointer shadow-sm mt-2"
        >
          Save & Resubmit for Review
        </button>
      </form>
    </div>
  )
}
