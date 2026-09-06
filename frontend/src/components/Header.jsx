import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl font-semibold text-slate-900">
          Encontros<span className="text-blue-800">Acadêmicos</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/consultar" className="text-slate-600 hover:text-slate-900">
            Consultar protocolo
          </Link>
          <Link
            to="/submeter"
            className="rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-blue-900"
          >
            Submeter trabalho
          </Link>
        </nav>
      </div>
    </header>
  );
}