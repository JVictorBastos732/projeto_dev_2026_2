import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/auth/login');
  }

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-blue-800 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-serif text-lg font-semibold text-slate-900">
            Painel — Submissões
          </span>
          <nav className="flex items-center gap-2">
            <NavLink to="/admin" end className={linkClass}>
              Submissões
            </NavLink>
            <NavLink to="/admin/categories" className={linkClass}>
              Categorias
            </NavLink>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}