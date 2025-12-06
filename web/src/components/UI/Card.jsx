import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
    return (
        <div className={`
      bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
      ${hover ? 'transition-all duration-300 hover:shadow-xl hover:scale-[1.02]' : ''}
      ${className}
    `}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
        {children}
    </div>
);

export const CardBody = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-gray-50 ${className}`}>
        {children}
    </div>
);

export default Card;