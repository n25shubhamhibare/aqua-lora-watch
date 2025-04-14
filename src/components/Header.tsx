
import React from 'react';
import { Droplet } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-water-deep text-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Droplet className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">AquaLora Watch</h1>
          <p className="text-sm opacity-80">Water Quality Monitoring System</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
