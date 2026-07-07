import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BlogPost, User } from '../types'

interface MyDashboardPageProps {
  currentUser: User
  posts: BlogPost[]
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'
type ViewMode = 'grid' | 'list'
type SortOption = 'newest' | 'oldest' | 'rating-high' | 'rating-low'

export function MyDashboardPage({ currentUser, posts }: MyDashboardPageProps) {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, searchQuery, sortBy])

  const myPosts = posts.filter(p => p.author === currentUser.username)
  const pending = myPosts.filter(p => p.status === 'pending')
  const approved = myPosts.filter(p => p.status === 'approved')
  const rejected = myPosts.filter(p => p.status === 'rejected')

  let displayedPosts = activeFilter === 'all'
    ? myPosts
    : myPosts.filter(p => p.status === activeFilter)

  // Apply search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    displayedPosts = displayedPosts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    )
  }

  // Apply sort
  displayedPosts = [...displayedPosts].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy === 'rating-high') {
      return (b.rating || 0) - (a.rating || 0)
    } else if (sortBy === 'rating-low') {
      return (a.rating || 0) - (b.rating || 0)
    }
    return 0
  })

  const POSTS_PER_PAGE = 6
  const totalPages = Math.ceil(displayedPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = displayedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

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
    const label = status === 'approved' ? 'Published' : status === 'rejected' ? 'Rejected' : 'Pending'
    return <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded-full">{label}</span>
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

  const filterColor = 'border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50'
  const filterActive = 'bg-zinc-900 border-zinc-900 text-white'

  const filters: { key: StatusFilter; label: string; count: number; color: string; activeColor: string }[] = [
    { key: 'all', label: 'All Posts', count: myPosts.length, color: filterColor, activeColor: filterActive },
    { key: 'pending', label: 'Pending', count: pending.length, color: filterColor, activeColor: filterActive },
    { key: 'approved', label: 'Published', count: approved.length, color: filterColor, activeColor: filterActive },
    { key: 'rejected', label: 'Rejected', count: rejected.length, color: filterColor, activeColor: filterActive },
  ]

  return (
    <div className="max-w-5xl mx-auto w-full text-left">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-[24px] md:text-[32px] font-black text-zinc-950">My Dashboard</h1>
          <p className="text-zinc-500 text-[12px] md:text-[14px] mt-0.5">Track your posts, manage rejections, and edit your content.</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-1.5 md:gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 md:px-5 md:py-2.5 rounded-[8px] text-[12px] md:text-[13px] transition-colors cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Post
        </button>
      </div>

      {/* Filter Tabs & Pagination */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-[30px] text-[11px] md:text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${activeFilter === f.key ? f.activeColor : `bg-white ${f.color}`}`}
            >
              {f.label}
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeFilter === f.key ? 'bg-white/25 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Top Pagination - Hidden on mobile */}
        <div className="hidden md:block">
          <PaginationControls className="w-auto" />
        </div>
      </div>

      {/* Search, View, and Sort Row */}
      <div className="flex items-center gap-2 mb-6 w-full overflow-x-auto pb-1 hide-scrollbar">
        {/* Search */}
        <div className="relative flex-grow min-w-[120px]">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-[8px] pl-9 pr-3 py-[9px] text-[12px] md:text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors shadow-sm placeholder-zinc-400"
          />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-[8px] p-1 shadow-sm flex-shrink-0">
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
        
        {/* Sort */}
        <div className="relative flex-shrink-0">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {/* Filter/Sort Icon (3 stacked centered lines) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M5.25 12h13.5m-10.5 5.25h7.5" />
            </svg>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none bg-white border border-zinc-200 rounded-[8px] pl-9 pr-7 py-[9px] text-[12px] md:text-[13px] font-semibold text-zinc-700 cursor-pointer focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
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
          <p className="text-zinc-400 text-[14px]">No posts matched your search or filters.</p>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedPosts.map(p => <GridCard key={p.id} post={p} />)}
            </div>
            <PaginationControls />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {paginatedPosts.map(p => <ListCard key={p.id} post={p} />)}
            </div>
            <PaginationControls />
          </>
        )
      )}
    </div>
  )
}
