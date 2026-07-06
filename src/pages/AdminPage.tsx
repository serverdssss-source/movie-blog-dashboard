import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BlogPost } from '../types'

interface AdminPageProps {
  posts: BlogPost[]
  onDelete: (id: string) => void
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
}

export function AdminPage({ posts, onDelete, onApprove, onReject }: AdminPageProps) {
  const navigate = useNavigate()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleDeleteClick = (postId: string, title: string) => {
    const confirmation = prompt(`To confirm deleting the post "${title}", please type "DELETE":`)
    if (confirmation === 'DELETE') {
      onDelete(postId)
    }
  }

  const handleRejectConfirm = (postId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason for the author.')
      return
    }
    onReject(postId, rejectionReason.trim())
    setRejectingId(null)
    setRejectionReason('')
  }

  const getStatusBadge = (status: BlogPost['status']) => {
    switch (status) {
      case 'approved': return <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">✓ Approved</span>
      case 'rejected': return <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">✗ Rejected</span>
      default: return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">⏳ Pending</span>
    }
  }

  const pendingCount = posts.filter(p => p.status === 'pending').length

  return (
    <div className="bg-white border border-zinc-200 rounded-[16px] p-6 md:p-[35px] shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-[10px]">
        <h2 className="text-[28px] font-bold text-zinc-900">Moderation Dashboard</h2>
        {pendingCount > 0 && (
          <span className="bg-amber-100 text-amber-800 text-[13px] font-bold px-3 py-1 rounded-full">
            {pendingCount} post{pendingCount > 1 ? 's' : ''} awaiting review
          </span>
        )}
      </div>
      <p className="text-zinc-500 mb-[30px]">
        Click <strong>View Post</strong> to read the full content and take moderation action from a dedicated review page.
      </p>

      <div className="overflow-x-auto">
        {posts.length === 0 ? (
          <p className="text-zinc-400 text-center py-[30px]">No posts found.</p>
        ) : (
          <table className="w-full border-collapse mt-[15px]">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="p-[14px] text-left font-semibold text-zinc-500 text-[13px] uppercase tracking-[0.5px]">Title</th>
                <th className="p-[14px] text-left font-semibold text-zinc-500 text-[13px] uppercase tracking-[0.5px]">Author</th>
                <th className="p-[14px] text-left font-semibold text-zinc-500 text-[13px] uppercase tracking-[0.5px]">Status</th>
                <th className="p-[14px] text-left font-semibold text-zinc-500 text-[13px] uppercase tracking-[0.5px]">Date</th>
                <th className="p-[14px] text-right font-semibold text-zinc-500 text-[13px] uppercase tracking-[0.5px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <>
                  <tr key={post.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors duration-150">
                    <td className="p-[14px]">
                      <p className="font-semibold text-zinc-900 text-[14px] line-clamp-1">{post.title}</p>
                      <p className="text-[12px] text-zinc-400 mt-0.5">{post.category}</p>
                    </td>
                    <td className="p-[14px] text-zinc-700 text-[14px]">{post.author}</td>
                    <td className="p-[14px]">{getStatusBadge(post.status)}</td>
                    <td className="p-[14px] text-zinc-500 text-[13px]">{post.createdAt}</td>
                    <td className="p-[14px] text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* View Full Post — navigates to individual review page */}
                        <button
                          onClick={() => navigate(`/admin/review/${post.id}`)}
                          className="bg-zinc-900 hover:bg-zinc-700 text-white rounded-[6px] px-[12px] py-[6px] text-[12px] font-bold cursor-pointer transition-all duration-200 flex items-center gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          View Post
                        </button>
                        {post.status !== 'approved' && (
                          <button
                            onClick={() => onApprove(post.id)}
                            className="bg-green-50 text-green-700 border border-green-200 rounded-[6px] px-[10px] py-[5px] text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-green-100 hover:border-green-300"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {post.status !== 'rejected' && (
                          <button
                            onClick={() => { setRejectingId(post.id); setRejectionReason(''); }}
                            className="bg-amber-50 text-amber-700 border border-amber-200 rounded-[6px] px-[10px] py-[5px] text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-amber-100 hover:border-amber-300"
                          >
                            ✗ Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(post.id, post.title)}
                          className="bg-red-50 text-red-700 border border-red-200 rounded-[6px] px-[10px] py-[5px] text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-red-100 hover:border-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Inline rejection reason form */}
                  {rejectingId === post.id && (
                    <tr key={`${post.id}-reject`} className="border-b border-zinc-100 bg-amber-50/40">
                      <td colSpan={5} className="px-[14px] py-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex-grow min-w-[200px]">
                            <label className="text-[12px] font-bold text-zinc-600 mb-1 block">
                              Rejection reason (will be shown to {post.author}):
                            </label>
                            <input
                              type="text"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="e.g. Needs more detail, incorrect information, off-topic..."
                              className="bg-white border border-zinc-200 rounded-[6px] px-3 py-2 text-[13px] w-full focus:outline-none focus:border-zinc-500"
                              autoFocus
                            />
                          </div>
                          <div className="flex items-end gap-2 mt-1">
                            <button
                              onClick={() => handleRejectConfirm(post.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold px-3 py-2 rounded-[6px] cursor-pointer transition-colors"
                            >
                              Confirm Reject
                            </button>
                            <button
                              onClick={() => setRejectingId(null)}
                              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[12px] font-bold px-3 py-2 rounded-[6px] cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* Show existing rejection reason */}
                  {post.status === 'rejected' && post.rejectionReason && rejectingId !== post.id && (
                    <tr key={`${post.id}-reason`} className="border-b border-zinc-100 bg-red-50/30">
                      <td colSpan={5} className="px-[14px] py-2">
                        <p className="text-[12px] text-red-600 italic">
                          Rejection reason: "{post.rejectionReason}"
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
