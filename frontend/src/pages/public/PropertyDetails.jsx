import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../app/apiClient";
import { useAuth } from "../../context/AuthContext";

import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaCar,
  FaTree,
  FaBuilding,
  FaRegCalendarAlt,
  FaRegClock
} from "react-icons/fa";
import { HiOutlineSparkles, HiOutlineMail } from "react-icons/hi";
import { MdVerified } from "react-icons/md";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [sending, setSending] = useState(false);
  const [inquiry, setInquiry] = useState(null);
  const [checkingInquiry, setCheckingInquiry] = useState(true);

  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    message: ""
  });

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data.data);
    } catch (err) {
      console.error("Property fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiry = async () => {
    if (!user) {
      setCheckingInquiry(false);
      return;
    }
    try {
      const res = await api.get(`/inquiries/properties/${id}/my`);
      setInquiry(res.data.data);
    } catch {
      setInquiry(null);
    } finally {
      setCheckingInquiry(false);
    }
  };

  useEffect(() => {
    fetchProperty();
    if (user) fetchInquiry();
  }, [id, user]);

  const images = property?.images?.length > 0
      ? property.images.map(img => `http://localhost:3000/uploads/${img}`)
      : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const nextImage = () => setCurrentImage(prev => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendInquiry = async () => {
    try {
      setSending(true);
      const payload = user 
        ? { buyerName: user.name, buyerEmail: user.email, buyerPhone: user.phone || "", message: form.message }
        : form;

      await api.post(`/inquiries/properties/${id}/inquiry`, payload);
      await fetchInquiry();
      alert("Inquiry sent successfully");
      setShowInquiry(false);
      setForm({ buyerName: "", buyerEmail: "", buyerPhone: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to send inquiry");
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 font-medium">
      PROPERTY NOT FOUND
    </div>
  );

  const isResidential = ["Apartment", "Villa", "Cottage", "House"].includes(property.propertyType);
  const isPlot = property.propertyType === "Plot";
  const isCommercial = property.propertyType === "Commercial";

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased pb-24">
      
      {/* --- TOP NAV --- */}
      <div className="max-w-7xl mx-auto px-6 pt-32 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>
      </div>

      {/* --- GALLERY SECTION --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative group rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border border-white">
          <img
            src={images[currentImage]}
            className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Property"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-5 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
            <FaChevronLeft />
          </button>
          <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-5 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
            <FaChevronRight />
          </button>

          {/* Image Badge */}
          <div className="absolute bottom-8 left-8 bg-white/20 backdrop-blur-xl border border-white/30 px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
            {currentImage + 1} / {images.length} Captured Frames
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 mt-6 overflow-x-auto pb-4 no-scrollbar">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative flex-shrink-0 h-24 w-40 rounded-[20px] overflow-hidden cursor-pointer border-2 transition-all ${
                currentImage === index ? "border-blue-600 scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
            </div>
          ))}
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 mt-16">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-6">
            <MdVerified className="text-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">{property.propertyType}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-slate-900 mb-6 leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-3 text-slate-400 mb-12 font-medium">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600">
              <FaMapMarkerAlt />
            </div>
            {property.location}
          </div>

          {/* SPECS GRID */}
          <div className="grid grid-cols-3 gap-8 py-12 border-y border-slate-100 mb-16">
            {isResidential && (
              <>
                <SpecItem icon={<FaBed />} label="Bedrooms" value={property.residential?.bedrooms}/>
                <SpecItem icon={<FaBath />} label="Bathrooms" value={property.residential?.bathrooms}/>
                <SpecItem icon={<FaRulerCombined />} label="Living Area" value={`${property.residential?.builtUpArea} sqft`}/>
              </>
            )}
            {isPlot && (
              <>
                <SpecItem icon={<FaRulerCombined />} label="Total Space" value={property.land?.plotArea}/>
                <SpecItem icon={<FaTree />} label="Orientation" value={property.land?.facing}/>
                <SpecItem icon={<FaBuilding />} label="Zoning" value={property.land?.zoningType}/>
              </>
            )}
            {isCommercial && (
              <>
                <SpecItem icon={<FaRulerCombined />} label="Internal Size" value={property.commercial?.areaSize}/>
                <SpecItem icon={<FaBuilding />} label="Total Levels" value={property.commercial?.floors}/>
                <SpecItem icon={<FaCar />} label="Parking" value={property.commercial?.parkingSpaces}/>
              </>
            )}
          </div>

          {/* DESCRIPTION */}
          <section className="mb-16">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Detailed Overview</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              {property.description}
            </p>
          </section>

          {/* INQUIRY STATUS (If exists) */}
          {inquiry && (
            <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl">
                    <HiOutlineMail />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Application Status</h3>
                    <p className="text-sm text-slate-400">Reference ID: {inquiry._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <span className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${inquiry.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {inquiry.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Your Request</label>
                    <p className="text-slate-600 italic">"{inquiry.message}"</p>
                  </div>
                  {inquiry.response && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Agent Feedback</label>
                      <p className="text-blue-600 font-medium">{inquiry.response}</p>
                    </div>
                  )}
                </div>

                {inquiry.visitDate && (
                  <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap gap-8">
                    <div className="flex items-center gap-3">
                      <FaRegCalendarAlt className="text-blue-600" />
                      <span className="text-sm font-bold">{new Date(inquiry.visitDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaRegClock className="text-blue-600" />
                      <span className="text-sm font-bold">{inquiry.visitTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY PRICE CARD */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 bg-white border border-slate-100 p-10 rounded-[40px] shadow-2xl shadow-slate-200">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Listing Value</span>
            <h2 className="text-5xl font-light text-slate-900 mb-10 tracking-tighter">
              ₹{property.price?.toLocaleString("en-IN")}
            </h2>

            {!inquiry ? (
              <button
                onClick={() => setShowInquiry(true)}
                className="group w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
              >
                <FaEnvelope className="text-sm opacity-50 group-hover:opacity-100" />
                Schedule Consultation
              </button>
            ) : (
              <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inquiry Submitted</p>
              </div>
            )}
            
            <p className="text-[10px] text-center text-slate-400 mt-6 font-medium leading-relaxed">
              By clicking "Schedule Consultation", you agree to our professional <span className="underline">Terms of Service</span> and <span className="underline">Privacy Guidelines</span>.
            </p>
          </div>
        </div>
      </div>

      {/* --- INQUIRY MODAL --- */}
      {showInquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            
            <h2 className="text-3xl font-light tracking-tight text-slate-900 mb-2">Inquire <span className="font-serif italic text-blue-600">Privately</span></h2>
            <p className="text-slate-400 text-sm mb-8">Our executive team will reach out within 24 business hours.</p>

            <div className="space-y-5">
              {!user && (
                <div className="grid grid-cols-1 gap-4">
                  <FloatingInput name="buyerName" placeholder="Full Name" onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput name="buyerEmail" placeholder="Email Address" onChange={handleChange} />
                    <FloatingInput name="buyerPhone" placeholder="Mobile" onChange={handleChange} />
                  </div>
                </div>
              )}
              <textarea
                name="message"
                placeholder="How can we assist you with this property?"
                rows="4"
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-300"
              />

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  onClick={sendInquiry}
                  disabled={sending}
                  className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  {sending ? "Processing..." : "Submit Inquiry"}
                </button>
                <button
                  onClick={() => setShowInquiry(false)}
                  className="flex-1 border border-slate-200 py-5 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const SpecItem = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="text-blue-600 text-2xl mb-4 flex justify-center opacity-80">
      {icon}
    </div>
    <p className="text-2xl font-light text-slate-900 mb-1 leading-none">
      {value || "-"}
    </p>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
      {label}
    </p>
  </div>
);

const FloatingInput = ({ name, placeholder, onChange }) => (
  <input 
    name={name} 
    placeholder={placeholder} 
    onChange={onChange}
    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-300 shadow-sm"
  />
);

export default PropertyDetails;