import React from 'react';

export const RemoveBgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth="1.5"
  >
    {/* Person */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.501 20.118a7.5 7.5 0 0114.998 0" />

    {/* Dashed Outline */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);