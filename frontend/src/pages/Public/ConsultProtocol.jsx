import { useState } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';

const STATUS_LABEL = {
  pending: { text: 'Pendente', color: 'bg-amber-100 text-amber-800' },
  approved: { text: 'Aprovado', color: 'bg-green-100 text-green-800' },
  canceled: { text: 'Reprovado', color: 'bg-red-100 text-red-800' },
};

export default function ConsulProtocol() {
  const [protocol, setProtocol] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  async function serach(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSearching(true);
    try {
      const res = await api.get(`/api/submissions/consult/${protocol.trim()}`);
      setResult(res.data);
    } catch {
      setError('Protocolo não encontrado. Confira o código e tente novamente.');
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-6 py-12">
        <h1 className="font-serif text-2xl font-semibold text-slate-900">
          Consultar protocolo
        </h1>

        <form onSubmit={serach} className="mt-6 flex gap-2">
          <input
            className="input"
            placeholder="Ex: SUB-2026-A3F9K2"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-md bg-blue-800 px-4 text-white hover:bg-blue-900 disabled:opacity-50"
          >
            Buscar
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {result && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900">{result.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_LABEL[result.status].color}`}
              >
                {STATUS_LABEL[result.status].text}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">Categoria: {result.category}</p>
            <p className="mt-1 text-sm text-slate-500">
              Enviado em {new Date(result.criado_em).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}