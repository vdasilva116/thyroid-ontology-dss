import os
import uuid
import subprocess
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from owlready2 import *

app = FastAPI(title="Thyroid Diagnosis API with Pellet")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ONTO_PATH = os.path.join(BASE_DIR, "thyroid_model.owl")
EXCEL_FILE = os.path.join(BASE_DIR, "dataset_thyroid.xlsx")

EXCEL_COLUMNS = [
    "Patient_ID", "Age", "Sexe", "Pregnant", "Sick", "On_Thyroxine",
    "Query_On_Thyroxine", "Antithyroid_Medication", "Thyroid_Surgery",
    "I131_Treatment", "Lithium", "Goitre", "Tumor", "Hypopituitary",
    "Psych_Condition", "TSH_Measured", "TSH_Value", "T3_Measured", "T3_Value",
    "TT4_Measured", "TT4_Value", "T4U_Measured", "T4U_Value", "FTI_Measured",
    "FTI_Value", "Query_Hypothyroid", "Query_Hyperthyroid", "BinaryClass"
]

class PatientData(BaseModel):
    patient_id: str
    age: float
    sexe: float
    tsh: Optional[float] = None
    t3: Optional[float] = None
    tt4: Optional[float] = None
    t4u: Optional[float] = None
    fti: Optional[float] = None
    pregnant: bool = False
    sick: bool = False
    on_thyroxine: bool = False
    query_on_thyroxine: bool = False
    antithyroid_medication: bool = False
    thyroid_surgery: bool = False
    i131: bool = False
    lithium: bool = False
    goitre: bool = False
    tumor: bool = False
    hypopituitary: bool = False
    psych_condition: bool = False
    query_hypo: bool = False
    query_hyper: bool = False


def upsert_to_excel(data: PatientData, binary_class: int):
    new_record = {
        "Patient_ID": str(data.patient_id).strip(),
        "Age": float(data.age),
        "Sexe": float(data.sexe),
        "Pregnant": 1 if data.pregnant else 0,
        "Sick": 1 if data.sick else 0,
        "On_Thyroxine": 1 if data.on_thyroxine else 0,
        "Query_On_Thyroxine": 1 if data.query_on_thyroxine else 0,
        "Antithyroid_Medication": 1 if data.antithyroid_medication else 0,
        "Thyroid_Surgery": 1 if data.thyroid_surgery else 0,
        "I131_Treatment": 1 if data.i131 else 0,
        "Lithium": 1 if data.lithium else 0,
        "Goitre": 1 if data.goitre else 0,
        "Tumor": 1 if data.tumor else 0,
        "Hypopituitary": 1 if data.hypopituitary else 0,
        "Psych_Condition": 1 if data.psych_condition else 0,
        "TSH_Measured": 1 if data.tsh is not None else 0,
        "TSH_Value": float(data.tsh) if data.tsh is not None else 0.0,
        "T3_Measured": 1 if data.t3 is not None else 0,
        "T3_Value": float(data.t3) if data.t3 is not None else 0.0,
        "TT4_Measured": 1 if data.tt4 is not None else 0,
        "TT4_Value": float(data.tt4) if data.tt4 is not None else 0.0,
        "T4U_Measured": 1 if data.t4u is not None else 0,
        "T4U_Value": float(data.t4u) if data.t4u is not None else 0.0,
        "FTI_Measured": 1 if data.fti is not None else 0,
        "FTI_Value": float(data.fti) if data.fti is not None else 0.0,
        "Query_Hypothyroid": 1 if data.query_hypo else 0,
        "Query_Hyperthyroid": 1 if data.query_hyper else 0,
        "BinaryClass": int(binary_class),
    }

    try:
        if os.path.exists(EXCEL_FILE):
            df = pd.read_excel(EXCEL_FILE, dtype={"Patient_ID": str})
            pid = new_record["Patient_ID"]
            if pid in df["Patient_ID"].values:
                idx = df.index[df["Patient_ID"] == pid].tolist()[0]
                for col in EXCEL_COLUMNS:
                    df.at[idx, col] = new_record[col]
            else:
                new_df = pd.DataFrame([new_record], columns=EXCEL_COLUMNS)
                df = pd.concat([df, new_df], ignore_index=True)
        else:
            df = pd.DataFrame([new_record], columns=EXCEL_COLUMNS)

        df.to_excel(EXCEL_FILE, index=False, engine="openpyxl")
    except Exception as e:
        print(f"[EXCEL ERROR] : {e}")


def explain_pellet_error(world: World):
    """Exécute 'pellet explain' pour afficher la source exacte de l'incohérence."""
    try:
        import tempfile
        import glob
        owlready_pellet_dir = os.path.dirname(owlready2.reasoning.__file__)
        jars = glob.glob(os.path.join(owlready_pellet_dir, "pellet", "*.jar"))
        classpath = ":".join(jars)

        with tempfile.NamedTemporaryFile(suffix=".nt", delete=False) as tmp:
            world.save(tmp.name, format="ntriples")
            cmd = ["java", "-Xmx2000M", "-cp", classpath, "pellet.Pellet", "explain", tmp.name]
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            print("\n" + "="*60)
            print("🔍 EXPLICATION DÉTAILLÉE DU CONFLIT PAR PELLET :")
            print(res.stdout if res.stdout else res.stderr)
            print("="*60 + "\n")
            os.unlink(tmp.name)
    except Exception as ex:
        print(f"Impossible d'exécuter pellet explain: {ex}")


