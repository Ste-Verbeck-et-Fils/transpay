import React, { useState, useEffect } from "react";
import "./Feedback.css";

const Feedback = ({ type = "success", title, message, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) {
    return null;
  }

  let iconName = "info-circle-fill";
  if (type === "success") {
    iconName = "check-circle-fill";
  } else if (type === "error") {
    iconName = "exclamation-circle-fill";
  } else if (type === "warning") {
    iconName = "exclamation-triangle-fill";
  }

  return (
    <div className={`feedback-card feedback-${type}`}>
      <div className="feedback-status-line"></div>
      <div className="feedback-content">
        <div className="feedback-header">
          <i className={`bi bi-${iconName} feedback-icon`}></i>
          <h4 className="feedback-title">{title}</h4>
        </div>
        <p className="feedback-message">{message}</p>
      </div>
    </div>
  );
};

export default Feedback;
