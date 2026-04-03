import React, { useState } from "react";
import api from "../../app/apiClient";
import {
  FaCloudUploadAlt,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaHome,
  FaLayerGroup,
  FaImage,
  FaCheck
} from "react-icons/fa";

const AddProperty = () => {
  const [step, setStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    locality: "",
    location: "",
    coordinates: { lat: "", lng: "" },
    propertyType: "Apartment",
    listingType: "Sale",
    residential: {
      bedrooms: 0,
      bathrooms: 0,
      kitchens: 0,
      builtUpArea: 0,
      furnishing: "Unfurnished"
    },
    commercial: {
      areaSize: 0,
      floors: 0,
      parkingSpaces: 0,
      businessType: ""
    },
    land: {
      plotArea: 0,
      areaUnit: "sqft",
      facing: "",
      zoningType: "",
      approvalStatus: "NA"
    },
    amenities: [],
    images: []
  });

  /* ---------- AMENITIES ---------- */

  const residentialAmenities = ["Pool", "Gym", "Parking", "Lift", "Garden"];
  const commercialAmenities = ["Parking", "Power Backup", "Lift", "CCTV"];
  const plotAmenities = [
    "Road Access",
    "Boundary Wall",
    "Electricity",
    "Water Supply",
    "Gated Community",
    "Corner Plot"
  ];

  const getAmenities = () => {
    if (formData.propertyType === "Commercial") return commercialAmenities;
    if (formData.propertyType === "Plot") return plotAmenities;
    return residentialAmenities;
  };

  /* ---------- HANDLERS ---------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => {
        if (name === "propertyType") {
          return {
            ...prev,
            propertyType: value,
            amenities: [],
            residential: {
              bedrooms: 0,
              bathrooms: 0,
              kitchens: 0,
              builtUpArea: 0,
              furnishing: "Unfurnished"
            },
            commercial: {
              areaSize: 0,
              floors: 0,
              parkingSpaces: 0,
              businessType: ""
            },
            land: {
              plotArea: 0,
              areaUnit: "sqft",
              facing: "",
              zoningType: "",
              approvalStatus: "NA"
            }
          };
        }

        return {
          ...prev,
          [name]: type === "checkbox" ? checked : value
        };
      });
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Basic fields
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("city", formData.city);
      data.append("locality", formData.locality);
      data.append("location", formData.location);
      data.append("propertyType", formData.propertyType);
      data.append("listingType", formData.listingType);

      // Coordinates
      data.append("coordinates[type]", "Point");
      data.append("coordinates[coordinates][0]", Number(formData.coordinates.lng));
      data.append("coordinates[coordinates][1]", Number(formData.coordinates.lat));

      // Amenities
      formData.amenities.forEach((a) => {
        data.append("amenities", a);
      });

      // Residential
      if (formData.propertyType !== "Plot" && formData.propertyType !== "Commercial") {
        Object.entries(formData.residential).forEach(([key, value]) => {
          data.append(`residential[${key}]`, value);
        });
      }

      // Commercial
      if (formData.propertyType === "Commercial") {
        Object.entries(formData.commercial).forEach(([key, value]) => {
          data.append(`commercial[${key}]`, value);
        });
      }

      // Land
      if (formData.propertyType === "Plot") {
        Object.entries(formData.land).forEach(([key, value]) => {
          data.append(`land[${key}]`, value);
        });
      }

      // 🔥 Real Images
      formData.images.forEach((img) => {
        data.append("images", img.file);
      });

      const response = await api.post("/properties", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Property created successfully!");

      setFormData({
        title: "",
        description: "",
        price: "",
        city: "",
        locality: "",
        location: "",
        coordinates: { lat: "", lng: "" },
        propertyType: "Apartment",
        listingType: "Sale",
        residential: {
          bedrooms: 0,
          bathrooms: 0,
          kitchens: 0,
          builtUpArea: 0,
          furnishing: "Unfurnished"
        },
        commercial: {
          areaSize: 0,
          floors: 0,
          parkingSpaces: 0,
          businessType: ""
        },
        land: {
          plotArea: 0,
          areaUnit: "sqft",
          facing: "",
          zoningType: "",
          approvalStatus: "NA"
        },
        amenities: [],
        images: []
      });

      setStep(1);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto text-slate-200 min-h-screen">

      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-400 text-green-400 px-6 py-3 rounded-xl">
          {successMessage}
        </div>
      )}

      {/* ---------- STEP TRACKER ---------- */}
      <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
        <div className="absolute top-6 left-0 w-full h-[1px] bg-white/10 -z-0" />
        <StepIndicator stepNum={1} currentStep={step} label="Essentials" icon={FaHome} />
        <StepIndicator stepNum={2} currentStep={step} label="Details" icon={FaLayerGroup} />
        <StepIndicator stepNum={3} currentStep={step} label="Media" icon={FaImage} />
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl">

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-8">

            <InputField label="Property Title" name="title" value={formData.title} onChange={handleChange} />
            <TextareaField label="Description" name="description" value={formData.description} onChange={handleChange} />

            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Locality" name="locality" value={formData.locality} onChange={handleChange} />
              <InputField label="Location" name="location" value={formData.location} onChange={handleChange} icon={<FaMapMarkerAlt />} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <SelectField label="Property Type" name="propertyType" value={formData.propertyType}
                onChange={handleChange}
                options={["Apartment", "Villa", "Cottage", "House", "Plot", "Commercial"]} />
              <SelectField label="Listing Type" name="listingType" value={formData.listingType}
                onChange={handleChange}
                options={["Sale", "Rent"]} />
            </div>

          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-10">

            {/* Residential */}
            {formData.propertyType !== "Plot" && formData.propertyType !== "Commercial" && (
              <div className="grid md:grid-cols-3 gap-4">
                <InputField label="Bedrooms" name="residential.bedrooms" type="number"
                  value={formData.residential.bedrooms} onChange={handleChange} />
                <InputField label="Bathrooms" name="residential.bathrooms" type="number"
                  value={formData.residential.bathrooms} onChange={handleChange} />
                <InputField label="Kitchens" name="residential.kitchens" type="number"
                  value={formData.residential.kitchens} onChange={handleChange} />
                <InputField label="Built Area" name="residential.builtUpArea" type="number"
                  value={formData.residential.builtUpArea} onChange={handleChange} />
                <SelectField label="Furnishing" name="residential.furnishing"
                  value={formData.residential.furnishing}
                  onChange={handleChange}
                  options={["Furnished", "Semi-Furnished", "Unfurnished"]} />
              </div>
            )}

            {/* Commercial */}
            {formData.propertyType === "Commercial" && (
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Area Size" name="commercial.areaSize" type="number"
                  value={formData.commercial.areaSize} onChange={handleChange} />
                <InputField label="Floors" name="commercial.floors" type="number"
                  value={formData.commercial.floors} onChange={handleChange} />
                <InputField label="Parking Spaces" name="commercial.parkingSpaces" type="number"
                  value={formData.commercial.parkingSpaces} onChange={handleChange} />
                <InputField label="Business Type" name="commercial.businessType"
                  value={formData.commercial.businessType} onChange={handleChange} />
              </div>
            )}

            {/* Plot */}
            {formData.propertyType === "Plot" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <InputField label="Plot Area" name="land.plotArea" type="number"
                    value={formData.land.plotArea} onChange={handleChange} />
                  <SelectField label="Unit" name="land.areaUnit"
                    value={formData.land.areaUnit}
                    onChange={handleChange}
                    options={["sqft", "sqyd", "acre"]} />
                  <SelectField label="Facing" name="land.facing"
                    value={formData.land.facing}
                    onChange={handleChange}
                    options={["", "North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"]} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SelectField
                    label="Zoning Type"
                    name="land.zoningType"
                    value={formData.land.zoningType}
                    onChange={handleChange}
                    options={[
                      "",
                      "Residential",
                      "Commercial",
                      "Agricultural",
                      "Industrial"
                    ]}
                  />

                  <SelectField
                    label="Approval Status"
                    name="land.approvalStatus"
                    value={formData.land.approvalStatus}
                    onChange={handleChange}
                    options={[
                      "NA",
                      "Approved",
                      "Unapproved"
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-xs uppercase tracking-widest font-bold text-purple-400 mb-4">
                Amenities
              </h3>

              <div className="flex flex-wrap gap-3">
                {getAmenities().map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => handleAmenityChange(a)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${formData.amenities.includes(a)
                      ? "bg-purple-600 border-purple-400 text-white"
                      : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-8">

            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Latitude" name="coordinates.lat"
                value={formData.coordinates.lat} onChange={handleChange} />
              <InputField label="Longitude" name="coordinates.lng"
                value={formData.coordinates.lng} onChange={handleChange} />
            </div>

            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center">
              <input type="file" multiple onChange={handleImageUpload} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <FaCloudUploadAlt className="mx-auto text-4xl text-purple-500 mb-4" />
                Upload Images ({formData.images.length})
              </label>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">

                      <img
                        src={img.preview}
                        alt="preview"
                        className="h-24 w-full object-cover rounded-xl"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                      >
                        ❌
                      </button>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <button onClick={() => setStep(s => Math.max(1, s - 1))}
            className="px-6 py-3 bg-white/5 rounded-xl">
            <FaArrowLeft /> Back
          </button>

          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="px-8 py-3 bg-purple-600 rounded-xl text-white">
              Continue <FaArrowRight />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="px-10 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold">
              <FaSave /> Publish
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

/* ---------- REUSABLE COMPONENTS ---------- */

const InputField = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-slate-400 uppercase">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <input {...props}
        className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 ${icon ? "pl-10" : ""}`} />
    </div>
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-slate-400 uppercase">{label}</label>
    <textarea {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-4" />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-slate-400 uppercase">{label}</label>
    <select {...props}
      className="w-full bg-slate-900 border border-white/10 rounded-xl p-4">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const CheckboxField = ({ label, ...props }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" {...props} />
    <span className="text-sm text-slate-400">{label}</span>
  </label>
);

const StepIndicator = ({ stepNum, currentStep, label, icon: Icon }) => (
  <div className="flex flex-col items-center flex-1">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 
      ${currentStep >= stepNum ? "bg-purple-600 border-purple-400" : "border-white/10 bg-slate-900"}`}>
      {currentStep > stepNum ? <FaCheckCircle /> : <Icon />}
    </div>
    <span className="text-xs mt-2">{label}</span>
  </div>
);

export default AddProperty;
