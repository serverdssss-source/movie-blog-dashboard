import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BlogPost, User } from '../types'

interface MyDashboardPageProps {
  currentUser: User
  posts: BlogPost[]
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'
type ViewMode = 'grid' | 'list'

export function MyDashboardPage({ currentUser, posts }: MyDashboardPageProps) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const myPosts = posts.filter(p => p.author === currentUser.username)
  const pending = myPosts.filter(p => p.status === 'pending')
  const approved = myPosts.filter(p => p.status === 'approved')
  const rejected = myPosts.filter(p => p.status === 'rejected')

  const displayedPosts = activeFilter === 'all'
    ? myPosts
    : myPosts.filter(p => p.status === activeFilter)

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Review': return 'bg-red-50 text-red-700 border-red-100'
      case 'Recommendation': return 'bg-green-50 text-green-700 border-green-100'
      case 'News': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'Watchlist': return 'bg-orange-50 text-orange-700 border-orange-100'
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-200'
    }
  }

  const getStatusChip = (status: BlogPost['status']) => {
    switch (status) {
      case 'approved': return <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Published</span>
      case 'rejected': return <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">✗ Rejected</span>
      default: return <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⏳ Pending</span>
    }
  }

  const GridCard = ({ post }: { post: BlogPost }) => (
    <div className={`bg-white border rounded-[14px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col ${post.status === 'rejected' ? 'border-red-200' : 'border-zinc-200'}`}>
      {post.image && (
        <div className="w-full h-[160px] overflow-hidden bg-zinc-100 select-none flex-shrink-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <span className={`inline-block px-[9px] py-[3px] rounded-full text-[10px] font-bold uppercase tracking-[0.5px] border ${getCategoryBadge(post.category)}`}>
            {post.category}
          </span>
          {getStatusChip(post.status)}
        </div>
        <h3 className="font-extrabold text-zinc-900 text-[15px] leading-snug line-clamp-2 flex-grow">{post.title}</h3>
        {post.rating !== undefined && (
          <p className="text-amber-500 text-[12px] font-bold mt-1 select-none">{'★'.repeat(post.rating)}{'☆'.repeat(5 - post.rating)}</p>
        )}
        <p className="text-[12px] text-zinc-400 mt-1">{post.createdAt}</p>

        {post.status === 'rejected' && post.rejectionReason && (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-[8px] p-3">
            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">Admin's Feedback</p>
            <p className="text-[12px] text-red-800 line-clamp-2">"{post.rejectionReason}"</p>
          </div>
        )}

        <div className="flex gap-2 mt-3 flex-wrap">
          {(post.status === 'rejected' || post.status === 'approved') && (
            <button
              onClick={() => navigate(`/edit/${post.id}`)}
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-[6px] transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
              Edit
            </button>
          )}
          {post.status === 'approved' && (
            <button
              onClick={() => navigate(`/post/${post.id}`)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-[6px] transition-colors cursor-pointer"
            >
              View Live
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const ListCard = ({ post }: { post: BlogPost }) => (
    <div className={`bg-white border rounded-[12px] p-4 shadow-sm hover:shadow-md transition-all duration-200 flex gap-4 items-start ${post.status === 'rejected' ? 'border-red-200' : 'border-zinc-200'}`}>
      {post.image && (
        <div className="w-[90px] h-[68px] rounded-[8px] overflow-hidden bg-zinc-100 flex-shrink-0 select-none">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-extrabold text-zinc-900 text-[15px] leading-snug">{post.title}</h3>
          {getStatusChip(post.status)}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`inline-block px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-[0.5px] border ${getCategoryBadge(post.category)}`}>
            {post.category}
          </span>
          {post.rating !== undefined && (
            <span className="text-amber-500 text-[11px] font-bold select-none">{'★'.repeat(post.rating)}{'☆'.repeat(5 - post.rating)}</span>
          )}
          <span className="text-[11px] text-zinc-400">{post.createdAt}</span>
        </div>
        <p className="text-zinc-500 text-[13px] mt-1.5 line-clamp-1">{post.content}</p>
        {post.status === 'rejected' && post.rejectionReason && (
          <p className="text-[12px] text-red-700 mt-2 bg-red-50 border border-red-100 rounded-[6px] px-2.5 py-1.5 line-clamp-1">
            Admin: "{post.rejectionReason}"
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0 items-end">
        {(post.status === 'rejected' || post.status === 'approved') && (
          <button
            onClick={() => navigate(`/edit/${post.id}`)}
            className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
            Edit
          </button>
        )}
        {post.status === 'approved' && (
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap"
          >
            View Live
          </button>
        )}
      </div>
    </div>
  )

  const filters: { key: StatusFilter; label: string; count: number; color: string; activeColor: string }[] = [
    { key: 'all', label: 'All Posts', count: myPosts.length, color: 'border-zinc-200 text-zinc-600 hover:border-zinc-400', activeColor: 'bg-zinc-900 border-zinc-900 text-white' },
    { key: 'pending', label: '⏳ Pending', count: pending.length, color: 'border-amber-200 text-amber-700 hover:border-amber-400 hover:bg-amber-50', activeColor: 'bg-amber-600 border-amber-600 text-white' },
    { key: 'approved', label: '✅ Published', count: approved.length, color: 'border-green-200 text-green-700 hover:border-green-400 hover:bg-green-50', activeColor: 'bg-green-600 border-green-600 text-white' },
    { key: 'rejected', label: '❌ Rejected', count: rejected.length, color: 'border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50', activeColor: 'bg-red-600 border-red-600 text-white' },
  ]

  return (
    <div className="max-w-5xl mx-auto w-full text-left">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-black text-zinc-950">My Dashboard</h1>
          <p className="text-zinc-500 text-[14px] mt-0.5">Track your posts, manage rejections, and edit your content.</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-[8px] text-[13px] transition-colors cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Post
        </button>
      </div>

      {/* Filter Tabs + View Toggle Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[30px] text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${activeFilter === f.key ? f.activeColor : `bg-white ${f.color}`}`}
            >
              {f.label}
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeFilter === f.key ? 'bg-white/25 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-[8px] p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`flex items-center justify-center w-8 h-8 rounded-[6px] transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`flex items-center justify-center w-8 h-8 rounded-[6px] transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {myPosts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-[16px] p-14 text-center shadow-sm">
          <div className="text-[48px] mb-3 select-none">🎬</div>
          <h3 className="text-[18px] font-bold text-zinc-900 mb-2">No posts yet</h3>
          <p className="text-zinc-500 text-[14px] mb-6">Upload your first movie review or recommendation to get started.</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-[8px] text-[14px] transition-colors cursor-pointer"
          >
            Upload a Post
          </button>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-[16px] p-10 text-center shadow-sm">
          <p className="text-zinc-400 text-[14px]">No posts with this status.</p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedPosts.map(p => <GridCard key={p.id} post={p} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayedPosts.map(p => <ListCard key={p.id} post={p} />)}
          </div>
        )
      )}
    </div>
  )
}
