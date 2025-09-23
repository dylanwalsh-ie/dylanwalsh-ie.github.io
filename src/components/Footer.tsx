/**
 * @file Renders the footer component for the portfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Displays copyright information
 */
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 border-t border-blue-500/20 mt-16">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Dylan Walsh. All rights reserved.</p>
      </div>
    </footer>
  );
};
