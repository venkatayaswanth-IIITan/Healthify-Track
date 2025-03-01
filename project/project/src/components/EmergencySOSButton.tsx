import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmergencySOSButtonProps {
  onClick: () => void;
}

const EmergencySOSButton: React.FC<EmergencySOSButtonProps> = ({ onClick }) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const handleEmergencyClick = () => {
    setIsEmergencyActive(true);
    onClick();
    // Reset after a short delay (e.g., 2 seconds)
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleEmergencyClick}
      className={`fixed bottom-20 right-4 rounded-full p-4 shadow-lg z-50 ${
        isEmergencyActive ? 'bg-white text-red-600' : 'bg-red-600 text-white hover:bg-red-700'
      }`}
      aria-label="Emergency SOS"
    >
      <AlertTriangle className="h-6 w-6" />
    </button>
  );
};

export default EmergencySOSButton;

