export interface BlogPost {
  id: string
  title: string
  category: 'Review' | 'Recommendation' | 'News' | 'Watchlist'
  rating?: number // 1 to 5, optional for news
  content: string
  author: string
  createdAt: string
}

export interface User {
  username: string
  role: 'admin' | 'user'
}
