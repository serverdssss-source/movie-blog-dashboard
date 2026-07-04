import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import type { User, BlogPost } from './types'
import { LandingPage } from './pages/LandingPage'
import { InnerAppLayout } from './components/InnerAppLayout'
import { FeedPage } from './pages/FeedPage'
import { LoginPage } from './pages/LoginPage'
import { UploadPage } from './pages/UploadPage'
import { AdminPage } from './pages/AdminPage'

function App() {
  // Authentication & Blog States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('movie_blog_user')
    return saved ? JSON.parse(saved) : null
  })

  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('movie_blog_posts')
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Inception - Mind Bending Masterpiece',
        category: 'Review',
        rating: 5,
        content: "A detailed look at Christopher Nolan's classic. The dream within a dream concept still holds up incredibly well today. The cinematography, Hans Zimmer's score, and the ensemble cast deliver a perfect cinematic experience.",
        author: 'admin',
        createdAt: new Date('2026-07-01').toLocaleDateString()
      },
      {
        id: '2',
        title: 'Top 5 Sci-Fi Movies to Watch This Weekend',
        category: 'Recommendation',
        rating: 4,
        content: 'If you love Interstellar, you must watch Arrival, Blade Runner 2049, Contact, and Coherence. These movies will make you think and expand your horizons.',
        author: 'user1',
        createdAt: new Date('2026-07-02').toLocaleDateString()
      }
    ]
  })

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('movie_blog_posts', JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('movie_blog_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('movie_blog_user')
    }
  }, [currentUser])

  // Handlers
  const handleLogin = (username: string, role: 'admin' | 'user') => {
    setCurrentUser({ username, role })
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const handleAddPost = (newPost: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const post: BlogPost = {
      ...newPost,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString()
    }
    setPosts([post, ...posts])
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page (matches design reference exactly) */}
        <Route path="/" element={<LandingPage />} />

        {/* Inner App Routing (wrapped with glassmorphic layout) */}
        <Route 
          path="/*" 
          element={
            <InnerAppLayout 
              currentUser={currentUser} 
              onLogout={handleLogout}
            >
              <Routes>
                <Route path="feed" element={
                  <FeedPage 
                    posts={posts} 
                    currentUser={currentUser} 
                    onDelete={handleDeletePost} 
                  />
                } />
                <Route path="login" element={
                  <LoginPage 
                    currentUser={currentUser} 
                    onLogin={handleLogin} 
                  />
                } />
                <Route path="upload" element={
                  currentUser ? (
                    <UploadPage 
                      currentUser={currentUser} 
                      onAddPost={handleAddPost} 
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } />
                <Route path="admin" element={
                  currentUser?.role === 'admin' ? (
                    <AdminPage 
                      posts={posts} 
                      onDelete={handleDeletePost} 
                    />
                  ) : (
                    <Navigate to="/feed" replace />
                  )
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </InnerAppLayout>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
