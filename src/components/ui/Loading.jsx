import React from 'react';
import './Loading.css';

const Loading = ({ title, description }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
        </div>
        <div className="loading-text">
          <h4 className="loading-title">{title}</h4>
          <p className="loading-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
