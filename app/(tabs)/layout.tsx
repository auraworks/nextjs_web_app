"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/client";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: "home", label: "HOME" },
    { id: "chat", label: "CHAT" },
    { id: "product", label: "PRODUCT" },
    { id: "mypage", label: "MYPAGE" },
  ];

  return (
    <div className="bg-white border-t border-gray-200 pb-safe-bottom">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-3 transition-colors ${
                isActive
                  ? "text-blue-500 border-t-2 border-blue-500 -mt-[2px]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`w-6 h-6 mb-1 rounded ${
                isActive ? "bg-blue-500" : "bg-gray-400"
              }`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const getActiveTab = (path: string) => {
    if (path.startsWith('/chat')) return 'chat';
    if (path.startsWith('/product')) return 'product';
    if (path.startsWith('/mypage')) return 'mypage';
    return 'home';
  };

  const activeTab = getActiveTab(pathname);

  useEffect(() => {
    const supabase = createClient();
    
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace("/");
        return;
      }
      
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_email', user.email || '');
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoading(false);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('user_id', session.user.id);
        localStorage.setItem('user_email', session.user.email || '');
        localStorage.setItem('isLoggedIn', 'true');
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('isLoggedIn');
        router.replace("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleTabChange = (tab: string) => {
    router.push(`/${tab}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {children}
      </div>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
