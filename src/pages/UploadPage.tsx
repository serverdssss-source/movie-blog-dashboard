import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BlogPost, User } from '../types'
import StaggeredTextRoll from '../components/StaggeredTextRoll'
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface UploadPageProps {
  currentUser: User
  onAddPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void
}

export function UploadPage({ currentUser, onAddPost }: UploadPageProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'Review' | 'Recommendation' | 'News' | 'Watchlist'>('Review')
  const [rating, setRating] = useState<number>(5)
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  
  // Cropping states
  const [imgSrc, setImgSrc] = useState('')
  const [isCropping, setIsCropping] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 0,
    y: 12.5,
    width: 100,
    height: 75
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [dragActive, setDragActive] = useState(false)
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImgSrc(e.target.result as string)
          setIsCropping(true)
          setCrop({
            unit: '%',
            x: 0,
            y: 12.5,
            width: 100,
            height: 75
          })
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please upload a valid image file.')
    }
  }

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )
    
    try {
      const base64Image = canvas.toDataURL('image/jpeg', 0.95)
      setImage(base64Image)
      setIsCropping(false)
      setImgSrc('')
    } catch (e) {
      alert("Cannot crop this image due to its server's security (CORS) settings. You can still use it uncropped.")
      setImage(imgSrc)
      setIsCropping(false)
      setImgSrc('')
    }
  }

  const cancelCrop = () => {
    setIsCropping(false)
    setImgSrc('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onAddPost({
        title: title.trim(),
        category,
        rating: category !== 'News' ? rating : undefined,
        content: content.trim(),
        author: currentUser.username,
        image: image.trim() || undefined,
        status: 'pending'
      })
      navigate('/feed')
    }
  }

  return (
    <div className="max-w-[700px] mx-auto bg-white border border-zinc-200 rounded-[16px] p-6 md:p-[35px] shadow-sm">
      <h2 className="text-[28px] font-bold mb-[25px] text-zinc-900 text-left">Create Movie Post</h2>
      
      <form onSubmit={handleSubmit} className="text-left">
        <div className="mb-[20px]">
          <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Title</label>
          <input 
            type="text" 
            className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none transition-all duration-200 placeholder-zinc-400"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Dune: Part Two review" 
            required 
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-[20px] mb-[20px]">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Category</label>
            <select 
              className="bg-white border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none transition-all duration-200 cursor-pointer"
              value={category} 
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="Review">Review</option>
              <option value="Recommendation">Recommendation</option>
              <option value="News">News</option>
              <option value="Watchlist">Watchlist</option>
            </select>
          </div>
          
          {category !== 'News' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Rating</label>
              <select 
                className="bg-white border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none transition-all duration-200 cursor-pointer"
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>5 ★ - Masterpiece</option>
                <option value={4}>4 ★ - Very Good</option>
                <option value={3}>3 ★ - Average</option>
                <option value={2}>2 ★ - Disappointing</option>
                <option value={1}>1 ★ - Avoid</option>
              </select>
            </div>
          )}
        </div>

        {/* Cover Image Upload & URL */}
        <div className="mb-[20px] flex flex-col gap-3">
          <label className="block text-[14px] font-semibold text-zinc-800">Cover Image (Optional)</label>
          
          {isCropping && imgSrc ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-[8px] p-5 flex flex-col gap-4 items-center">
              <p className="text-[14px] font-semibold text-zinc-800">Crop your image</p>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={4 / 3}
                className="max-h-[500px]"
              >
                <img 
                  ref={imgRef}
                  src={imgSrc} 
                  crossOrigin="anonymous"
                  alt="Crop preview" 
                  className="max-h-[400px] w-auto object-contain"
                  onError={() => {
                    alert("This image URL cannot be cropped because the hosting server blocks security access (CORS). You can still use the uncropped image.");
                    setImage(imgSrc);
                    setIsCropping(false);
                    setImgSrc('');
                  }}
                />
              </ReactCrop>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={cancelCrop}
                  className="px-4 py-2 text-[14px] font-semibold text-zinc-600 bg-zinc-200 hover:bg-zinc-300 rounded-[6px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={getCroppedImg}
                  className="px-4 py-2 text-[14px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-[6px] transition-colors"
                >
                  Crop & Save
                </button>
              </div>
            </div>
          ) : image ? (
            /* Preview container (shown if an image/url exists) */
            <div className="relative w-full rounded-[8px] overflow-hidden border border-zinc-200 shadow-inner group select-none">
              {imageError ? (
                /* Error card */
                <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 text-[18px]">⚠️</span>
                    <p className="font-bold text-amber-800 text-[14px]">Cannot load this image link</p>
                  </div>
                  <p className="text-amber-700 text-[13px] leading-relaxed">
                    This link points to a webpage (like Pinterest or Instagram), not a direct image file.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setImage(''); setImageError(false); }}
                    className="self-start bg-amber-600 text-white font-semibold text-[12px] px-[12px] py-[6px] rounded-[6px] cursor-pointer hover:bg-amber-700 transition-colors mt-1"
                  >
                    Clear & Try Again
                  </button>
                </div>
              ) : (
                /* Success preview */
                <div className="relative h-[280px]">
                  <img
                    src={image}
                    alt="Preview Banner"
                    className="w-full h-full object-cover object-center"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => { 
                        setImgSrc(image);
                        setIsCropping(true);
                        setCrop({ unit: '%', x: 0, y: 12.5, width: 100, height: 75 });
                        setImage(''); 
                      }}
                      className="bg-zinc-800 text-white font-semibold text-[13px] px-[14px] py-[8px] rounded-[6px] cursor-pointer hover:bg-zinc-900 transition-colors shadow border border-zinc-700"
                    >
                      Crop Image
                    </button>
                    <button
                      type="button"
                      onClick={() => { setImage(''); setImageError(false); }}
                      className="bg-red-600 text-white font-semibold text-[13px] px-[14px] py-[8px] rounded-[6px] cursor-pointer hover:bg-red-700 transition-colors shadow"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Upload & link inputs (always visible unless cropping) */}
          {!isCropping && (
            <div className="flex flex-col gap-3">
              <div
                className={`border-2 border-dashed rounded-[8px] p-6 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragActive(false)
                  if (e.dataTransfer.files?.[0]) {
                    handleFileChange(e.dataTransfer.files[0])
                  }
                }}
                onClick={() => document.getElementById('image-file-input')?.click()}
              >
                <input
                  id="image-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0])
                    }
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 mx-auto text-zinc-400 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <p className="text-[14px] font-medium text-zinc-700">
                  Drag & drop a <span className="font-bold text-red-600">horizontal image</span> for better placement, or <span className="text-zinc-900 underline font-semibold">browse files</span>
                </p>
                <p className="text-[12px] text-zinc-400 mt-1">Supports JPG, PNG, WebP. You can crop it after selecting.</p>
              </div>

              <div className="flex items-center gap-[10px] w-full">
                <hr className="flex-grow border-zinc-200" />
                <span className="text-[12px] font-semibold text-zinc-400 uppercase tracking-[0.5px]">Or</span>
                <hr className="flex-grow border-zinc-200" />
              </div>

              <input
                type="url"
                placeholder="Paste external image URL (e.g. https://...)"
                value={image.startsWith('data:image/') ? '' : image}
                onChange={(e) => { setImage(e.target.value); setImageError(false); }}
                className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[10px] text-[14px] font-sans w-full focus:outline-none transition-all duration-200 placeholder-zinc-400"
              />
            </div>
          )}
        </div>

        <div className="mb-[25px]">
          <label className="block text-[14px] font-semibold mb-[8px] text-zinc-800">Write Content</label>
          <textarea 
            className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black rounded-[8px] text-black px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none transition-all duration-200 placeholder-zinc-400"
            rows={8} 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Write your review, movie suggestions, watchlist description, or industry news here..." 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="bg-red-600 text-white border-none rounded-[8px] px-[24px] py-[12px] text-[15px] font-semibold cursor-pointer w-full transition-all duration-200 hover:bg-red-700 hover:-translate-y-[1px]"
        >
          <StaggeredTextRoll text="Publish Review" />
        </button>
      </form>
    </div>
  )
}
