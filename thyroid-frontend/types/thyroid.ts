export type Lang = "fr" | "en";
export type Theme = "light" | "dark";

export interface FormDataState {
  patient_id: string;
  age: number | "";
  sexe: number;
  tsh: number | "";
  t3: number | "";
  tt4: number | "";
  t4u: number | "";
  fti: number | "";
  pregnant: boolean;
  sick: boolean;
  on_thyroxine: boolean;
  query_on_thyroxine: boolean;
  antithyroid_medication: boolean;
  thyroid_surgery: boolean;
  i131: boolean;
  lithium: boolean;
  goitre: boolean;
  tumor: boolean;
  hypopituitary: boolean;
  psych_condition: boolean;
  query_hypo: boolean;
  query_hyper: boolean;
}

export interface DiagnosisResult {
  status: "Healthy" | "Disorder" | "Non déterminé" | "Incohérence ontologique";
  details: {
    hypothyroidism: boolean;
    hyperthyroidism: boolean;
    other_diseases: string[];
    antecedents: string[];
  };
}