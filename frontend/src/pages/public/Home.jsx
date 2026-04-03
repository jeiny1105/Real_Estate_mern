import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaUserTie,
  FaArrowRight,
  FaSearch,
  FaMapMarkerAlt,
  FaRegCheckCircle,
  FaGlobeAmericas,
  FaQuoteLeft
} from "react-icons/fa";
import { MdVerified, MdOutlineAnalytics, MdKeyboardArrowRight, MdBusinessCenter } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const backgrounds = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Animated Background Layers */}
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={bg} alt="Modern Architecture" className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-brightness-75" />
          </div>
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <HiOutlineSparkles className="text-indigo-300" />
              <span className="text-xs font-bold tracking-widest text-white uppercase">
                Redefining Modern Living
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
              The Smarter Way to <br /> 
              <span className="text-indigo-300">Own & Invest.</span>
            </h1>

            <p className="text-xl text-slate-100 mb-10 max-w-xl leading-relaxed opacity-90">
              A professional-grade ecosystem connecting discerning buyers with 
              verified agents and premium listings worldwide.
            </p>

            {/* INTEGRATED SEARCH CONSOLE */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 border border-slate-200">
              <div className="flex-[2] flex items-center px-4 py-3 group">
                <FaMapMarkerAlt className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter City, Neighborhood, or ZIP..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent outline-none px-3 text-slate-700 font-medium"
                />
              </div>

              <div className="flex-1 border-l border-slate-100 px-4 py-3">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-600 font-semibold cursor-pointer"
                >
                  <option value="">All Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <FaSearch className="text-sm" /> Search Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORPORATE SOCIAL PROOF --- */}
      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-50 contrast-125 grayscale">
            <h4 className="text-xl font-black text-slate-800 tracking-tighter">FORBES</h4>
            <h4 className="text-xl font-black text-slate-800 tracking-tighter italic">TechCrunch</h4>
            <h4 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Zillow</h4>
            <h4 className="text-xl font-black text-slate-800 tracking-tighter">REALTOR</h4>
            <h4 className="text-xl font-black text-slate-800 tracking-tighter">Bloomberg</h4>
          </div>
        </div>
      </div>

      {/* --- VALUE PROPOSITION / STATS --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <StatItem number="12,000+" label="Global Listings" />
            <StatItem number="3,500+" label="Successful Closings" />
            <StatItem number="850+" label="Licensed Partners" />
            <StatItem number="99.2%" label="Customer Satisfaction" />
          </div>
        </div>
      </section>

      {/* --- STRATEGIC ROLES --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-indigo-600 font-bold tracking-[.2em] text-xs uppercase">Tailored Solutions</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-6">A Platform Built for Every Stakeholder</h2>
            <p className="text-slate-500 text-lg">Whether you're finding a home or managing a portfolio, we provide the tools to scale your real estate goals.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <RoleSection
              icon={<FaHome />}
              title="Home Buyers"
              desc="Browse verified properties with comprehensive data, virtual tours, and direct agent communication."
              btnText="Start Your Search"
              onClick={() => navigate("/properties")}
            />
            <RoleSection
              icon={<MdBusinessCenter />}
              title="Property Sellers"
              desc="List your property to a global audience with data-driven pricing and lead management tools."
              btnText="List a Property"
              onClick={() => navigate("/register?role=Seller")}
            />
            <RoleSection
              icon={<FaUserTie />}
              title="Licensed Agents"
              desc="Expand your reach, manage your client pipeline, and secure high-intent leads efficiently."
              btnText="Join the Network"
              onClick={() => navigate("/register?role=Agent")}
            />
          </div>
        </div>
      </section>

      {/* --- TRUST & SECURITY CTA --- */}
      <section className="py-32 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 skew-x-[-20deg] translate-x-20" />
        <div className="container mx-auto px-6 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Experience the New Standard in Real Estate</h2>
            <p className="text-slate-400 text-lg mb-8">Join thousands of users who have streamlined their property journey through our secure, transparent, and innovative platform.</p>
            <div className="flex flex-wrap gap-4">
               <button onClick={() => navigate("/register")} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl">Create Professional Account</button>
               <button className="border border-slate-700 text-white hover:bg-white/5 px-8 py-4 rounded-xl font-bold transition-all">Schedule a Demo</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <FaRegCheckCircle className="text-indigo-400 text-2xl mb-4" />
                <h4 className="text-white font-bold mb-1">Verified</h4>
                <p className="text-slate-500 text-sm">Every listing is manually vetted.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                <FaGlobeAmericas className="text-indigo-400 text-2xl mb-4" />
                <h4 className="text-white font-bold mb-1">Global</h4>
                <p className="text-slate-500 text-sm">Access to prime international markets.</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER-LITE --- */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-medium">© 2026 DreamHaven Real Estate Solutions. All rights reserved.</p>
          <div className="flex gap-8 text-slate-400 text-sm font-semibold">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

/* --- SHARED STYLED COMPONENTS --- */

const StatItem = ({ number, label }) => (
  <div className="text-center group">
    <div className="text-4xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">{number}</div>
    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">{label}</div>
  </div>
);

const RoleSection = ({ icon, title, desc, btnText, onClick }) => (
  <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl text-indigo-600 mb-8">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed mb-8">{desc}</p>
    <button 
      onClick={onClick}
      className="flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
    >
      {btnText} <MdKeyboardArrowRight className="text-xl" />
    </button>
  </div>
);

export default Home;