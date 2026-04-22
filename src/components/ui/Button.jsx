import React from "react";
import "./Button.css";

const Button = ({
  text,
  variant = "primary",
  icon,
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) => {
  let variantClass = "btn-primary";
  if (variant === "secondary") variantClass = "btn-secondary";
  else if (variant === "outline") variantClass = "btn-outline";
  else if (variant === "ghost") variantClass = "btn-ghost";
  else if (variant === "loading") variantClass = "btn-loading";

  let contentIcon = null;
  if (isLoading) {
    contentIcon = (
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
    );
  } else if (icon) {
    contentIcon = <i className={`bi bi-${icon} me-2`}></i>;
  }

  let arrowIcon = null;
  if (variant === "ghost") {
    arrowIcon = <i className="bi bi-arrow-right ms-2 small-arrow"></i>;
  }

  return (
    <button
      type={type}
      className={`btn-custom ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {contentIcon}
      {text}
      {arrowIcon}
    </button>
  );
};

export default Button;
