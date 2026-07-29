import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

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
      },
      {
        id: '4',
        title: 'A Brief Review on the Suits of Harvey Specter',
        category: 'Review',
        rating: 5,
        content: `Harvey Reginald Specter is a fictional character, portrayed by Gabriel Macht, from the American legal drama Suits, which aired for nine seasons from 2011 to 2019. Harvey is a senior partner at one of the top law firms in Manhattan, where he and his team handle high-profile legal cases. Unsurprisingly, Harvey’s daily uniform consists of well-fitted suits that are as sharp as his wit and just as visually impressive.\n\nThe suits worn by Harvey Specter have been the subject of much online discussion over the years, earning him a spot as one of the most impeccably dressed TV characters in modern television. This post continues the celebration of his sartorial excellence, compiling insights from major online sources that analyze what makes Specter’s suits so outstanding, as well as offering tips on how to emulate his signature style.\n\nHarvey’s suits are clean, without any fussiness or excess, reflecting his no-nonsense approach to business. He has mastered what works for him and sticks to it — suits tailored with military precision, worn like armour for the battles he faces in the courtroom. One website highlighted some of his best looks, offering suggestions on how to achieve a similar style. These include the classic three-piece suit, evening wear, and winter overcoat.\n\nMeanwhile, another site, Gentleman’s Gazette, provided an in-depth guide on how to dress like Harvey Specter, specifically focusing on how to wear suits. This page shared valuable tips (and even offered some constructive critiques) on materials, patterns, lapel types, buttonholes, pocket styles, trousers, shirts, shoes, and, of course, the overall fit — delivering a comprehensive overview of Harvey Specter’s iconic style.\n\nA different website, ‘Gentleman’s Journal’ claimed that the wardrobe of the series is the real star of the show, at the same time showing appreciation for suits of Harvey and the style lessons to be learned;\n\nThe classic business suit is classic, for a reason\nGet the lapels on point\nNot ignoring the suit’s features\nHaving simple shirts\nImproving your neckwear\nBrave the waistcoat\nDitch the belt\nHave a nice wristwatch\nThe lessons mentioned are valuable for anyone looking to switch up their suit game.\n\nSimilarly, the website ‘Real Men Real Style‘ also breaks down the main elements of Harvey’s style into several elements;\n\nThe suits\nThe shirts\nThe accessories\nThe shoes\nCasual clothing\nThe hair\nThese elements focus on the overall style of the character, with some suggestions that are suitable for a day-to-day look as long as one has similar style affectations with Harvey Specter.\n\nLast but not least, several tailor/business websites promote their products/services online by advertising the suits of Harvey Specter. Top searches include the ones from Tailor on Ten and Savile Row Company. These websites include some photographs of Harvey and tips on how to convey the message brought by wearing those suits. Some of the valuable tips include;\n\nHave simple and slim tailoring.\nGo for peak lapel.\nNo over accessorising.\nKeep it monochromatic.\nLess is more for patterns and colour – except for the neckties.\nSimple white/light blue formal shirts.\nGo for the strong look for the necktie knot.\nLarge, proportional shirt collars.\nNo skinny neckties.\nThese tips are useful to emulate the suits and aura of Harvey Specter.\nMost, if not all, of the websites referenced in this post discuss the impeccable suits of Harvey Specter. The importance of a well-fitted suit and its impact on the wearer’s confidence cannot be overstated. The details and specifics of Harvey’s suits offer practical insights that can easily be adapted to one’s own wardrobe. While the external appearance can certainly be learned and observed from these sources, it is equally important to cultivate one’s character. Confidence, loyalty, and a strong work ethic should be developed in all areas of life. Ultimately, it is the combination of a powerful personality and an elegant appearance that makes Harvey Specter truly unforgettable. This is what we should all strive for. Stay cool.`,
        author: 'user',
        createdAt: '06/07/2026',
        image: 'https://i.pinimg.com/vwebpf/1200x/22/cd/ca/22cdcaf482629975b5c247aa22918fdb.webp',
        status: 'approved'
      },
      {
        id: '5',
        title: 'Review: Kantara Chapter 1 and some Critical Notes on its Cultural Narrative',
        category: 'Review',
        rating: 5,
        content: `Watched Kantara Chapter 1 (Kannada) in a houseful show over the weekend. It was a great cinematic experience overall, a much technically improved and classy prequel to the small budget Kantara (2022).\n\nUnlike the contemporary setting of Kantara, in this film, the story of conflict between the greedy and aggressor royal rulers and the forest dweller community in the adjoining hills is set in the ancient past, making this a period film.\n\nThe story and screenplay are essentially folk legend in style and narration and not historical. Though “Kadambas ruling Banawasi” (4th-7th century CE) is mentioned, it does not have any historical correlation, with ports, streets, palaces, Portugese merchants, slave trade etc. matching the 16th-18th century CE, not to speak of the language. It is evident that the director has deliberately chosen this folk style, as his main aim is to highlight the Daiva, Bhoota Kola and the mystical elements.\n\nRishab Shetty’s performance as Berme is awe inspiring, and deserves another National Award for best actor. Rukmini Vasanth’s great acting as Kanakavathi brings out the strong character, apart from adding glamour to the film. Gulshan Deviah as Kulashekara shines in the short, devilish role. All the other actors have also done well. The cinematography and VFX are top class. Background music maintains the rhythm and vibe till the end.\nAnd, there are quite a few logical fallacies and loose ends in the film, just like how most of the folk legends are, as they are developed and modified over time and will have variations even between two narrations of the same story, as per the whims and fancies of the narrator. This is the problem faced by the director attempting to mix up folk, some pop history, mystery and fantasy as a heady concoction. Instead of bothering much about logical consistency, the director seems to have thought that the “visuals”, the “action”, the “power” and “trance” will keep the audience engaged and captivated, as they will watch the film like a Loka-Katha, folktale, instead of Cinema. Seems he is quite right, going by the audience reactions and the overall acclaim the movie is receiving.\n\nThe depiction of spiritual trance and the Avesha (posession) of Guliga on the human was novel and breathtaking in the previous Kantara climax scene. In this film, the same is repeated twice, though with additional nuances, like different forms of Guliga, but still it does not result in a goosebump experience, as most viewers have seen it already in the first part.\n\nThis film ends with the final “message” that is quiet different and divergent from the previous one. Kantara (2022) ends with the bond of harmony developing between the empathetic forest officer (government) and the forest tribal community, with the greedy feudal landlord killed by the Daiva. In the present film, there is no such thing. The gesture of empathy extended by the Princess Kanakavathi turns out to be a deliberate fraud and the ultimate triumph of the forest tribals involves total annihilation of the royals. “Kaadu helide heccharaa” (forest warns — beware), goes the thunderous song during the final battle. And, in this film, another black-magic-performing evil forest tribe aligning with the royals gets added to the plot, unnecessarily complicating it.\n\nJust after the intermission, there is this enthralling scene of Shiva temple inauguration in which both the classical and tribal dances mingle and the Vedic chants by Brahmanas and the Daiva Aradhana rituals by tribals join together at one place. This could have been counted as a greatly inspiring visual of Hindu harmony, with the artificial boundaries of the so called “high culture” and “low culture” erased. But, alas, with the later storyline making the whole act of royals embracing tribals as a deliberate deception, this scene will now be interpreted completely in different light. This is a major negative point about the film.\n\nBut, there is a great, positive silver lining, still. Shiva, the Supreme Lord ultimately stands on the side of the weak, humble, battered and oppressed tribals who are Dharmic, and he does not favor the Adharmic royals, despite their “Brahminical” temple-building piety and all the “Tantric” black magic acts. So, this is a broader positive message in the film that upholds Hinduism as a force of social emancipation. The possibility of such layered interpretations makes the film deeper, beyond it’s outward story line which may appear simplistic.\n\nIn summary, Kanatara Chapter 1 is a great film and a visual treat with many cultural elements packed into it. Highly Recommended. Go watch it with your family in theaters in large numbers.\nWhen I published the above review in Facebook, there were many comments to which I responded. I have compiled them below, as they are important to understand the “politics” of the narratives set by this film and the cultural impressions that it subtly creates among the viewers.\n\n“Daivas were ancient souls who lived on this soil like Rama & Krishna, but who were suppressed by higher class people and raised voice against injustice against them and murdered by them and their bodies were buried so that nobody gets where they disappeared. Kāya māyavāda kathe (ಕಾಯ ಮಾಯವಾದ ಕಥೆ). That’s the bottom line. No connection to any Purana or God”, opined a commenter.\n\nSuch a view is reductionist and faulty.\n\nThe folk legends and stories all over the world have so much variety, but then researchers and anthropologists also spot similarities, and they always interpret the stories in the context of the larger cultural background and not in isolation. Because, every society and community has its own way of recording and preserving memories, always in tune with its native culture.\n\nIn India too, the folk legends, oral histories, ritualistic art forms, village ceremonies and festivals all of them have micro-histories embedded in them. And all these legends invariably connect to the Hindu tradition — through Devatas like Shiva, Vishnu and Devi and through Ramayana, Mahabharata and Puranic stories. This is why you have Bheemana Kallu (Bhima’s stone) in the Karnataka riverbank areas, for example.\n\nSo, viewing the local heroes who fought against injustice and died as Shiva Ganas very much fits in this cultural space. It is NOT a fraud or falsehood, but an organic way of how the forest tribals want to remember their heroes, making them part of the overall culture. The tragic deaths of heroes becoming “disappearances” in the folk story is a way of softening the bitterness and the “sublimation” of their life as a “Daiva Karya” or divine mission. This is a method of immortalizing them, and even expanding them beyond the local settings. That is why we see many Parivara Devatas and Kshetra Palas in large temples that are folk deities of that region.\n\nIn fact, if one takes the study still deeper, even the stories of “Great Gods” like Shiva, Durga or Krishna all have strong tribal elements in them which are inseparable now, because the integration happened at much ancient times and has become part of the overall classical literary tradition. Going still further, you can see that even Vedas are filled with so much tribal and primaeval practices all integrated into a more systematic Nature worship comprising Indra, Agni, Varuna, Vayu, Prithvi etc. through the mystical genius and spiritual vision the Vedic Rishis.\n\nAll this are part and parcel of the perennial Hindu cultural stream since very ancient times.\n\nSome critics find the depiction of exploitation of laborers and tribals by native Hindu kings in the film unpalatable and want to dismiss the film as “anti-Hindu” because of this. This is an over-reaction, I feel. All pre-modern societies in all countries were exploitative of vulnerable people — labourers, forest tribes and women. Hindu societies and kingdoms in different regions were no exception. There is no need to whitewash or suppress that history. But the greatness of Hindu Dharma lies in the fact that it is never affected or corrupted by these socio-political upheavels and always insists human empathy and justice as the ultimate Dharmic values. This is what should be stressed, and the movie certainly brings out this element. So, there is no reasoning behind dismissing it on this count.\n\n“Hindu orthodoxy is depicted negatively, as evil-doers are shown indulging in it”, is another criticism. The film only depicts an oppressive and greedy ruler who violates a traditional restraint put in place by their own ancestors. Yes, the ruler is shown a practitioner of Hindu orthodoxy, which is the default thing for all Hindu rulers all through history. THAT shouldn’t be taken as generalized representation of Hindu culture and the oppressive king is NOT to be construed as a representative of Hindu tradition. In fact, the evil Ravana is shown as the adherent of Vedic orthodoxy in the Ramayana. Many Puranic legends, stories of sages and saints from many regions of Bharat have characters of kings, Brahmanas, merchants etc. who are cruel and oppressive, but practitioners of Hindu orthodoxy. This perhaps reflects the social reality in an unbiased manner. But the film’s overall theme and spirit is positively aligned towards Hindu Dharma, that is what is to be noted here.`,
        author: 'admin',
        createdAt: '07/07/2026',
        image: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=800&auto=format&fit=crop',
        status: 'approved'
      }
    ]
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BlogPost[]
        // Migration: add status to existing posts if missing
        const migrated = parsed.map(p => ({ ...p, status: p.status || 'approved' as const }))
        
        let finalPosts = [...migrated];
        initialPosts.forEach(ip => {
          if (!finalPosts.some(p => p.id === ip.id)) {
            finalPosts.push(ip);
          }
        });
        return finalPosts;
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
      <ScrollToTop />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage posts={posts} />} />

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
