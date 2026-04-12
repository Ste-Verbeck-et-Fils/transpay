import React, { useState } from "react";
import "./Input.css";
import flagDrc from "../../assets/images/drapeau_rdc.png";

const Input = ({
  label,
  placeholder,
  icon,
  type = "text",
  value,
  onChange,
  id,
  isPhone = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  let inputType = type;
  const isPin = type === "password" || type === "pin";

  if (isPin) {
    inputType = "password";
    if (showPassword) {
      inputType = "text";
    }
  }

  let wrapperClass = "input-wrapper";
  if (isPhone) {
    wrapperClass += " phone-wrapper";
  }

  let fieldClass = "input-field";
  if (icon && !isPhone) {
    fieldClass += " has-icon-left";
  }
  if (isPin) {
    fieldClass += " has-icon-right";
  }

  let eyeIconClass = "bi bi-eye";
  if (showPassword) {
    eyeIconClass = "bi bi-eye-slash";
  }

  return (
    <div className="input-group-custom">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <div className={wrapperClass}>
        {isPhone && (
          <div className="phone-prefix">
            <img src={flagDrc} alt="DRC Flag" className="flag-icon" />
            <span className="prefix-text">+243</span>
            <div className="divider"></div>
          </div>
        )}

        {!isPhone && icon && (
          <div className="input-icon-left">
            <i className={`bi bi-${icon}`}></i>
          </div>
        )}

        <input
          id={id}
          type={inputType}
          className={fieldClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />

        {isPin && (
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            <i className={eyeIconClass}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
