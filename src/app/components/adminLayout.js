'use client'
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-bold">Painel Admin</h2>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          >
            Sair
          </button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}