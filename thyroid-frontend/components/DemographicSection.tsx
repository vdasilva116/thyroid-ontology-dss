import React from "react";

interface Props {
  patientId: string;
  age: number | "";
  sexe: number;
  onChange: (field: string, value: string | number) => void;
  labels: { title: string; id: string; age: string; sex: string; male: string; female: string };
}

export const DemographicSection: React.FC<Props> = ({
  patientId,
  age,
  sexe,
  onChange,
  labels,
}) => {
  return (
    <section className="py-7">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-xs text-teal-700 dark:text-teal-500 tabular-nums">01</span>
        <h2 className="font-serif text-base text-stone-800 dark:text-stone-100">{labels.title}</h2>
        <span className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            {labels.id}
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => onChange("patient_id", e.target.value)}
            placeholder="P-101"
            className="w-full h-9 border-b border-stone-300 dark:border-stone-700 bg-transparent px-0.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            {labels.age}
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => onChange("age", e.target.value === "" ? "" : parseFloat(e.target.value))}
            placeholder="40"
            className="w-full h-9 border-b border-stone-300 dark:border-stone-700 bg-transparent px-0.5 text-sm font-mono tabular-nums text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            {labels.sex}
          </label>
          <select
            value={sexe}
            onChange={(e) => onChange("sexe", parseFloat(e.target.value))}
            className="w-full h-9 border-b border-stone-300 dark:border-stone-700 bg-transparent px-0.5 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 transition-colors"
          >
            <option value={1}>{labels.female}</option>
            <option value={0}>{labels.male}</option>
          </select>
        </div>
      </div>
    </section>
  );
};