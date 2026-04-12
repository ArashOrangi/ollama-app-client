"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, []);

  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar onSelect={setActiveConvId} activeId={activeConvId} />
      <ChatWindow conversationId={activeConvId} setConversationId={setActiveConvId} />
    </main>
  );
}