@app.post("/api/diagnose")
def diagnose(data: PatientData):
    world = World()
    onto = world.get_ontology(f"file://{os.path.abspath(ONTO_PATH)}").load()
    
    PatientClass = None
    for cls in onto.classes():
        if cls.name == "Patient" or str(cls.iri).endswith("#Patient"):
            PatientClass = cls
            break

    if not PatientClass:
        return {
            "status": "Erreur",
            "details": {
                "hypothyroidism": False,
                "hyperthyroidism": False,
                "other_diseases": [],
                "antecedents": ["Erreur : Classe Patient introuvable dans l'ontologie"]
            }
        }
            
    unique_instance_id = f"Patient_Eval_{uuid.uuid4().hex[:6]}"

    with onto:
        p = PatientClass(unique_instance_id)

        # Affectation directe des types stricts
        p.has_Patient_ID = [str(data.patient_id)]
        p.has_Age = [float(data.age)]
        p.has_Sexe = [float(data.sexe)]

        p.has_TSH_Value = [float(data.tsh) if data.tsh is not None else 0.0]
        p.has_T3_Value = [float(data.t3) if data.t3 is not None else 0.0]
        p.has_TT4_Value = [float(data.tt4) if data.tt4 is not None else 0.0]
        p.has_T4U_Value = [float(data.t4u) if data.t4u is not None else 0.0]
        p.has_FTI_Value = [float(data.fti) if data.fti is not None else 0.0]

        p.has_TSH_Measured = [1 if data.tsh is not None else 0]
        p.has_T3_Measured = [1 if data.t3 is not None else 0]
        p.has_TT4_Measured = [1 if data.tt4 is not None else 0]
        p.has_T4U_Measured = [1 if data.t4u is not None else 0]
        p.has_FTI_Measured = [1 if data.fti is not None else 0]

        p.has_Pregnant = [1 if data.pregnant else 0]
        p.has_Sick = [1 if data.sick else 0]
        p.has_Lithium = [1 if data.lithium else 0]
        p.has_I131_Treatment = [1 if data.i131 else 0]
        p.has_Thyroid_Surgery = [1 if data.thyroid_surgery else 0]
        p.has_Goitre = [1 if data.goitre else 0]
        p.has_Tumor = [1 if data.tumor else 0]
        p.has_Hypopituitary = [1 if data.hypopituitary else 0]
        p.has_Psych_Condition = [1 if data.psych_condition else 0]
        p.has_On_Thyroxine = [1 if data.on_thyroxine else 0]
        p.has_Query_On_Thyroxine = [1 if data.query_on_thyroxine else 0]
        p.has_Antithyroid_Medication = [1 if data.antithyroid_medication else 0]
        p.has_Query_Hypothyroid = [1 if data.query_hypo else 0]
        p.has_Query_Hyperthyroid = [1 if data.query_hyper else 0]

        is_inconsistent = False
        try:
            sync_reasoner_pellet(
                world,
                infer_property_values=True,
                infer_data_property_values=False
            )
        except OwlReadyInconsistentOntologyError:
            is_inconsistent = True
            explain_pellet_error(world)
        except Exception as e:
            print("Erreur Pellet générale :", e)
            is_inconsistent = True

    if is_inconsistent:
        return {
            "status": "Incohérence ontologique",
            "details": {
                "hypothyroidism": False,
                "hyperthyroidism": False,
                "other_diseases": [],
                "antecedents": ["Pellet: conflit d'axiomes détecté"]
            }
        }

    # Extraction élargie (nom d'entité, IRI ou string brute)
    binary_raw = [str(v).split("#")[-1] for v in getattr(p, "has_Binary_Class", [])]
    classes_raw = [str(c).split("#")[-1] for c in p.is_a]
    hypo_deductions = [str(v).split("#")[-1] for v in getattr(p, "has_Hypothyroidism", [])]
    hyper_deductions = [str(v).split("#")[-1] for v in getattr(p, "has_Hyperthyroidism", [])]
    disease_deductions = [str(v).split("#")[-1] for v in getattr(p, "has_Thyroid_Disease", [])]
    antecedent_deductions = [str(v).split("#")[-1] for v in getattr(p, "has_Antecedent", [])]
    
    # Vérification croisée sur la relation has_Binary_Class ET la classification de type
    is_disorder = (
        any("Disorder" in x for x in binary_raw)
        or any("Disorder" in x for x in classes_raw)
        or any("Hypothyroidism_Yes" in x for x in hypo_deductions)
        or any("Hyperthyroidism_Yes" in x for x in hyper_deductions)
    )

    is_healthy = (
        any("Healthy" in x for x in binary_raw)
        or any("Healthy" in x for x in classes_raw)
    )

    if is_disorder:
        status = "Disorder"
        binary_class = 1
    elif is_healthy:
        status = "Healthy"
        binary_class = 0
    else:
        status = "Non déterminé"
        binary_class = 0

    details = {
        "hypothyroidism": any("Hypothyroidism_Yes" in x for x in hypo_deductions),
        "hyperthyroidism": any("Hyperthyroidism_Yes" in x for x in hyper_deductions),
        "other_diseases": disease_deductions,
        "antecedents": antecedent_deductions,
    }

    upsert_to_excel(data, binary_class)
    print(f" Diagnostic terminé : {status} (binary={binary_class})")
    return {
        "status": status,
        "details": details,
    }