import React from "react";
import { DiagnosisResult } from "../types/thyroid";

interface Props {
  result: DiagnosisResult;
  labels: {
    title: string;
    healthy: string;
    disorder: string;
    hypo: string;
    hyper: string;
    normalAxis: string;
    antecedentsTitle: string;
    noAntecedents: string;
  };
}

export const ResultCard: React.FC<Props> = ({ result, labels }) => {
  const isHealthy = result.status === "Healthy";
  const accent = isHealthy
    ? "border-emerald-600 dark:border-emerald-500"
    : "border-amber-600 dark:border-amber-500";
  const statusColor = isHealthy
    ? "text-emerald-700 dark:text-emerald-400"
    : "text-amber-700 dark:text-amber-400";

  return (
    <div className={`border-l-4 ${accent} pl-6 py-1`}>
      <span className="text-xs text-stone-500 dark:text-stone-400">{labels.title}</span>
      <h3 className={`font-serif text-2xl mt-0.5 ${statusColor}`}>
        {isHealthy ? labels.healthy : labels.disorder}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mt-5 pt-5 border-t border-stone-200 dark:border-stone-800 text-sm">
        <div>
          <span className="block text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            Axe biologique
          </span>
          {result.details.hypothyroidism && (
            <p className="text-amber-700 dark:text-amber-400">{labels.hypo}</p>
          )}
          {result.details.hyperthyroidism && (
            <p className="text-amber-700 dark:text-amber-400">{labels.hyper}</p>
          )}
          {!result.details.hypothyroidism && !result.details.hyperthyroidism && (
            <p className="text-stone-600 dark:text-stone-400">{labels.normalAxis}</p>
          )}
        </div>

        <div>
          <span className="block text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            {labels.antecedentsTitle}
          </span>
          {result.details.antecedents.length > 0 ? (
            <ul className="space-y-1 text-stone-700 dark:text-stone-300">
              {result.details.antecedents.map((item, idx) => (
                <li key={idx}>{item.replace("_", " ")}</li>
              ))}
            </ul>
          ) : (
            <p className="text-stone-500 dark:text-stone-400">{labels.noAntecedents}</p>
          )}
        </div>
      </div>
    </div>
  );
};
