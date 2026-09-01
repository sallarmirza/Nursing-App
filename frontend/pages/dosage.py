import streamlit as st
from api.client import get, post, delete


def show_dosage_calculator():
    st.title("💊 Dosage Calculator")
    st.caption("Reference tool only — always verify against prescriber orders and facility policy.")

    nurse_id = st.session_state.get("nurse_id", "")
    active_patient_id = st.session_state.get("active_patient_id", "")

    if active_patient_id:
        st.caption(f"Active patient: {st.session_state.get('active_patient_name')} ({active_patient_id})")
    else:
        st.warning("No active patient selected — go to Patients and click Select, or enter an ID manually below.")

    tab_calc, tab_history, tab_delete = st.tabs(["Calculate & Save", "History", "Delete"])

    with tab_calc:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="dose_patient_id")

        col1, col2 = st.columns(2)
        with col1:
            medication = st.text_input("Medication Name")
            patient_weight = st.number_input("Patient Weight (kg)", min_value=0.0, step=0.1)
            dose_per_kg = st.number_input("Ordered Dose (per kg)", min_value=0.0, step=0.01, format="%.2f")
            dose_unit = st.text_input("Dose Unit (e.g. mg)", value="mg")
        with col2:
            concentration_value = st.number_input("Drug Concentration (value)", min_value=0.0, step=0.1)
            concentration_unit = st.text_input("Concentration Unit (e.g. mg/mL)", value="mg/mL")

        if st.button("Calculate & Save"):
            if not patient_id:
                st.error("Patient ID is required")
            elif not medication:
                st.error("Enter a medication name")
            elif patient_weight <= 0 or dose_per_kg <= 0:
                st.error("Enter a valid weight and dose per kg")
            elif concentration_value <= 0:
                st.error("Concentration must be greater than 0")
            else:
                payload = {
                    "patient_weight": patient_weight,
                    "medication": medication,
                    "concentration_value": concentration_value,
                    "concentration_unit": concentration_unit,
                    "dose_per_kg": dose_per_kg,
                    "dose_unit": dose_unit,
                }
                resp = post(f"/calc/dose/{nurse_id}/{patient_id}", payload)
                if resp.status_code == 200:
                    result = resp.json()
                    st.success("Dosage calculated and saved")
                    col_a, col_b = st.columns(2)
                    col_a.metric("Required Dose", f"{result['required_dose']:.2f} {result['dose_unit']}")
                    col_b.metric("Volume to Administer", f"{result['volume_to_administer_ml']:.2f} mL")
                    st.json(result)
                else:
                    st.error(resp.json().get("detail", "Calculation failed"))

    with tab_history:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="dose_history_patient_id")
        if st.button("Load History"):
            resp = get(f"/calc/dose/{nurse_id}/{patient_id}")
            if resp.status_code == 200:
                data = resp.json()
                dosages = data.get("dosages", [])
                if dosages:
                    st.dataframe(dosages, use_container_width=True)
                else:
                    st.info(data.get("message", "No dosage calculations found"))
            else:
                st.error(resp.json().get("detail", "Failed to load history"))

    with tab_delete:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="dose_delete_patient_id")
        dose_calc_id = st.text_input("Dosage Calculation ID")
        if st.button("Delete Calculation", type="primary"):
            if not patient_id or not dose_calc_id:
                st.error("Patient ID and Dosage Calculation ID are required")
            else:
                resp = delete(f"/calc/dose/{nurse_id}/{patient_id}/{dose_calc_id}")
                if resp.status_code == 200:
                    st.success("Dosage calculation deleted")
                else:
                    st.error(resp.json().get("detail", "Delete failed"))