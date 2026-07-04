import type { BlogPost } from '../types'

interface AdminPageProps {
  posts: BlogPost[]
  onDelete: (id: string) => void
}

export function AdminPage({ posts, onDelete }: AdminPageProps) {
  return (
    <div className="bg-white/8 backdrop-blur-[20px] border border-white/15 rounded-[16px] p-6 md:p-[35px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <h2 className="text-[28px] font-bold mb-[10px] text-white">Moderation Dashboard</h2>
      <p className="text-white/70 mb-[30px]">
        You are in Admin mode. You can moderate all current movie posts on the dashboard below.
      </p>
      
      <div className="overflow-x-auto">
        {posts.length === 0 ? (
          <p className="text-white/50 text-center py-[30px]">No active posts found.</p>
        ) : (
          <table className="w-full border-collapse mt-[15px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-[14px] text-left font-semibold text-white/70 text-[14px] uppercase tracking-[0.5px]">Title</th>
                <th className="p-[14px] text-left font-semibold text-white/70 text-[14px] uppercase tracking-[0.5px]">Category</th>
                <th className="p-[14px] text-left font-semibold text-white/70 text-[14px] uppercase tracking-[0.5px]">Author</th>
                <th className="p-[14px] text-left font-semibold text-white/70 text-[14px] uppercase tracking-[0.5px]">Date</th>
                <th className="p-[14px] text-right font-semibold text-white/70 text-[14px] uppercase tracking-[0.5px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-white/10 hover:bg-white/2 transition-colors duration-150">
                  <td className="p-[14px] font-medium text-white">{post.title}</td>
                  <td className="p-[14px] text-white/80">{post.category}</td>
                  <td className="p-[14px] text-white/80">{post.author}</td>
                  <td className="p-[14px] text-white/60">{post.createdAt}</td>
                  <td className="p-[14px] text-right">
                    <button 
                      onClick={() => onDelete(post.id)} 
                      className="bg-red-600/20 text-[#ff4d4d] border border-red-600/40 rounded-[6px] px-[12px] py-[6px] text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600/30 hover:border-red-600/80"
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
