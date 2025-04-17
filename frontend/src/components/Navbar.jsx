// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">NeuroQuest</Link>
        <ul className="flex space-x-4">
          <li><Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/quizzes" className="hover:text-gray-300">Quizzes</Link></li>
          <li><Link to="/profile" className="hover:text-gray-300">Profile</Link></li>
          <li><Link to="/login" className="hover:text-gray-300">Logout</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
