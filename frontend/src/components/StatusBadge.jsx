const CONFIG = {
  pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Aprovado', className: 'bg-green-100 text-green-800' },
  cancelded: { label: 'Reprovado', className: 'bg-red-100 text-red-800' },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? { label: status, className: 'bg-slate-100 text-slate-700' };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}