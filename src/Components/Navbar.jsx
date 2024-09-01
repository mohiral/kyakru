import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import HomeIcon from '../assets/home.svg';
import AboutIcon from '../assets/about.svg';
import ServiceIcon from '../assets/result.svg';
import ContactIcon from '../assets/contact.svg';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className={`bg-[#4CAF50] shadow-md w-full z-50 ${isMobile ? 'fixed bottom-0' : 'sticky top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo for Desktop */}
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-bold">SATTA</h1>
            </div>

            {/* Desktop Menu */}
            {!isMobile && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link to="/about" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">About</Link>
                <Link to="/Contact" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
                <Link to="/admin/*" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
              </div>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <div className="flex justify-around w-full">
                <Link to="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium">
                  <img src={HomeIcon} alt="Home Icon" width="24" height="24" />
                </Link>
                <Link to="/about" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium">
                  <img src={AboutIcon} alt="About Icon" width="24" height="24" />
                </Link>
                <Link to="/contact" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium">
                  <img src={ContactIcon} alt="Contact Icon" width="24" height="24" />
                </Link>
                <Link to="/admin/*" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium">
                  <img src={ServiceIcon} alt="Service Icon" width="24" height="24" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* <HomePage/>
      <ResultsTable/> */}
    </>
  );
};

export default Navbar;
