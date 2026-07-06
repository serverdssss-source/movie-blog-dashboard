import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import type { User, BlogPost } from './types'
import { LandingPage } from './pages/LandingPage'
import { InnerAppLayout } from './components/InnerAppLayout'
import { FeedPage } from './pages/FeedPage'
import { LoginPage } from './pages/LoginPage'
import { UploadPage } from './pages/UploadPage'
import { AdminPage } from './pages/AdminPage'
import { AdminReviewPage } from './pages/AdminReviewPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { MyDashboardPage } from './pages/MyDashboardPage'
import { EditPostPage } from './pages/EditPostPage'

function App() {
  // Authentication & Blog States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('movie_blog_user')
    return saved ? JSON.parse(saved) : null
  })

  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('movie_blog_posts')
    const initialPosts: BlogPost[] = [
      {
        id: '3',
        title: 'The Witcher - A Thrilling Fantasy Saga',
        category: 'Review',
        rating: 5,
        content: "An absolutely stellar adaptation of Andrzej Sapkowski's fantasy world. Henry Cavill delivers a phenomenal, career-defining performance as Geralt of Rivia, capturing the character's gruff exterior and deep moral compass perfectly. The swordplay choreography is second to none, the world-building is rich and immersive, and the musical score is hauntingly beautiful. A must-watch for all fantasy enthusiasts!",
        author: 'admin',
        createdAt: new Date('2026-07-03').toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
        status: 'approved'
      },
      {
        id: '1',
        title: 'Inception - Mind Bending Masterpiece',
        category: 'Review',
        rating: 5,
        content: "A detailed look at Christopher Nolan's classic. The dream within a dream concept still holds up incredibly well today. The cinematography, Hans Zimmer's score, and the ensemble cast deliver a perfect cinematic experience.",
        author: 'admin',
        createdAt: new Date('2026-07-01').toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
        status: 'approved'
      },
      {
        id: '2',
        title: 'Top 5 Sci-Fi Movies to Watch This Weekend',
        category: 'Recommendation',
        rating: 4,
        content: 'If you love Interstellar, you must watch Arrival, Blade Runner 2049, Contact, and Coherence. These movies will make you think and expand your horizons.',
        author: 'user1',
        createdAt: new Date('2026-07-02').toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
        status: 'approved'
      }
    ]
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BlogPost[]
        // Migration: add status to existing posts if missing
        const migrated = parsed.map(p => ({ ...p, status: p.status || 'approved' as const }))
        if (!migrated.some(p => p.id === '3')) {
          return [initialPosts[0], ...migrated]
        }
        return migrated
      } catch (e) {
        return initialPosts
      }
    }
    return initialPosts
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
      createdAt: new Date().toLocaleDateString(),
      status: 'pending' // New posts always start pending
    }
    setPosts([post, ...posts])
  }

  const handleUpdatePost = (id: string, updatedFields: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'author'>>) => {
    setPosts(posts.map(p =>
      p.id === id
        ? { ...p, ...updatedFields, status: 'pending', rejectionReason: undefined }
        : p
    ))
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  const handleApprovePost = (id: string) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, status: 'approved', rejectionReason: undefined } : p
    ))
  }

  const handleRejectPost = (id: string, reason: string) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, status: 'rejected', rejectionReason: reason } : p
    ))
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Standalone Login/Signup Route */}
        <Route path="/login" element={
          <LoginPage 
            currentUser={currentUser} 
            onLogin={handleLogin} 
          />
        } />

        {/* Inner App Routing (wrapped with layout) */}
        <Route 
          path="/*" 
          element={
            <InnerAppLayout 
              currentUser={currentUser} 
              onLogout={handleLogout}
            >
              <Routes>
                <Route path="feed" element={
                  <FeedPage posts={posts} />
                } />
                <Route path="post/:id" element={
                  <PostDetailPage posts={posts} />
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
                <Route path="dashboard" element={
                  currentUser ? (
                    <MyDashboardPage
                      currentUser={currentUser}
                      posts={posts}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } />
                <Route path="edit/:id" element={
                  currentUser ? (
                    <EditPostPage
                      posts={posts}
                      currentUser={currentUser}
                      onUpdatePost={handleUpdatePost}
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
                      onApprove={handleApprovePost}
                      onReject={handleRejectPost}
                    />
                  ) : (
                    <Navigate to="/feed" replace />
                  )
                } />
                <Route path="admin/review/:id" element={
                  currentUser?.role === 'admin' ? (
                    <AdminReviewPage
                      posts={posts}
                      onApprove={handleApprovePost}
                      onReject={handleRejectPost}
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
