import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SplitText from '../components/SplitText'
import StaggeredTextRoll from '../components/StaggeredTextRoll'

export function LandingPage() {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const width = window.innerWidth;
      // Calculate exact loop width including the 10px wider center card (Card 4)
      let loopWidth = 1648; // lg (7 cards visible: 6 * 220 + 230 + 7 * 14px gaps)
      if (width < 768) {
        loopWidth = 478; // mobile (3 cards visible: 2 * 150 + 160 + 3 * 6px gaps)
      } else if (width < 1024) {
        loopWidth = 1180; // md (5 cards visible: 4 * 220 + 230 + 5 * 14px gaps)
      }
      const offset = (window.scrollY * 0.55) % loopWidth;
      setScrollOffset(offset);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section (First Section) */}
      <div className="bg-landing min-h-screen w-full flex flex-col relative">
        {/* Header Grid */}
        <header className="flex justify-between md:grid md:grid-cols-3 items-center w-full px-5 md:px-[60px] py-6 md:py-[25px] absolute top-0 left-0 z-10 gap-4">
          <div className="hidden md:block"></div> {/* Left Spacer */}
          <div className="flex justify-start md:justify-center">
            <img
              src="/Prabhava_logo.png"
              alt="Prabhava Logo"
              className="h-[50px] md:h-[70px] w-[130px] md:w-[180px] object-cover object-center cursor-pointer"
            />
          </div>
          <div className="flex justify-end md:justify-end gap-[15px] items-center">
            <Link
              to="/login?mode=signup"
              className="font-sans text-[14px] md:text-[15px] font-semibold px-5 py-2.5 rounded-full cursor-pointer bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm text-center"
            >
              <StaggeredTextRoll text="Sign Up" />
            </Link>
            <Link
              to="/login?mode=signin"
              className="font-sans text-[14px] md:text-[15px] font-semibold px-5 py-2.5 rounded-full cursor-pointer bg-transparent text-white border border-white/50 hover:bg-white/10 hover:border-white/80 transition-all shadow-sm text-center"
            >
              <StaggeredTextRoll text="Login" />
            </Link>
          </div>
        </header>

        {/* Hero content */}
        <main className="flex-grow flex flex-col justify-center items-center text-center px-[20px] py-[120px] md:py-[100px] max-w-8xl mx-auto">
          <SplitText
            text="Where Movie Lovers Publish, Not Just Scroll"
            className="text-[36px] md:text-[52px] font-extrabold leading-[1.2] tracking-[-0.8px] mb-[24px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
            delay={40}
            duration={0.7}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            tag="h1"
          />
          <p className="text-[16px] md:text-[19px] font-medium leading-[1.6] text-white/95 mb-[40px] max-w-4xl">
            Write, publish, and discover movie takes from real people who watch movies.<br />
            No gatekeepers, no algorithms deciding what's worth watching — just honest reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[40px]">
            <Link
              to="/login"
              className="text-[20px] font-semibold text-white sliding-underline-link"
            >
              Join as a Member
            </Link>
            <Link
              to="/feed"
              className="text-[20px] font-semibold text-white sliding-underline-link"
            >
              Explore Posts
            </Link>
          </div>
        </main>
      </div>

      {/* Testimonial Section (Second Section) */}
      <section className="bg-white text-black py-20 px-6 md:px-12 flex flex-col items-center">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <span className="text-[#e50914] font-bold text-[14px] uppercase tracking-wider block mb-3">
            Loved by Our Community
          </span>
          <h2 className="text-[32px] md:text-[42px] font-extrabold text-black tracking-tight mb-4">
            What Our Members Are Saying
          </h2>
          <p className="text-[16px] md:text-[18px] text-black font-normal leading-[1.6]">
            Real feedback from real movie lovers who write, read, and discover on our dashboard.<br />
            Here's what they have to say about their experience.
          </p>
        </div>

        {/* 3-Column layout bordered with black dividers */}
        <div className="w-full border-t border-b border-black py-10 my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black max-w-7xl mx-auto">
            {/* Testimonial Column 1 */}
            <div className="p-8 md:px-12 flex flex-col gap-6 items-start">
              <span className="text-[72px] text-[#e50914] font-serif leading-none h-[40px] select-none">“</span>
              <p className="text-[16px] text-black leading-[1.6] font-normal text-left">
                Finally a place where my reviews actually get seen. The community here genuinely cares about good film discussions.
              </p>
              <span className="text-[16px] font-semibold text-black mt-auto text-left">
                Ananya R
              </span>
            </div>

            {/* Testimonial Column 2 */}
            <div className="p-8 md:px-12 flex flex-col gap-6 items-start">
              <span className="text-[72px] text-[#e50914] font-serif leading-none h-[40px] select-none">“</span>
              <p className="text-[16px] text-black leading-[1.6] font-normal text-left">
                Finally a place where my reviews actually get seen. The community here genuinely cares about good film discussions.
              </p>
              <span className="text-[16px] font-semibold text-black mt-auto text-left">
                Ananya R
              </span>
            </div>

            {/* Testimonial Column 3 */}
            <div className="p-8 md:px-12 flex flex-col gap-6 items-start">
              <span className="text-[72px] text-[#e50914] font-serif leading-none h-[40px] select-none">“</span>
              <p className="text-[16px] text-black leading-[1.6] font-normal text-left">
                Finally a place where my reviews actually get seen. The community here genuinely cares about good film discussions.
              </p>
              <span className="text-[16px] font-semibold text-black mt-auto text-left">
                Ananya R
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Text */}
        <div className="text-center mt-10">
          <p className="text-[18px] md:text-[20px] font-bold text-black tracking-tight">
            Join 340+ members already sharing their movie takes.
          </p>
        </div>
      </section>

      {/* Three Steps Section (Third Section) */}
      <section className="bg-landing text-white py-20 px-6 md:px-12 flex flex-col items-center">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-[32px] md:text-[42px] font-bold text-white tracking-tight mb-4 leading-tight">
            From Sign Up to Published in<br className="hidden md:inline" /> three Steps
          </h2>
          <p className="text-[16px] md:text-[18px] text-white/90 font-normal leading-[1.6] max-w-2xl mx-auto">
            No confusing process, no long waits. Just a simple path from creating an account to seeing your work live on the dashboard.
          </p>
        </div>

        {/* Steps container */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-2 lg:gap-4 max-w-6xl w-full mx-auto mb-16">
          {/* Step 1 */}
          <div className="flex flex-col items-center max-w-[240px] text-center">
            <div className="relative mb-6">
              <span className="absolute -top-3 -left-5 text-[22px] font-bold text-white select-none">1</span>
              <FilmReelSVG />
            </div>
            <h3 className="text-[20px] font-bold text-white mb-2">Create Your Account</h3>
            <p className="text-[15px] text-white/80 leading-relaxed">
              Sign up with email or Google in seconds.
            </p>
          </div>

          {/* Wavy Film Strip Connector 1 (dips down) */}
          <img
            src="/film_reel_icon.png"
            alt="Film Strip Connector 1"
            className="w-[80px] lg:w-[110px] h-[45px] object-cover object-center hidden md:block self-start mt-[35px] mx-1 lg:mx-2 select-none -rotate-[2deg]"
          />

          {/* Step 2 */}
          <div className="flex flex-col items-center max-w-[240px] text-center">
            <div className="relative mb-6">
              <span className="absolute -top-3 -left-5 text-[22px] font-bold text-white select-none">2</span>
              <FilmReelSVG />
            </div>
            <h3 className="text-[20px] font-bold text-white mb-2">Write Your Review</h3>
            <p className="text-[15px] text-white/80 leading-relaxed">
              Add the movie, your take, a rating, & tags.
            </p>
          </div>

          {/* Wavy Film Strip Connector 2 (arches up - vertically flipped) */}
          <img
            src="/film_reel_icon.png"
            alt="Film Strip Connector 2"
            className="w-[80px] lg:w-[110px] h-[45px] object-cover object-center hidden md:block self-start mt-[35px] mx-1 lg:mx-2 select-none scale-y-[-1] rotate-[6deg]"
          />

          {/* Step 3 */}
          <div className="flex flex-col items-center max-w-[240px] text-center">
            <div className="relative mb-6">
              <span className="absolute -top-3 -left-5 text-[22px] font-bold text-white select-none">3</span>
              <FilmReelSVG />
            </div>
            <h3 className="text-[20px] font-bold text-white mb-2">Submit and Go Live</h3>
            <p className="text-[15px] text-white/80 leading-relaxed">
              Pass a quick review, then it's live for everyone.
            </p>
          </div>
        </div>

        {/* Bottom CTA Link with animated hover underline */}
        <div className="text-center">
          <p className="text-[18px] md:text-[20px] font-medium text-white/90">
            Ready to see your name on the dashboard?{' '}
            <Link
              to="/login"
              className="font-bold text-white no-underline relative transition-all duration-300 pb-[2px] after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 hover:after:origin-bottom-left inline-block"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>

      {/* Trending Now Section (Fourth Section) */}
      <section className="bg-white text-black py-20 px-6 md:px-12 flex flex-col items-center">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-[#e50914] font-bold text-[14px] uppercase tracking-wider block mb-3">
            Trending Now
          </span>
          <h2 className="text-[32px] md:text-[42px] font-extrabold text-black tracking-tight mb-4 leading-tight">
            What Everyone's Reading This Week
          </h2>
          <p className="text-[16px] md:text-[18px] text-black font-normal leading-[1.6] max-w-2xl mx-auto">
            The highest-rated and most-discussed posts on the dashboard right now.
          </p>
        </div>

        {/* 2x2 Grid of 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full mx-auto mb-16">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-[#800c0c] to-[#140202] rounded-[24px] p-8 flex flex-col gap-4 text-white shadow-lg relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] group">
            {/* Top Heading/Title */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[13px] text-white/60 font-semibold tracking-wider uppercase">
                By [Author Name] - [Genre] - ★ [Rating]
              </span>
              <h3 className="text-[22px] md:text-[24px] font-extrabold text-white tracking-tight leading-tight flex items-center justify-between">
                <span>Mainstream Cinema v/s Independent Films</span>
                <span className="arrow-animate ml-2 text-white/50">→</span>
              </h3>
            </div>

            {/* Vertical fanned-out image container (Centered with rule-of-thirds zoom) */}
            <div className="relative h-[155px] w-full flex items-center justify-center my-6 overflow-visible select-none">
              {/* Left Image (Zoomed on Left Third) */}
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-left z-10">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Mainstream Cinema v/s Independent Films Left"
                  className="w-full h-full object-cover scale-[1.7] origin-left"
                />
              </div>
              {/* Center Image (Original / Uncropped) */}
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-center z-20">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Mainstream Cinema v/s Independent Films Center"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Right Image (Zoomed on Right Third) */}
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-right z-30">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Mainstream Cinema v/s Independent Films Right"
                  className="w-full h-full object-cover scale-[1.7] origin-right"
                />
              </div>
            </div>

            {/* Description (Bottom) */}
            <p className="text-[15px] text-white/80 leading-relaxed font-normal text-left">
              See what the community is talking about.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-[#800c0c] to-[#140202] rounded-[24px] p-8 flex flex-col gap-4 text-white shadow-lg relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] group">
            {/* Top Heading/Title */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[13px] text-white/60 font-semibold tracking-wider uppercase">
                By [Author Name] - [Genre] - ★ [Rating]
              </span>
              <h3 className="text-[22px] md:text-[24px] font-extrabold text-white tracking-tight leading-tight flex items-center justify-between">
                <span>Why Christopher Nolan's Cinematography Hooks Us</span>
                <span className="arrow-animate ml-2 text-white/50">→</span>
              </h3>
            </div>

            {/* Vertical fanned-out image container (Centered with rule-of-thirds zoom) */}
            <div className="relative h-[155px] w-full flex items-center justify-center my-6 overflow-visible select-none">
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-left z-10">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Nolan Cinematography Left"
                  className="w-full h-full object-cover scale-[1.7] origin-left"
                />
              </div>
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-center z-20">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Nolan Cinematography Center"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-right z-30">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Nolan Cinematography Right"
                  className="w-full h-full object-cover scale-[1.7] origin-right"
                />
              </div>
            </div>

            {/* Description (Bottom) */}
            <p className="text-[15px] text-white/80 leading-relaxed font-normal text-left">
              An in-depth look at his visual scale, practical effects, and narrative framing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-[#800c0c] to-[#140202] rounded-[24px] p-8 flex flex-col gap-4 text-white shadow-lg relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] group">
            {/* Top Heading/Title */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[13px] text-white/60 font-semibold tracking-wider uppercase">
                By [Author Name] - [Genre] - ★ [Rating]
              </span>
              <h3 className="text-[22px] md:text-[24px] font-extrabold text-white tracking-tight leading-tight flex items-center justify-between">
                <span>The Rise of Sci-Fi in Modern Indian Cinema</span>
                <span className="arrow-animate ml-2 text-white/50">→</span>
              </h3>
            </div>

            {/* Vertical fanned-out image container (Centered with rule-of-thirds zoom) */}
            <div className="relative h-[155px] w-full flex items-center justify-center my-6 overflow-visible select-none">
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-left z-10">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Sci-Fi Indian Cinema Left"
                  className="w-full h-full object-cover scale-[1.7] origin-left"
                />
              </div>
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-center z-20">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Sci-Fi Indian Cinema Center"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-right z-30">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Sci-Fi Indian Cinema Right"
                  className="w-full h-full object-cover scale-[1.7] origin-right"
                />
              </div>
            </div>

            {/* Description (Bottom) */}
            <p className="text-[15px] text-white/80 leading-relaxed font-normal text-left">
              How new-age directors are scaling up storytelling with premium VFX.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-[#800c0c] to-[#140202] rounded-[24px] p-8 flex flex-col gap-4 text-white shadow-lg relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] group">
            {/* Top Heading/Title */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[13px] text-white/60 font-semibold tracking-wider uppercase">
                By [Author Name] - [Genre] - ★ [Rating]
              </span>
              <h3 className="text-[22px] md:text-[24px] font-extrabold text-white tracking-tight leading-tight flex items-center justify-between">
                <span>Top 10 Hidden Gem Thrillers You Missed in 2025</span>
                <span className="arrow-animate ml-2 text-white/50">→</span>
              </h3>
            </div>

            {/* Vertical fanned-out image container (Centered with rule-of-thirds zoom) */}
            <div className="relative h-[155px] w-full flex items-center justify-center my-6 overflow-visible select-none">
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-left z-10">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Hidden Gem Thrillers Left"
                  className="w-full h-full object-cover scale-[1.7] origin-left"
                />
              </div>
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-center z-20">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Hidden Gem Thrillers Center"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[90px] h-[130px] overflow-hidden rounded-[16px] border-2 border-white shadow-lg absolute fanned-right z-30">
                <img
                  src="/G9_Blog_Banner.png"
                  alt="Hidden Gem Thrillers Right"
                  className="w-full h-full object-cover scale-[1.7] origin-right"
                />
              </div>
            </div>

            {/* Description (Bottom) */}
            <p className="text-[15px] text-white/80 leading-relaxed font-normal text-left">
              Our curated list of under-the-radar psychological thrillers.
            </p>
          </div>
        </div>

        {/* CTA Button in Center */}
        <div className="flex justify-center mt-4">
          <Link
            to="/feed"
            className="px-8 py-3 rounded-full font-bold text-white bg-black hover:bg-[#e50914] transition-all duration-300 transform hover:-translate-y-0.5 shadow-md text-center"
          >
            <StaggeredTextRoll text="View All Posts" />
          </Link>
        </div>
      </section>

      {/* Dynamic CTA Section (Fifth Section) */}
      <section className="bg-landing text-white py-24 px-0 flex flex-col items-center relative overflow-hidden">
        {/* Content Container */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center px-6 md:px-12 w-full">
          {/* Heading */}
          <h2 className="text-[36px] md:text-[56px] font-extrabold tracking-tight mb-4 leading-tight">
            Your Take on Movies Deserves an Audience
          </h2>

          {/* Subheading */}
          <p className="text-[18px] md:text-[21px] text-white/80 font-normal max-w-2xl mx-auto mb-12">
            Join the dashboard where every member is a critic.
          </p>
        </div>

        {/* Horizontal Curved Image Arc (3D Fish-eye curved perspective wrap - Full screen breakout scroll carousel) */}
        <div className="w-full overflow-hidden py-10 perspective-container relative z-10">
          <div
            className="flex items-center justify-start gap-1.5 md:gap-3.5 select-none"
            style={{
              transform: `translate3d(-${scrollOffset}px, 0px, 0px)`,
              width: 'max-content',
              willChange: 'transform'
            }}
          >
            {/* Set 1 */}
            <div className="hidden lg:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-1 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 1" className="w-full h-full object-cover scale-[1.6] origin-left" />
            </div>
            <div className="hidden md:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-2 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 2" className="w-full h-full object-cover scale-[1.2]" />
            </div>
            <div className="w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-3 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 3" className="w-full h-full object-cover scale-[1.5] origin-center" />
            </div>
            <div className="w-[160px] md:w-[230px] h-[230px] md:h-[320px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-4 z-20 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 4" className="w-full h-full object-cover" />
            </div>
            <div className="w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-5 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 5" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-6 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 6" className="w-full h-full object-cover scale-[1.6] origin-right" />
            </div>
            <div className="hidden lg:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-7 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 7" className="w-full h-full object-cover" />
            </div>

            {/* Set 2 */}
            <div className="hidden lg:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-1 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 1" className="w-full h-full object-cover scale-[1.6] origin-left" />
            </div>
            <div className="hidden md:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-2 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 2" className="w-full h-full object-cover scale-[1.2]" />
            </div>
            <div className="w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-3 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 3" className="w-full h-full object-cover scale-[1.5] origin-center" />
            </div>
            <div className="w-[160px] md:w-[230px] h-[230px] md:h-[320px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-4 z-20 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 4" className="w-full h-full object-cover" />
            </div>
            <div className="w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-5 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 5" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-6 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 6" className="w-full h-full object-cover scale-[1.6] origin-right" />
            </div>
            <div className="hidden lg:block w-[150px] md:w-[220px] h-[220px] md:h-[310px] overflow-hidden rounded-[20px] shadow-2xl fisheye-card-7 flex-shrink-0">
              <img src="/G9_Blog_Banner.png" alt="Preview 7" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* CTA Links Container */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-[20px] sm:gap-[40px] mt-8 relative px-6 md:px-12 w-full">
          {/* Primary Link */}
          <Link
            to="/login?mode=signup"
            className="text-[20px] font-semibold text-white sliding-underline-link"
          >
            Start Writing
          </Link>

          {/* Secondary Link */}
          <Link
            to="/feed"
            className="text-[20px] font-semibold text-white sliding-underline-link"
          >
            Explore Reviews
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white text-black/60 py-16 px-6 md:px-12 border-t border-black/10 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4 items-start md:col-span-2">
            <img
              src="/Prabhava_logo.png"
              alt="Prabhava Logo"
              className="h-[50px] w-[130px] object-cover object-center invert"
            />
            <p className="text-[14px] leading-relaxed max-w-sm text-left text-black/70">
              Prabhava is a premium dashboard for cinema enthusiasts, independent critics, and casual moviegoers to write, share, and discuss cinema takes.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-black font-bold text-[15px] uppercase tracking-wider mb-2">Explore</h4>
            <Link to="/" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Home</Link>
            <Link to="/feed" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Reviews Feed</Link>
            <Link to="/login" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Start Writing</Link>
          </div>

          {/* Column 3: Social & Community */}
          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-black font-bold text-[15px] uppercase tracking-wider mb-2">Community</h4>
            <a href="https://letterboxd.com" target="_blank" rel="noreferrer" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Letterboxd</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Twitter / X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Instagram</a>
          </div>
        </div>

        {/* Bottom Divider and Copyright */}
        <div className="max-w-7xl mx-auto border-t border-black/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[13px]">
            © 2026 Prabhava. All rights reserved. Created for movie critics.
          </span>
          <div className="flex gap-6 text-[13px]">
            <a href="#" className="hover:text-black transition-colors duration-200 sliding-underline-link">Terms of Use</a>
            <a href="#" className="hover:text-black transition-colors duration-200 sliding-underline-link">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Helper SVG Components
function FilmReelSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-[110px] h-[110px] fill-white select-none">
      <defs>
        <mask id="reel-mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <circle cx="50" cy="50" r="7" fill="black" />
          <circle cx="50" cy="24" r="6" fill="black" />
          <circle cx="50" cy="76" r="6" fill="black" />
          <circle cx="27" cy="37" r="6" fill="black" />
          <circle cx="73" cy="63" r="6" fill="black" />
          <circle cx="27" cy="63" r="6" fill="black" />
          <circle cx="73" cy="37" r="6" fill="black" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="40" mask="url(#reel-mask)" />
    </svg>
  )
}
