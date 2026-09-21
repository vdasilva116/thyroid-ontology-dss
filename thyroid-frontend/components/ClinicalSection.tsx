import React from "react";
import { FormDataState } from "../types/thyroid";

interface Props {
  formData: FormDataState;
  onChange: (field: string, value: boolean) => void;
  title: string;
  labels: Record<string, string>;
}

export const ClinicalSection: React.FC<Props> = ({
  formData,
  onChange,
  title,
  labels,
}) => {
  const items = [
    { key: "pregnant", label: labels.pregnant },
    { key: "sick", label: labels.sick },
    { key: "lithium", label: labels.lithium },
    { key: "i131", label: labels.i131 },
    { key: "thyroid_surgery", label: labels.surgery },
    { key: "goitre", label: labels.goitre },
    { key: "tumor", label: labels.tumor },
    { key: "hypopituitary", label: labels.hypopituitary },
    { key: "psych_condition", label: labels.psych },
    { key: "query_hypo", label: labels.queryHypo },
    { key: "query_hyper", label: labels.queryHyper },
  ];

  return (
    <section className="py-7">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-xs text-teal-700 dark:text-teal-500 tabular-nums">03</span>
        <h2 className="font-serif text-base text-stone-800 dark:text-stone-100">{title}</h2>
        <span className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3.5">
        {items.map(({ key, label }) => {
          const checked = Boolean(formData[key as keyof FormDataState]);
          return (
            <label key={key} className="flex items-center gap-2.5 text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(key, e.target.checked)}
                className="h-4 w-4 rounded-none border-stone-400 dark:border-stone-600 accent-teal-700 focus:ring-0"
              />
              <span
                className={`transition-colors ${
                  checked
                    ? "text-stone-900 dark:text-stone-100"
                    : "text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300"
                }`}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
};
