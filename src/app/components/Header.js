'use client';

import Image from 'next/image';
import logo from '../../../public/assets/logo.png'; // ajuste o caminho conforme necessário
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function Header({ onCalendarClick }) {
  return (
    <div className="flex justify-between items-center">
      <Image
        src={logo}
        width={100}
        height={100}
        alt="logo"
        onClick={() => (window.location.href = '/')}
        className="cursor-pointer"
      />
      <div className="flex gap-3 justify-center items-center mb-3.5">
        <ThemeToggle />
        <button
          onClick={onCalendarClick}
          className="px-3 py-1 mb-3.5 rounded-xl bg-[#FFCB69] hover:bg-[#FFC352] transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
