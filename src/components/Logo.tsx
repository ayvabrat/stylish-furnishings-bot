
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark' }) => {
  // Define logo size based on prop
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };

  // Define color scheme based on variant
  const colorClasses = {
    light: 'text-white',
    dark: 'text-kimmy-pink-dark'
  };

  return (
    <Link 
      to="/" 
      className={`font-sans font-black ${sizeClasses[size]} ${colorClasses[variant]} tracking-wide flex items-center transition-all duration-300 hover:opacity-90 group`}
    >
      <div className="relative flex items-center">
        <Heart 
          className="w-6 h-6 md:w-8 md:h-8 text-kimmy-pink mr-2 group-hover:animate-heartbeat transition-all duration-300" 
          fill="currentColor"
        />
        <span className="relative">
          <span className="relative z-10 bg-gradient-to-r from-kimmy-pink to-kimmy-pink-dark bg-clip-text text-transparent">
            MY Kimmy
          </span>
          <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-kimmy-pink opacity-40 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
