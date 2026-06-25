import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import "./Register.css";

const Register = () => {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    shareData: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validators = {
    name: (v) => {
      if (!v.trim()) return "Field is required";
      if (!/^[a-zA-Z\s]+$/.test(v.trim())) return "Name must contain only letters";
      return "";
    },
    username: (v) => {
      if (!v.trim()) return "Field is required";
      if (/\s/.test(v)) return "Username must not contain spaces";
      if (!/^[a-zA-Z0-9]+$/.test(v)) return "Username must be alphanumeric";
      return "";
    },
    email: (v) => {
      if (!v.trim()) return "Field is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
      return "";
    },
    mobile: (v) => {
      if (!v.trim()) return "Field is required";
      if (!/^\d{10}$/.test(v)) return "Mobile must be exactly 10 digits";
      return "";
    },
    shareData: (v) => {
      if (!v) return "Check this box if you want to proceed";
      return "";
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name]?.(val) || "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name]?.(val) || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Touch all fields
    const allTouched = { name: true, username: true, email: true, mobile: true, shareData: true };
    setTouched(allTouched);

    const newErrors = {};
    Object.keys(validators).forEach((key) => {
      const err = validators[key](formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
      });
      navigate("/categories");
    }
  };

  const getFieldClass = (field) => {
    if (!touched[field]) return "reg-input";
    return `reg-input ${errors[field] ? "input-error" : "input-valid"}`;
  };

  return (
    <div className="reg-page">
      {/* Left panel with background image */}
      <div className="reg-left">
        <div className="reg-left-overlay">
          <h1 className="reg-left-title">Discover new things on Superapp</h1>
        </div>
      </div>

      {/* Right panel with form */}
      <div className="reg-right">
        <div className="reg-form-card">
          <div className="reg-logo">
            <h1>Super app</h1>
          </div>
          <p className="reg-subtitle">Create your new account</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="reg-field">
              <input
                className={getFieldClass("name")}
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.name && errors.name && (
                <span className="reg-error">{errors.name}</span>
              )}
            </div>

            <div className="reg-field">
              <input
                className={getFieldClass("username")}
                type="text"
                name="username"
                placeholder="UserName"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.username && errors.username && (
                <span className="reg-error">{errors.username}</span>
              )}
            </div>

            <div className="reg-field">
              <input
                className={getFieldClass("email")}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <span className="reg-error">{errors.email}</span>
              )}
            </div>

            <div className="reg-field">
              <input
                className={getFieldClass("mobile")}
                type="tel"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.mobile && errors.mobile && (
                <span className="reg-error">{errors.mobile}</span>
              )}
            </div>

            <div className="reg-checkbox-row">
              <label className="reg-checkbox-label">
                <input
                  type="checkbox"
                  name="shareData"
                  checked={formData.shareData}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span>Share my registration data with Superapp</span>
              </label>
              {touched.shareData && errors.shareData && (
                <span className="reg-error">{errors.shareData}</span>
              )}
            </div>

            <button type="submit" className="reg-btn">
              SIGN UP
            </button>
          </form>

          <p className="reg-terms">
            By clicking on Sign up, you agree to Superapp{" "}
            <a href="#">Terms and Conditions of Use</a>
          </p>
          <p className="reg-privacy">
            To learn more about how Superapp collects, uses, shares and protects
            your personal data please head Superapp <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
