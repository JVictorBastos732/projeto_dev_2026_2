import { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';

export default function AdminSubmissions() {
  const [result, setResult] = useState({ data: [], meta: null });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [actingId, setActingId] = useState(null);

  const fetchSubmissions = useCallback(() => {
    setLoading(true);
    api
      .get('/api/admin/submissions', { params: { status, search, page } })
      .then((res) => setResult(res.data))
      .finally(() => setLoading(false));
  }, [status, search, page]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function updateStatus(id, newStatus) {
    setActingId(id);
    setFeedback(null);
    try {
      await api.patch(`/api/admin/submissions/${id}/status`, { status: newStatus });
      setFeedback({ type: 'success', text: 'Status atualizado.' });
      fetchSubmissions();
    } catch {
      setFeedback({ type: 'error', text: 'Não foi possível atualizar. Tente novamente.' });
    } finally {
      setActingId(null);
    }
  }

  return (
    <AdminLayout>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-slate-900">Submissões</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="canceled">Reprovado</option>
        </select>

        <input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {feedback && (
        <p className={`mb-4 text-sm ${feedback.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
          {feedback.text}
        </p>
      )}

      {loading && <p className="text-slate-500">Carregando...</p>}

      {!loading && result.data.length === 0 && (
        <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-slate-500">
          Nenhuma submissão encontrada com esses filtros.
        </p>
      )}

      {!loading && result.data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Trabalho</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{s.author_name}</div>
                    <div className="text-xs text-slate-500">{s.author_email}</div>
                  </td>
                  <td className="px-4 py-3">{s.title}</td>
                  <td className="px-4 py-3">{s.category?.title}</td>
                  <td className="px-4 py-3">
                    {new Date(s.desired_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    {s.status === 'pending' ? (
                      <div className="flex gap-2">
                        <a
                        href={`http://localhost:8000/api/admin/submissions/${s.id}/file`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-800 hover:underline"
                      >
                        Baixar PDF
                      </a>
                        <button
                          disabled={actingId === s.id}
                          onClick={() => updateStatus(s.id, 'approved')}
                          className="rounded-md bg-green-700 px-3 py-1 text-xs text-white hover:bg-green-800 disabled:opacity-50"
                        >
                          Aprovar
                        </button>
                        <button
                          disabled={actingId === s.id}
                          onClick={() => updateStatus(s.id, 'canceled')}
                          className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reprovar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.meta && result.meta.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            Página {result.meta.current_page} de {result.meta.last_page} ({result.meta.total} no total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              disabled={page >= result.meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}