import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

const EMPTY = { title: '', description: '', deadline: '', vacancies: '', active: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = criando novo
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  function fetchCategories() {
    setLoading(true);
    api.get('/api/admin/categories').then((res) => setCategories(res.data.data)).finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY);
    setErrors({});
    setShowForm(true);
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setForm({
      title: cat.title,
      description: cat.description ?? '',
      deadline: cat.deadline ? cat.deadline.slice(0, 10) : '',
      vacancies: cat.vacancies ?? '',
      active: cat.active,
    });
    setErrors({});
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback(null);
    try {
      if (editingId) {
        await api.put(`/api/admin/categories/${editingId}`, form);
        setFeedback({ type: 'success', text: 'Categoria atualizada.' });
      } else {
        await api.post('/api/admin/categories', form);
        setFeedback({ type: 'success', text: 'Categoria criada.' });
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 422) {
        const apiErrors = err.response.data.errors || {};
        setErrors(Object.fromEntries(Object.entries(apiErrors).map(([k, v]) => [k, v[0]])));
      } else {
        setFeedback({ type: 'error', text: 'Erro ao salvar categoria.' });
      }
    }
  }

  async function deactivate(cat) {
    if (!confirm(`Desativar "${cat.title}"? Ela deixa de aparecer na página pública.`)) return;
    await api.delete(`/api/admin/categories/${cat.id}`);
    fetchCategories();
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-slate-900">Categorias</h1>
        <button
          onClick={startCreate}
          className="rounded-md bg-blue-800 px-4 py-2 text-sm text-white hover:bg-blue-900"
        >
          Nova categoria
        </button>
      </div>

      {feedback && (
        <p className={`mb-4 text-sm ${feedback.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
          {feedback.text}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-medium text-slate-900">
            {editingId ? 'Editar categoria' : 'Nova categoria'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Título</label>
              <input
                className="input w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Vagas</label>
              <input
                type="number"
                className="input w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.vacancies}
                onChange={(e) => setForm({ ...form, vacancies: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
              <textarea
                className="input w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Prazo</label>
              <input
                type="date"
                className="input w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <label htmlFor="active" className="text-sm text-slate-700">Ativa</label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-md bg-blue-800 px-4 py-2 text-sm text-white hover:bg-blue-900">
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-slate-900">{cat.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    cat.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              {cat.description && <p className="mt-1 text-sm text-slate-600">{cat.description}</p>}
              <div className="mt-3 flex gap-2">
                <button onClick={() => startEdit(cat)} className="text-sm text-blue-800 hover:underline">
                  Editar
                </button>
                {cat.active && (
                  <button onClick={() => deactivate(cat)} className="text-sm text-red-600 hover:underline">
                    Desativar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}