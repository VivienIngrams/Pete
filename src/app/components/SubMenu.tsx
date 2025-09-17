'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './context/LanguageProvider';



const SubMenu = ({ posts }) => {
  const { language } = useLanguage(); // Access the language from context

  return (
    <nav className="fixed font-cinzel bg-white text-gray-500 px-4 top-16 md:top-14 w-full z-50">
      {/* Gradient bar */}
      <div className="absolute -bottom-3 left-0 w-full h-4 bg-gradient-to-b from-white to-transparent"></div>
      <ul className="flex flex-row flex-wrap pt-4 gap-x-7 justify-center">
        {posts.map((post, index) => (
          <li key={index}>
            <Link
              href={`${post.href}`}
              className="hover:text-black font-medium leading-2 text-sm"
            >
              {language === 'en' && post.title_en ? post.title_en : post.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubMenu;
