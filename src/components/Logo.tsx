
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark' }) => {
  // Define logo size based on prop
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl md:text-4xl'
  };

  // Define color scheme based on variant
  const colorClasses = {
    light: 'text-white',
    dark: 'text-furniture-primary'
  };

  return (
    <Link 
      to="/" 
      className={`font-serif font-bold ${sizeClasses[size]} ${colorClasses[variant]} tracking-tight flex items-center transition-all duration-300 hover:opacity-90`}
    >
      <span className="relative">
        <span className="relative z-10">ProMebel</span>
        <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-furniture-accent opacity-70"></span>
      </span>
      <span className="text-furniture-secondary text-sm ml-1 mt-1">.shop</span>
    </Link>
  );
};

export default Logo;
