import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import './App.css'

// Types
interface BlogPost {
  id: string
  title: string
  category: 'Review' | 'Recommendation' | 'News' | 'Watchlist'
  rating?: number // 1 to 5, optional for news
  content: string
  author: string
  createdAt: string
}

interface User {
  username: string
  role: 'admin' | 'user'
}

function App() {
  // State
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
        content: 'A detailed look at Christopher Nolan\'s classic. The dream within a dream concept still holds up incredibly well today.',
        author: 'admin',
        createdAt: new Date('2026-07-01').toLocaleDateString()
      },
      {
        id: '2',
        title: 'Top 5 Sci-Fi Movies to Watch This Weekend',
        category: 'Recommendation',
        rating: 4,
        content: 'If you love Interstellar, you must watch Arrival, Blade Runner 2049, Contact, and Coherence.',
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
      <div>
        {/* Navigation Bar */}
        <nav className="flex-between">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <strong style={{ fontSize: '1.2rem' }}>Movie Blog Dashboard</strong>
            <Link to="/">Home / Feed</Link>
            {currentUser && <Link to="/upload">Upload Blog</Link>}
            {currentUser?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
          </div>
          <div>
            {currentUser ? (
              <span style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span>Logged in as: <strong>{currentUser.username}</strong> ({currentUser.role})</span>
                <button onClick={handleLogout}>Logout</button>
              </span>
            ) : (
              <Link to="/login"><button>Login</button></Link>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={
            <FeedPage 
              posts={posts} 
              currentUser={currentUser} 
              onDelete={handleDeletePost} 
            />
          } />
          <Route path="/login" element={
            <LoginPage 
              currentUser={currentUser} 
              onLogin={handleLogin} 
            />
          } />
          <Route path="/upload" element={
            currentUser ? (
              <UploadPage 
                currentUser={currentUser} 
                onAddPost={handleAddPost} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/admin" element={
            currentUser?.role === 'admin' ? (
              <AdminPage 
                posts={posts} 
                onDelete={handleDeletePost} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
      </div>
    </Router>
  )
}

// Subcomponents / Pages

// 1. Feed Page
interface FeedPageProps {
  posts: BlogPost[]
  currentUser: User | null
  onDelete: (id: string) => void
}
function FeedPage({ posts, currentUser, onDelete }: FeedPageProps) {
  const [filter, setFilter] = useState<string>('All')

  const filteredPosts = filter === 'All' 
    ? posts 
    : posts.filter(post => post.category === filter)

  return (
    <div>
      <h2>Movie Feed & Reviews</h2>
      
      {/* Category Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {['All', 'Review', 'Recommendation', 'News', 'Watchlist'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            style={{ fontWeight: filter === cat ? 'bold' : 'normal', border: filter === cat ? '2px solid #000' : '1px solid #ccc' }}
          >
            {cat}s
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p>No blog posts found in this category.</p>
      ) : (
        filteredPosts.map(post => (
          <div key={post.id} className="card">
            <div className="flex-between">
              <h3>{post.title}</h3>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {post.category} {post.rating ? `• Rating: ${post.rating}/5` : ''}
              </span>
            </div>
            <p style={{ margin: '15px 0', whiteSpace: 'pre-wrap' }}>{post.content}</p>
            <div className="flex-between" style={{ fontSize: '0.85rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <span>Published by <strong>{post.author}</strong> on {post.createdAt}</span>
              {(currentUser?.role === 'admin' || currentUser?.username === post.author) && (
                <button onClick={() => onDelete(post.id)} style={{ color: 'red', border: '1px solid red', padding: '4px 8px' }}>
                  Delete Post
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// 2. Login Page
interface LoginPageProps {
  currentUser: User | null
  onLogin: (username: string, role: 'admin' | 'user') => void
}
function LoginPage({ currentUser, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>('user')
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onLogin(username.trim(), role)
      navigate('/')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }} className="card">
      <h2>Login / Register Role</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter username" 
          required 
        />

        <label style={{ display: 'block', marginBottom: '5px' }}>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'user')}>
          <option value="user">Regular User (Can post and delete own posts)</option>
          <option value="admin">Administrator (Can post and delete any posts)</option>
        </select>

        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Login</button>
      </form>
    </div>
  )
}

// 3. Upload Page
interface UploadPageProps {
  currentUser: User
  onAddPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void
}
function UploadPage({ currentUser, onAddPost }: UploadPageProps) {
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
      navigate('/')
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }} className="card">
      <h2>Upload Movie Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g., The Dark Knight Review" 
          required 
        />

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as any)}>
              <option value="Review">Review</option>
              <option value="Recommendation">Recommendation</option>
              <option value="News">News</option>
              <option value="Watchlist">Watchlist</option>
            </select>
          </div>
          
          {category !== 'News' && (
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1-5):</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Bad</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>
          )}
        </div>

        <label style={{ display: 'block', marginBottom: '5px' }}>Content / Review:</label>
        <textarea 
          rows={8} 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Write your movie review or recommendation details here..." 
          required 
        />

        <button type="submit" style={{ marginTop: '10px' }}>Publish Post</button>
      </form>
    </div>
  )
}

// 4. Admin Page
interface AdminPageProps {
  posts: BlogPost[]
  onDelete: (id: string) => void
}
function AdminPage({ posts, onDelete }: AdminPageProps) {
  return (
    <div>
      <h2>Admin Moderation Panel</h2>
      <p>As an administrator, you have permission to delete any post from the dashboard feed.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>All Active Posts ({posts.length})</h3>
        {posts.length === 0 ? (
          <p>No active posts.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Title</th>
                <th style={{ padding: '8px' }}>Category</th>
                <th style={{ padding: '8px' }}>Author</th>
                <th style={{ padding: '8px' }}>Date</th>
                <th style={{ padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{post.title}</td>
                  <td style={{ padding: '8px' }}>{post.category}</td>
                  <td style={{ padding: '8px' }}>{post.author}</td>
                  <td style={{ padding: '8px' }}>{post.createdAt}</td>
                  <td style={{ padding: '8px' }}>
                    <button 
                      onClick={() => onDelete(post.id)} 
                      style={{ color: 'red', border: '1px solid red', padding: '2px 6px', fontSize: '0.85rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
