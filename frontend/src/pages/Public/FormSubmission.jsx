import { useEffect, useState } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';

const INITIAL_FIELDS = {
  author_name: '',
  author_email: '',
  category_id: '',
  title: '',
  resume: '',
  desired_date: '',
};

export default function FormSubmission() {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(INITIAL_FIELDS);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { protocolo, message }

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data.data));
  }, []);

  function localValidate() {
    const newErrors = {};
    if (!data.author_name.trim()) newErrors.author_name = 'Informe seu nome.';
    if (!/^\S+@\S+\.\S+$/.test(data.author_email)) newErrors.author_email = 'Email inválido.';
    if (!data.category_id) newErrors.category_id = 'Escolha uma categoria.';
    if (!data.title.trim()) newErrors.title = 'Informe o título.';
    if (!data.desired_date) newErrors.desired_date = 'Escolha uma data.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);

    if (!localValidate()) return;

    setSending(true);
    try {
      await api.get('/sanctum/csrf-cookie');

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      if (file) formData.append('file', file);

      const res = await api.post('/api/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(res.data);
      setData(INITIAL_FIELDS);
      setFile(null);
      setErrors({});

    } catch (err) {
      if (err.response?.status === 422) {
        const apiErrors = err.response.data.errors || {};
        setErrors(
          Object.fromEntries(Object.entries(apiErrors).map(([k, v]) => [k, v[0]]))
        );
      } else {
        setErrors({ general: 'Erro ao enviar. Tente novamente em instantes.' });
      }
    } finally {
      setSending(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <div className="rounded-lg border border-green-200 bg-green-50 p-8">
            <h2 className="font-serif text-2xl font-semibold text-green-900">
              Submissão enviada!
            </h2>
            <p className="mt-2 text-slate-700">{result.message}</p>
            <p className="mt-4 rounded-md bg-white p-3 font-mono text-lg font-semibold text-slate-900">
              {result.protocol}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Guarde esse código para consultar o status depois.
            </p>
            <button
              onClick={() => setResul(null)}
              className="mt-6 text-sm text-blue-800 underline"
            >
              Enviar outra submissão
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-xl px-6 py-12">
        <h1 className="font-serif text-2xl font-semibold text-slate-900">
          Submeter trabalho
        </h1>

        {errors.general && <p className="mt-4 text-sm text-red-600">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Field label="Nome completo" error={errors.author_name}>
            <input
              className="input w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-0"
              value={data.author_name}
              onChange={(e) => setData({ ...data, author_name: e.target.value })}
            />
          </Field>

          <Field label="Email" error={errors.author_email}>
            <input
              type="email"
              className="input w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-0"
              value={data.author_email}
              onChange={(e) => setData({ ...data, author_email: e.target.value })}
            />
          </Field>

          <Field label="Categoria" error={errors.category_id}>
            <select
              className="input w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-0"
              value={data.category_id}
              onChange={(e) => setData({ ...data, category_id: e.target.value })}
            >
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Título do trabalho" error={errors.title}>
            <input
              className="input w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-0"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </Field>

          <Field label="Resumo (opcional)">
            <textarea
              className="input w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-0"
              rows={4}
              value={data.resume}
              onChange={(e) => setData({ ...data, resume: e.target.value })}
            />
          </Field>

          <Field label="Data desejada" error={errors.desired_date}>
            <input
              type="date"
              className="input w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-0"
              value={data.desired_date}
              onChange={(e) => setData({ ...data, desired_date: e.target.value })}
            />
          </Field>

          <Field label="Arquivo PDF">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm"
            />
          </Field>

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-md bg-blue-800 py-3 text-white hover:bg-blue-900 disabled:opacity-50"
          >
            {sending ? 'Enviando...' : 'Enviar submissão'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}