"use client";

import React, { useState } from "react";
import { Lang, Theme, FormDataState, DiagnosisResult } from "../types/thyroid";
import { translations } from "../locales/translations";
import { Header } from "../components/Header";
import { DemographicSection } from "../components/DemographicSection";
import { BiologySection } from "../components/BiologySection";
import { ClinicalSection } from "../components/ClinicalSection";
import { ResultCard } from "../components/ResultCard";

const INITIAL_FORM: FormDataState = {
  patient_id: "",
  age: "",
  sexe: 1,
  tsh: "",
  t3: "",
  tt4: "",
  t4u: "",
  fti: "",
  pregnant: false,
  sick: false,
  on_thyroxine: false,
  query_on_thyroxine: false,
  antithyroid_medication: false,
  thyroid_surgery: false,
  i131: false,
  lithium: false,
  goitre: false,
  tumor: false,
  hypopituitary: false,
  psych_condition: false,
  query_hypo: false,
  query_hyper: false,
};

export default function ThyroidPage() {
  const [lang, setLang] = useState<Lang>("fr");
  const [theme, setTheme] = useState<Theme>("light");
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const t = translations[lang];

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();

    // Seuls l'ID et l'Âge sont strictement obligatoires
    if (!formData.patient_id.trim() || formData.age === "") {
      setFormError(
        lang === "fr"
          ? "Merci de renseigner au moins l'identifiant et l'âge du patient."
          : "Please fill in at least the patient ID and age."
      );
      return;
    }

    setFormError(null);
    setLoading(true);
    setResult(null);

    // Si une valeur biologique est vide (""), on envoie null à l'API
    const payload = {
      ...formData,
      tsh: formData.tsh === "" ? null : formData.tsh,
      t3: formData.t3 === "" ? null : formData.t3,
      tt4: formData.tt4 === "" ? null : formData.tt4,
      t4u: formData.t4u === "" ? null : formData.t4u,
      fti: formData.fti === "" ? null : formData.fti,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: DiagnosisResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-stone-950" : "bg-stone-100"}`}>
      <main className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <Header
          lang={lang}
          theme={theme}
          onToggleLang={setLang}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          t={{ title: t.title, subtitle: t.subtitle }}
        />

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-6 sm:px-10">
          <form onSubmit={handleDiagnose} className="divide-y divide-stone-200 dark:divide-stone-800">
            <DemographicSection
              patientId={formData.patient_id}
              age={formData.age}
              sexe={formData.sexe}
              onChange={handleFieldChange}
              labels={{
                title: t.patientInfo,
                id: t.patientId,
                age: t.age,
                sex: t.sex,
                male: t.male,
                female: t.female,
              }}
            />

            <BiologySection
              tsh={formData.tsh}
              t3={formData.t3}
              tt4={formData.tt4}
              t4u={formData.t4u}
              fti={formData.fti}
              onChange={handleFieldChange}
              labels={{
                title: t.biology,
                tsh: t.tsh,
                t3: t.t3,
                tt4: t.tt4,
                t4u: t.t4u,
                fti: t.fti,
              }}
            />

            <ClinicalSection
              formData={formData}
              onChange={handleFieldChange}
              title={t.clinical}
              labels={{
                pregnant: t.pregnant,
                sick: t.sick,
                lithium: t.lithium,
                i131: t.i131,
                surgery: t.surgery,
                goitre: t.goitre,
                tumor: t.tumor,
                hypopituitary: t.hypopituitary,
                psych: t.psych,
                queryHypo: t.queryHypo,
                queryHyper: t.queryHyper,
              }}
            />

            <div className="py-7">
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-11 bg-teal-700 text-white text-sm font-medium tracking-wide transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-800"
                }`}
              >
                {loading ? t.analyzing : t.submit}
              </button>
              {formError && (
                <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">{formError}</p>
              )}
            </div>
          </form>

          {result && (
            <div className="pb-8">
              <ResultCard
                result={result}
                labels={{
                  title: t.resultsTitle,
                  healthy: t.statusHealthy,
                  disorder: t.statusDisorder,
                  hypo: t.hypoDetected,
                  hyper: t.hyperDetected,
                  normalAxis: t.normalAxis,
                  antecedentsTitle: t.antecedentsTitle,
                  noAntecedents: t.noAntecedents,
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}