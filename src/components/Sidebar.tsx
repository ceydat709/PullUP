'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="text-black text-2xl font-bold bg-gray-100 p-2 rounded hover:bg-gray-200"
      >
        ☰
      </button>
      {open && (
        <div className="absolute left-0 top-16 bg-white border rounded shadow-lg p-4 z-50 flex flex-col space-y-4 w-48">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/create" className="hover:underline">Create</Link>
          <Link href="/search" className="hover:underline">Search</Link>
        </div>
      )}
    </div>
  );
}
