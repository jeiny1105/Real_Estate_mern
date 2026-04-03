export const validateRegister = (data) => {
  const errors = {};

  // ================= BASIC USER =================
  if (!data.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
    errors.phone = "Enter a valid 10-digit Indian phone number";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // ================= ROLE-BASED =================
  if (data.role === "Seller") {
    if (!data.companyName.trim()) {
      errors.companyName = "Company name is required for sellers";
    }
  }

  if (data.role === "Agent") {
    if (!data.agencyName.trim()) {
      errors.agencyName = "Agency name is required for agents";
    }

    if (!data.licenseNumber.trim()) {
      errors.licenseNumber = "License number is required for agents";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
