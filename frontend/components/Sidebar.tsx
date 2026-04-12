"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, LogOut } from 'lucide-react';

export default function Sidebar({ onSelect, activeId }: { onSelect: (id: number | null) => void, activeId: number | null }) {
  const [convs, setConvs] = useState<any[]>([]);

  useEffect(() => {
    fetchConvs();
  }, []);

  const fetchConvs = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/api/chat/conversations', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setConvs(res.data);
  };

  return (
    <div className="w-64 bg-slate-950 flex flex-col border-r border-slate-800">
      <button onClick={() => onSelect(null)} className="m-4 flex items-center justify-center gap-2 p-2 border border-slate-700 rounded hover:bg-slate-800 transition">
        <Plus size={18} /> New Chat
      </button>
      <div className="flex-1 overflow-y-auto px-2">
        {convs.map(c => (
          <div key={c.id} onClick={() => onSelect(c.id)} className={`p-3 mb-1 rounded cursor-pointer flex items-center gap-2 transition ${activeId === c.id ? 'bg-slate-800' : 'hover:bg-slate-900 text-slate-400'}`}>
            <MessageSquare size={16} />
            <span className="truncate text-sm">{c.title}</span>
          </div>
        ))}
      </div>
      <button className="p-4 flex items-center gap-2 text-slate-400 hover:text-white" onClick={() => { localStorage.clear(); window.location.reload(); }}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}