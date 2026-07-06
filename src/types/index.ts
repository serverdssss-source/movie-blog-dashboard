export interface BlogPost {
  id: string
  title: string
  category: 'Review' | 'Recommendation' | 'News' | 'Watchlist'
  rating?: number // 1 to 5, optional for news
  content: string
  author: string
  createdAt: string
  image?: string // Base64 Data URL or remote image URL
  status: 'pending' | 'approved' | 'rejected' // Moderation status
  rejectionReason?: string // Set by admin when rejecting a post
}

export interface User {
  username: string
  role: 'admin' | 'user'
}
