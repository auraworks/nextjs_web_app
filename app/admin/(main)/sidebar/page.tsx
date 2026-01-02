'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarMenus = [
  { name: '대시보드', href: '/admin/dashboard' },
  { name: '회원 관리', href: '/admin/members' },
  { name: '문의 관리', href: '/admin/chat' },
  { name: '상품 관리', href: '/admin/products' },
  { name: '리뷰 관리', href: '/admin/reviews' },
  { name: '주문 관리', href: '/admin/orders' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">관리자 페이지</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarMenus.map((menu) => (
            <li key={menu.href}>
              <Link
                href={menu.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  pathname === menu.href
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
