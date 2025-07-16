'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Admin() {
    const [password, setPassword] = useState('');
    const router = useRouter();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
          sessionStorage.setItem('admin-auth', 'true');
          router.push('/admin/dashboard');
        } else {
          alert("Senha incorreta!");
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl text-black font-bold mb-6 text-center">Acesso Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-gray-700 p-3 mb-4 border rounded-lg"
            placeholder="Senha de acesso"
          />
          <button
            type="submit"
            className="w-full bg-[#FFCB69] text-white py-3 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </div>
    )
}