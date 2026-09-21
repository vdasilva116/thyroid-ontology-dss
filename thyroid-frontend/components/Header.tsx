import React from "react";
import { Lang, Theme } from "../types/thyroid";

interface HeaderProps {
  lang: Lang;
  theme: Theme;
  onToggleLang: (lang: Lang) => void;
  onToggleTheme: () => void;
  t: { title: string; subtitle: string };
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  t,
}) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-50">
          {t.title}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t.subtitle}</p>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-center gap-0.5">
          {(["fr", "en"] as Lang[]).map((l, i) => (
            <React.Fragment key={l}>
              {i > 0 && <span className="text-stone-300 dark:text-stone-700">/</span>}
              <button
                type="button"
                onClick={() => onToggleLang(l)}
                className={`px-1.5 py-0.5 font-medium transition-colors ${
                  lang === l
                    ? "text-teal-700 dark:text-teal-400"
                    : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                }`}
              >
                {l}
              </button>
            </React.Fragment>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 underline decoration-stone-300 dark:decoration-stone-700 underline-offset-4 transition-colors"
        >
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
        </button>
      </div>
    </header>
  );
};
