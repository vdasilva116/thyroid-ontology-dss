import React from "react";

interface Props {
  tsh: number | "";
  t3: number | "";
  tt4: number | "";
  t4u: number | "";
  fti: number | "";
  onChange: (field: string, value: number | "") => void;
  labels: { title: string; tsh: string; t3: string; tt4: string; t4u: string; fti: string };
}

export const BiologySection: React.FC<Props> = ({
  tsh,
  t3,
  tt4,
  t4u,
  fti,
  onChange,
  labels,
}) => {
  const fields = [
    { key: "tsh", label: labels.tsh, val: tsh, step: "0.01", placeholder: "2.5" },
    { key: "t3", label: labels.t3, val: t3, step: "0.01", placeholder: "1.8" },
    { key: "tt4", label: labels.tt4, val: tt4, step: "0.1", placeholder: "100" },
    { key: "t4u", label: labels.t4u, val: t4u, step: "0.01", placeholder: "1.0" },
    { key: "fti", label: labels.fti, val: fti, step: "0.1", placeholder: "100" },
  ];

  return (
    <section className="py-7">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-xs text-teal-700 dark:text-teal-500 tabular-nums">02</span>
        <h2 className="font-serif text-base text-stone-800 dark:text-stone-100">{labels.title}</h2>
        <span className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-5 gap-y-6">
        {fields.map(({ key, label, val, step, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1.5">
              {label}
            </label>
            <input
              type="number"
              step={step}
              value={val}
              onChange={(e) => onChange(key, e.target.value === "" ? "" : parseFloat(e.target.value))}
              placeholder={placeholder}
              className="w-full h-9 border-b border-stone-300 dark:border-stone-700 bg-transparent px-0.5 text-sm font-mono tabular-nums text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 transition-colors"
            />
          </div>
        ))}
      </div>
    </section>
  );
};