import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { BlogPost } from '../types'

interface AdminReviewPageProps {
  posts: BlogPost[]
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  onDelete: (id: string) => void
}

export function AdminReviewPage({ posts, onApprove, onReject, onDelete }: AdminReviewPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const post = posts.find(p => p.id === id)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-zinc-500 text-[15px] mb-4">Post not found.</p>
        <button
          onClick={() => navigate('/admin')}
          className="text-red-600 font-semibold hover:underline cursor-pointer"
        >
          ← Back to Moderation Dashboard
        </button>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Review': return 'bg-red-50 text-red-700 border border-red-100'
      case 'Recommendation': return 'bg-green-50 text-green-700 border border-green-100'
      case 'News': return 'bg-blue-50 text-blue-700 border border-blue-100'
      case 'Watchlist': return 'bg-orange-50 text-orange-700 border border-orange-100'
      default: return 'bg-zinc-50 text-zinc-600 border border-zinc-200'
    }
  }

  const currentPost = posts.find(p => p.id === id) ?? post

  const handleApprove = () => {
    onApprove(post.id)
    setRejectMode(false)
  }

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      alert('Please write a rejection reason for the author.')
      return
    }
    onReject(post.id, rejectionReason.trim())
    setRejectMode(false)
    setRejectionReason('')
  }

  const handleDelete = () => {
    const confirmation = prompt(`To confirm deleting "${post.title}", type "DELETE":`)
    if (confirmation === 'DELETE') {
      onDelete(post.id)
      navigate('/admin')
    }
  }

  return (
    <div className="max-w-6xl mx-auto w-full">

      {/* Back bar */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-[14px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Moderation Dashboard
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Left: Full Post ── */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-zinc-200 rounded-[20px] overflow-hidden shadow-sm">

            {/* Cover Image */}
            {post.image && (
              <div className="w-full h-[300px] bg-zinc-100 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}

            <div className="p-7 md:p-10">
              {/* Category + rating row */}
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <span className={`inline-block px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                {post.rating !== undefined && (
                  <span className="text-amber-500 text-[18px] font-bold select-none leading-none">
                    {'★'.repeat(post.rating)}{'☆'.repeat(5 - post.rating)}
                    <span className="text-zinc-400 text-[13px] font-normal ml-2">{post.rating} / 5</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-[28px] md:text-[34px] font-black text-zinc-950 leading-tight mb-4">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-3 text-[13px] text-zinc-400 mb-8 pb-6 border-b border-zinc-100">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 font-bold text-[13px] uppercase flex-shrink-0 select-none">
                  {post.author.charAt(0)}
                </div>
                <span>By <strong className="text-zinc-700 font-semibold">{post.author}</strong></span>
                <span>·</span>
                <span>{post.createdAt}</span>
              </div>

              {/* Content */}
              <div className="text-[16px] text-zinc-700 leading-[1.9] whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Admin Action Panel ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-[20px] flex flex-col gap-4">

            {/* Status Card */}
            <div className="bg-white border border-zinc-200 rounded-[16px] p-5 shadow-sm">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Current Status</p>
              {(() => {
                const s = currentPost.status
                return (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-[10px] font-bold text-[14px] ${
                    s === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                    s === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    <span>{s === 'approved' ? '✅' : s === 'rejected' ? '❌' : '⏳'}</span>
                    <span className="capitalize">{s === 'approved' ? 'Published' : s === 'pending' ? 'Pending Review' : 'Rejected'}</span>
                  </div>
                )
              })()}

              {currentPost.status === 'rejected' && currentPost.rejectionReason && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-[8px] p-3">
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">Rejection Reason</p>
                  <p className="text-[12px] text-red-800 leading-relaxed">"{currentPost.rejectionReason}"</p>
                </div>
              )}
            </div>

            {/* Post Info Card */}
            <div className="bg-white border border-zinc-200 rounded-[16px] p-5 shadow-sm">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Post Details</p>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Author</span>
                  <span className="font-semibold text-zinc-800">{post.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Category</span>
                  <span className="font-semibold text-zinc-800">{post.category}</span>
                </div>
                {post.rating !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Rating</span>
                    <span className="font-semibold text-amber-600">{'★'.repeat(post.rating)} ({post.rating}/5)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Submitted</span>
                  <span className="font-semibold text-zinc-800">{post.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white border border-zinc-200 rounded-[16px] p-5 shadow-sm">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Moderation Actions</p>

              {rejectMode ? (
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-semibold text-zinc-700">
                    Rejection reason for <span className="text-red-600 font-bold">{post.author}</span>:
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Needs more detail, off-topic, incorrect information..."
                    rows={4}
                    className="bg-zinc-50 border border-zinc-200 focus:border-red-400 rounded-[8px] px-3 py-2.5 text-[13px] w-full focus:outline-none resize-none transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={handleRejectConfirm}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] py-2.5 rounded-[8px] cursor-pointer transition-colors"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => { setRejectMode(false); setRejectionReason(''); }}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-[13px] py-2 rounded-[8px] cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {currentPost.status !== 'approved' && (
                    <button
                      onClick={handleApprove}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-[14px] py-3 rounded-[10px] cursor-pointer transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Approve & Publish
                    </button>
                  )}
                  {currentPost.status !== 'rejected' && (
                    <button
                      onClick={() => setRejectMode(true)}
                      className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[14px] py-3 rounded-[10px] cursor-pointer transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Reject with Reason
                    </button>
                  )}
                  {currentPost.status === 'approved' && (
                    <button
                      onClick={() => { onReject(post.id, ''); setRejectMode(true); }}
                      className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-[14px] py-3 rounded-[10px] cursor-pointer transition-colors"
                    >
                      Unpublish (Set to Pending)
                    </button>
                  )}
                  <div className="border-t border-zinc-100 pt-3 mt-1">
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-[13px] py-2.5 rounded-[10px] cursor-pointer transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Delete Post
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
