import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Header from '../../components/Header';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setError('Não foi possível carregar as categorias no momento.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="font-serif text-4xl font-semibold text-slate-900">
          III Encontro de Pesquisa & Extensão
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Submeta seu artigo, resumo expandido ou pôster para avaliação. Acompanhe
          o status da sua submissão a qualquer momento pelo protocolo gerado no envio.
        </p>
        <Link
          to="/submeter"
          className="mt-8 inline-block rounded-md bg-blue-800 px-6 py-3 text-white hover:bg-blue-900"
        >
          Fazer submissão
        </Link>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-slate-900">
          Categorias abertas
        </h2>

        {loading && <p className="text-slate-500">Carregando categorias...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && categories.length === 0 && (
          <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-slate-500">
            Nenhuma categoria está aberta para submissão no momento. Volte em breve.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">{cat.title}</h3>
              {cat.description && (
                <p className="mt-1 text-sm text-slate-600">{cat.description}</p>
              )}
              <div className="mt-3 flex justify-between text-xs text-slate-500">
                {cat.deadline && (
                  <span>Prazo: {new Date(cat.deadline).toLocaleDateString('pt-BR')}</span>
                )}
                {cat.vagas && <span>{cat.vacancies} vagas</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}