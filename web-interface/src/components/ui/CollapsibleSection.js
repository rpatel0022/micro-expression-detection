import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false, 
  className = "",
  titleClassName = "",
  contentClassName = "" 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between ${titleClassName}`}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isOpen ? (
          <FiChevronUp className="text-gray-600 text-xl" />
        ) : (
          <FiChevronDown className="text-gray-600 text-xl" />
        )}
      </button>
      
      {isOpen && (
        <div className={`px-6 py-4 bg-white ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
