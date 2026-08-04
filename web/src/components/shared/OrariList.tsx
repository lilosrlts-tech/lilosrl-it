export function OrariList({ righe }: { righe: string[] }) {
  return (
    <ul className="mt-1 space-y-0.5 text-slate-700">
      {righe.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  );
}
