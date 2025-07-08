import React from 'react';

const RemindMeLogo = ({ size = 24, color = '#3B82F6' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clock face */}
      <circle 
        cx="12" 
        cy="12" 
        r="9" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
      />
      
      {/* Clock hands */}
      <path 
        d="M12 7V12L15 15" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Notification dot */}
      <circle 
        cx="18" 
        cy="6" 
        r="3" 
        fill={color} 
      />
    </svg>
  );
};

export default RemindMeLogo;