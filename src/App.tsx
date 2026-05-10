import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Mail, MapPin, ExternalLink, Linkedin, Youtube } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';

const assetUrl = (file: string) => `${import.meta.env.BASE_URL}${encodeURI(file)}`;

function HeroCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
      }}
      className="flex w-full h-full items-center justify-center md:justify-end relative z-20 pr-0 md:pr-12 lg:pr-24"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-20 flex justify-center items-center w-full max-w-[320px] md:max-w-[400px] lg:max-w-[500px]"
      >
        <div className="absolute inset-10 bg-black/50 blur-3xl rounded-full pointer-events-none" style={{ transform: "translateZ(-30px)" }}></div>
        <div className="relative flex justify-center w-full" style={{ transformStyle: "preserve-3d" }}>
          <img 
            src={assetUrl('profile-pic.png')} 
            alt="Hassnain Aly" 
            className="w-full h-auto max-h-[70vh] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] z-10 relative pointer-events-auto" 
            style={{ transform: "translateZ(40px)" }}
            onError={(e) => { e.currentTarget.style.display='none'; }} 
          />
          <div className="absolute bottom-4 sm:bottom-10 left-0 right-0 z-50 pointer-events-none" style={{ transform: "translateZ(120px)" }}>
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-3xl lg:text-5xl font-black tracking-tighter text-white mb-2 drop-shadow-2xl" style={{ textShadow: "0 4px 20px rgba(0,0,0,1), 0 2px 5px rgba(0,0,0,0.8)" }}>HASSNAIN ALY</h3>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#60A5FA] bg-black/80 px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-bold">
                3D/Unreal Engine Artist
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <div className="absolute w-64 h-48 bg-blue-500/20 border border-blue-500/30 rounded-full top-1/2 right-0 -translate-y-1/2 translate-x-12 blur-2xl pointer-events-none -z-10" style={{ transform: "translateZ(-100px)" }}></div>
    </div>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.1], [0, 100]);

  const ProjectCard = ({ project, idx }: { project: any, idx: number }) => {
    const x = useMotionValue(0);
    const yVal = useMotionValue(0);
  
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(yVal, { stiffness: 300, damping: 30 });
  
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      x.set(mouseX / width - 0.5);
      yVal.set(mouseY / height - 0.5);
    };
  
    const handleMouseLeave = () => {
      x.set(0);
      yVal.set(0);
    };
  
    return (
      <div style={{ perspective: 1200 }} className="relative z-10 w-full h-full">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group h-full min-h-[350px] lg:min-h-[400px] bg-zinc-900/60 border border-white/10 rounded-2xl p-10 flex flex-col transition-colors duration-500 relative overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
        >
          {project.image ? (
            <div className="absolute inset-0 z-0">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-100 transition-all duration-700 group-hover:opacity-40 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-white/5 to-white/10 pointer-events-none z-0"></div>
          )}

          <div className="relative z-10 w-full h-full flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div className="mb-6" style={{ transform: "translateZ(40px)" }}>
              <h3 className="text-3xl font-black tracking-tight text-white/90 shadow-sm">{project.title}</h3>
            </motion.div>
            <motion.div className="flex flex-col justify-end" style={{ transform: "translateZ(30px)" }}>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-[95%] mb-6">
                {project.desc}
              </p>
              {project.actions && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {project.actions.map((action: any, aIdx: number) => (
                     <a key={aIdx} href={action.url} target="_blank" rel="noreferrer" className="pointer-events-auto flex items-center justify-center gap-2 relative z-20 px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 shadow-xl hover:-translate-y-1 group/btn">
                       {action.label} 
                       <ExternalLink size={14} className="opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                     </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F5F5F5] font-sans flex flex-col overflow-hidden selection:bg-white/20">
      
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[160px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-900 rounded-full blur-[180px]"></div>
      </div>

      <ThreeBackground />
      
      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-24 px-6 md:px-12 lg:px-24 flex justify-end items-center mix-blend-difference pointer-events-none">
        <div className="flex gap-12 text-sm font-medium tracking-widest text-white/50 uppercase pointer-events-auto">
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col md:flex-row items-center px-6 md:px-12 lg:px-24 pt-32 md:pt-0 pb-20 md:pb-0">
          <div className="w-full md:w-1/2 pr-0 md:pr-8 z-20">
            <motion.div 
              style={{ opacity, y }}
            >
              <div className="flex items-center gap-4 mb-10 px-6 py-4 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md self-start inline-flex shadow-xl">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 shrink-0">
                  <div className="absolute w-full h-full rounded-full border border-green-500/40 animate-[ping_2s_ease-out_infinite]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/90">Current Status</span>
                  <span className="text-xs text-white/60 font-mono tracking-wider max-w-[280px] md:max-w-none">Available for Freelance, Full Time, Part Time & Contract</span>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mb-10"
              >
                <h1 
                  className="text-6xl md:text-[90px] lg:text-[110px] font-black leading-[0.85] tracking-tighter"
                  style={{
                    color: "#ffffff",
                    textShadow: `
                      1px 1px 0 #888,
                      2px 2px 0 #777,
                      3px 3px 0 #666,
                      4px 4px 0 #555,
                      5px 5px 0 #444,
                      6px 6px 0 #333,
                      7px 7px 0 #222,
                      8px 8px 10px rgba(0,0,0,0.8),
                      0 20px 30px rgba(0,0,0,0.6)
                    `
                  }}
                >
                  HASSNAIN<br />ALY
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-lg text-white/60 text-lg leading-relaxed mb-12"
              >
                I’ve been creating 3D and VR experiences for over 4 years now — and I still enjoy bringing virtual worlds to life every single day. Whether it’s building immersive architectural walkthroughs, designing optimized VR environments, or creating interactive real-time experiences in Unreal Engine, I love turning ideas into visually engaging experiences people can explore and connect with.
              </motion.p>
            </motion.div>
            <div className="flex items-center gap-6 mt-2 relative z-20">
              <a href="#contact" className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold uppercase text-xs tracking-[0.2em] overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">Let's Talk <Mail size={16}/></span>
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 h-[450px] md:h-[600px] mt-16 md:mt-0 relative z-10 flex items-center justify-center">
            <HeroCard />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-12 left-12 md:left-24 italic font-serif text-[10px] text-white/40 uppercase tracking-[0.2em]"
          >
            Scroll to explore
          </motion.div>
        </section>

        {/* About Section */}
        <section className="py-20 md:py-24 px-6 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            <div className="md:w-1/3">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-4">Expertise</h2>
              <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">Skillset</h3>
            </div>
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-6 text-white/90 border-b border-white/10 pb-4 uppercase">Core Expertise</h3>
                  <div className="flex flex-col gap-3">
                    {['VR Optimization', 'Environment Design', 'Lighting & Rendering', 'Real-Time Performance'].map((skill, i) => (
                      <div key={i} className="px-6 py-4 rounded-xl border border-white/10 bg-zinc-900/40 backdrop-blur-sm font-bold tracking-wide text-white/80 text-lg hover:border-white/30 transition-colors shadow-lg">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-6 text-white/90 border-b border-white/10 pb-4 uppercase">Software</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: 'Unreal Engine 5', file: 'Unreal Engine 5.png' },
                      { name: 'Blender', file: 'Blender logo.png' },
                      { name: '3D Studio Max', file: '3DS Max logo.png' },
                      { name: 'Substance Painter', file: 'Substance painter logo.png' },
                      { name: 'Photoshop', file: 'Photoshoppng.png' },
                      { name: 'Topaz Gigapixel AI', file: 'Topaz Gigapixel AI logopng' },
                      { name: 'Antigravity', file: 'Antigravitypng.png' },
                      { name: 'Codex', file: 'Codex logo.png' }
                    ].map((sw, i) => (
                      <div key={i} className="flex items-center gap-4 px-6 py-3.5 rounded-xl border border-white/10 bg-zinc-900/60 backdrop-blur-md hover:bg-zinc-800 hover:border-white/30 transition-all duration-300 shadow-lg group">
                        <div className="w-7 h-7 flex items-center justify-center shrink-0">
                          <img src={assetUrl(sw.file)} alt={sw.name} className="max-w-full max-h-full object-contain filter group-hover:brightness-125 transition-all" onError={(e) => { e.currentTarget.style.display='none' }} />
                        </div>
                        <span className="font-bold tracking-wide text-white/90 text-base">{sw.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 md:py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 sticky top-32 self-start">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-purple-400 inline-block"></span> Career Journey
              </h2>
              <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6 shadow-sm">Experience</h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">From rough concepts to optimized, immersive VR walkthroughs. Here is where I've spent my time crafting digital worlds.</p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                
                {/* Exp 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500 bg-zinc-900 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-500 group-hover:scale-110">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md transition-all duration-500 hover:bg-zinc-800 hover:border-white/30 hover:shadow-2xl hover:-translate-y-1 group-hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)]">
                    <div className="flex flex-col gap-2 mb-6">
                      <span className="text-xs font-mono text-blue-400 tracking-widest uppercase font-semibold">Feb 2021 - Present</span>
                      <h3 className="text-2xl font-bold tracking-tight text-white/90">3D Artist <br/><span className="text-white/40 font-medium text-lg">@ Mixeal</span></h3>
                    </div>
                    <ul className="text-white/60 space-y-4 text-sm leading-relaxed">
                      <li className="flex gap-3"><span className="text-blue-500">▹</span> I develop immersive VR experiences and photorealistic walkthrough scenes, turning rough concepts into polished production-friendly 3D visuals.</li>
                      <li className="flex gap-3"><span className="text-blue-500">▹</span> I model, texture, and prepare presentation-ready assets with clean topology.</li>
                      <li className="flex gap-3"><span className="text-blue-500">▹</span> I support scene dressing, optimize real-time performance of complex Unreal Engine environments, and ensure asset consistency for smoother gameplay.</li>
                    </ul>
                  </div>
                </div>

                {/* Exp 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-zinc-900 text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-500 group-hover:scale-110 group-hover:border-purple-500 group-hover:text-purple-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <div className="w-3 h-3 bg-current rounded-full transition-colors duration-500"></div>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md transition-all duration-500 hover:bg-zinc-800 hover:border-white/30 hover:shadow-2xl hover:-translate-y-1 group-hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.2)]">
                    <div className="flex flex-col gap-2 mb-6">
                      <span className="text-xs font-mono text-purple-400 tracking-widest uppercase font-semibold">Sept 2024 - Oct 2025</span>
                      <h3 className="text-2xl font-bold tracking-tight text-white/90">3D Artist & Rendering Specialist <br/><span className="text-white/40 font-medium text-lg">@ Aykah</span></h3>
                    </div>
                    <ul className="text-white/60 space-y-4 text-sm leading-relaxed">
                      <li className="flex gap-3"><span className="text-purple-500 transition-colors duration-500">▹</span> I produced photorealistic renders for furniture, interiors, and product presentations.</li>
                      <li className="flex gap-3"><span className="text-purple-500 transition-colors duration-500">▹</span> I enhanced product visuals and architectural scenes with lighting, composition, and material polish.</li>
                      <li className="flex gap-3"><span className="text-purple-500 transition-colors duration-500">▹</span> I balanced visual fidelity with real-time performance for VR walkthroughs.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 md:py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 relative">
          <div className="flex flex-col mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-4">Featured Work</h2>
            <h3 className="text-5xl md:text-8xl font-black tracking-tighter w-full border-b border-white/10 pb-8 uppercase text-white/90">Key Projects</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            
            {[
              {
                title: "The Final Overs VR Cricket Game (Meta Store)",
                desc: "Built atmospheric cricket environments with scene dressing and lighting that kept gameplay readable in VR. Optimized asset quality and performance so the world stayed clear and responsive in headset.",
                image: assetUrl("TFO thumbnail.png"),
                actions: [
                  { label: "Trailer", url: "https://www.youtube.com/watch?v=9yupH3embGU" },
                  { label: "Game Listing", url: "https://www.meta.com/experiences/final-overs-vr-cricket/3753844808017398/?utm_source=www.youtube.com&utm_medium=oculusredirect" }
                ]
              },
              {
                title: "Kynetik VR Shooter Game (Meta Store)",
                desc: "Created stylized sci-fi visuals that supported fast-paced VR action and strong player readability. Focused on clean asset presentation, contrast, and Quest-friendly real-time performance.",
                image: assetUrl("KYNETIK thumbnail.png"),
                actions: [
                  { label: "Trailer", url: "https://www.youtube.com/watch?v=OfFT4EXDvqo" },
                  { label: "Game Listing", url: "https://www.meta.com/en-gb/experiences/kynetik/32269544462694283/" }
                ]
              },
              {
                title: "GraspXR",
                desc: "Modeled and textured highly detailed medical props and realistic hospital environments for clinical training simulations. Ensured strict visual accuracy while maintaining optimized topology for smooth VR performance.",
                image: assetUrl("GraspXR thumbnail.png"),
                actions: [
                  { label: "Trailer", url: "https://www.youtube.com/watch?v=kMkIfrMHkLQ" },
                  { label: "Website", url: "https://www.graspxr.app/" }
                ]
              },
              {
                title: "Virtual Villas – Meta Quest VR",
                desc: "Modeled and dressed villa interiors and exteriors for smooth VR walkthrough presentation. Delivered optimized, presentation-ready assets and lighting for a polished real-time experience.",
                image: assetUrl("VR Villas thumbnail.png")
              }
            ].map((project, idx) => (
              <ProjectCard key={idx} project={project} idx={idx} />
            ))}

          </div>
          
          <div className="mt-20 flex justify-center w-full">
             <a 
               href="https://www.artstation.com/hassnainaly30" 
               target="_blank" 
               rel="noreferrer"
               className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-blue-600 border border-blue-500 text-white font-bold uppercase text-sm tracking-widest overflow-hidden transition-all duration-300 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_50px_rgba(37,99,235,0.4)] rounded-full"
             >
               <span className="relative z-10 flex items-center gap-3">
                 Explore Full Portfolio on ArtStation <ExternalLink size={18} />
               </span>
             </a>
          </div>
        </section>

        {/* Content Creation / YouTube Section */}
        <section className="py-20 md:py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none"></div>
          <div className="flex flex-col mb-12 relative z-10">
            <h2 className="text-sm md:text-base uppercase tracking-[0.2em] text-red-500 font-bold mb-4">Content Creation</h2>
            <h3 className="text-5xl md:text-8xl font-black tracking-tighter w-full border-b border-white/10 pb-8 uppercase text-white/90">Tutorials & Tips</h3>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2rem] relative overflow-hidden group hover:border-red-500/30 transition-colors duration-500 shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-all duration-700 text-red-500 transform group-hover:scale-110 group-hover:-rotate-6 group-hover:translate-x-2 group-hover:-translate-y-2">
              <Youtube size={120} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] shrink-0">
                  <img src={assetUrl("Channel picture.jpg")} alt="Blendreall Channel" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-2xl md:text-4xl font-bold text-white tracking-tight">@Blendreall</h4>
              </div>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-10 font-light">
                I create <span className="text-white font-medium">short and quick informative tips videos</span> regarding Unreal Engine and Blender.
              </p>
              <a 
                href="https://www.youtube.com/@Blendreall" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600/90 text-white font-bold rounded-full transition-all duration-300 uppercase tracking-widest text-xs hover:bg-red-500 hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] border border-red-400"
              >
                Visit YouTube Channel <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer / Contact */}
        <footer id="contact" className="relative z-10 py-20 px-6 md:px-12 lg:px-24 border-t border-white/5 bg-black/50">
          <div className="flex flex-col items-center flex-wrap">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-12">Let's connect</h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 font-bold tracking-widest text-xs md:text-sm uppercase items-center">
               <a href="mailto:hassnainaly30@gmail.com" className="hover:text-blue-400 transition-colors flex items-center gap-3"><Mail size={20} className="text-blue-500"/> hassnainaly30@gmail.com</a>
               <a href="https://linkedin.com/in/hassnainaly" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-3"><Linkedin size={20} className="text-purple-500"/> LinkedIn</a>
               <span className="text-white/60 flex items-center gap-3"><MapPin size={20} className="text-zinc-500"/> Hyderabad, Pakistan</span>
            </div>
            <div className="mt-24 text-[10px] text-white/30 uppercase tracking-[0.2em] flex flex-col items-center gap-2">
                 <span>© {new Date().getFullYear()} Hassnain Aly.</span>
                 <span>All Rights Reserved.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
