import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaShieldAlt, FaQuoteLeft, FaServer, 
  FaLayerGroup, FaFingerprint, FaChevronRight 
} from "react-icons/fa";
import { MdVerified, MdOutlineSecurity, MdDeveloperMode } from "react-icons/md";
import { HiOutlineLightBulb, HiOutlineGlobeAlt } from "react-icons/hi";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased selection:bg-indigo-100">
      
      {/* --- 1️⃣ EDITORIAL HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 items-center gap-12 pt-20">
          <div className="relative z-20 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Est. 2026 — The Future of Realty</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-light tracking-tighter text-slate-900 leading-[0.9]">
              DREAM<span className="font-serif italic text-indigo-600">HAVEN</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-slate-500 max-w-lg leading-relaxed">
              We are redefining the architectural boundaries of digital real estate through <span className="text-indigo-600 font-medium">trust and technology.</span>
            </p>

            <div className="flex gap-6 pt-4">
              <button 
                onClick={() => navigate("/properties")}
                className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
              >
                Explore Listings
                <FaChevronRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-10 bg-indigo-50/50 rounded-full blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80" 
              alt="Luxury Architecture" 
              className="relative z-10 rounded-[60px] shadow-2xl border-[12px] border-white object-cover h-[600px] w-full"
            />
          </div>
        </div>
      </section>

      {/* --- 2️⃣ THE MANIFESTO (TEXT FOCUS) --- */}
      <section className="py-32 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em] mb-12">The Manifesto</h2>
        <p className="text-3xl md:text-5xl font-serif italic text-slate-800 leading-[1.4] mb-16">
          "DreamHaven was born to bridge the gap between traditional heritage and modern security. We believe a home is not a listing—it is a <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">verified sanctuary.</span>"
        </p>
        <div className="flex justify-center">
           <div className="w-px h-24 bg-gradient-to-b from-indigo-600 to-transparent" />
        </div>
      </section>

      {/* --- 3️⃣ CORE PROTOCOLS (CLEAN CARDS) --- */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<MdVerified />} 
              title="Verified Protocol" 
              desc="Every asset undergoes a 12-point authentication check before entering our private catalog." 
            />
            <FeatureCard 
              icon={<HiOutlineLightBulb />} 
              title="Intelligent Search" 
              desc="Proprietary filtering logic that matches lifestyle requirements over simple square footage." 
            />
            <FeatureCard 
              icon={<MdOutlineSecurity />} 
              title="Secure Commerce" 
              desc="Encrypted communication channels ensuring buyer-seller anonymity until verification." 
            />
          </div>
        </div>
      </section>

      {/* --- 4️⃣ THE STACK (MINIMALIST TECH) --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Engineering</h2>
              <h3 className="text-4xl font-light tracking-tight">Built on the <span className="font-bold">MERN</span> Excellence</h3>
            </div>
            <p className="text-slate-500 max-w-xs text-sm font-medium">Our infrastructure is designed for millisecond response times and bank-grade data integrity.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <TechItem icon={<FaLayerGroup />} name="MERN" detail="Full-stack Integration" />
            <TechItem icon={<FaFingerprint />} name="JWT" detail="Atomic Auth Systems" />
            <TechItem icon={<FaServer />} name="Express" detail="Optimized API Layer" />
            <TechItem icon={<MdDeveloperMode />} name="MongoDB" detail="Relational Indexing" />
          </div>
        </div>
      </section>

      {/* --- 5️⃣ GLOBAL FOOTPRINT CTA --- */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[60px] p-12 md:p-24 text-white relative shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-bl-full opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <HiOutlineGlobeAlt className="text-5xl text-indigo-400 mb-8 animate-pulse" />
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 leading-tight">
              Join the <span className="font-serif italic text-indigo-300">Haven</span> Network.
            </h2>
            <p className="text-indigo-200/60 mb-12 text-xs font-black uppercase tracking-[0.4em]">Become part of the most secure ecosystem in realty</p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all active:scale-95">
                Apply as Agent
              </button>
              <button className="bg-slate-800 text-white border border-white/10 px-12 py-5 rounded-2xl font-bold text-sm hover:bg-white/5 transition-all active:scale-95">
                Technical Whitepaper
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-10 rounded-[40px] bg-white border border-slate-100 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4 text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
  </div>
);

const TechItem = ({ icon, name, detail }) => (
  <div className="p-8 rounded-[32px] border border-slate-50 bg-[#FDFDFD] hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all text-center">
    <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600 mb-4">
      {icon}
    </div>
    <h4 className="font-bold text-lg text-slate-900">{name}</h4>
    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{detail}</p>
  </div>
);

export default About;