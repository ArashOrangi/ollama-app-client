"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [phoneNumber, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { phoneNumber, password });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) { alert("Login failed!"); }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <form onSubmit={handleLogin} className="p-8 bg-slate-900 rounded-lg shadow-xl w-96 border border-slate-800">
        <h1 className="text-2xl font-bold mb-6">Login to Ollama</h1>
        <input type="text" placeholder="Phone Number" className="w-full mb-4 p-2 rounded bg-slate-800 border border-slate-700" 
          value={phoneNumber} onChange={e => setPhone(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full mb-6 p-2 rounded bg-slate-800 border border-slate-700" 
          value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700 transition">Login</button>
        <p className="mt-4 text-sm text-slate-400">Don't have an account? <Link href="/signup" className="text-blue-400">Signup</Link></p>
      </form>
    </div>
  );
}