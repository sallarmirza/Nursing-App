import streamlit as st
from api.client import get, post, delete


def show_medications():
    st.title("💉 Medications")
    nurse_id = st.session_state.get("nurse_id", "")
    active_patient_id = st.session_state.get("active_patient_id", "")

    if active_patient_id:
        st.caption(f"Active patient: {st.session_state.get('active_patient_name')} ({active_patient_id})")
    else:
        st.warning("No active patient selected — go to Patients and click Select, or enter an ID manually below.")

    tab_add, tab_view, tab_delete = st.tabs(["Add Medication", "View Medications", "Delete Medication"])

    with tab_add:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="med_add_patient_id")

        med_name = st.text_input("Medication Name")
        col1, col2 = st.columns(2)
        with col1:
            dose = st.number_input("Dose", min_value=0.0, step=0.1)
        with col2:
            dose_unit = st.text_input("Dose Unit (e.g. mg)", value="mg")
        frequency = st.text_input("Frequency (e.g. Every 8 hours)")

        if st.button("Add Medication"):
            if not patient_id:
                st.error("Patient ID is required")
            elif not med_name:
                st.error("Enter a medication name")
            elif dose <= 0:
                st.error("Dose must be greater than 0")
            elif not frequency:
                st.error("Enter a frequency")
            else:
                # patient_id comes from the URL path only — never duplicated in the body
                payload = {
                    "med_name": med_name,
                    "dose": dose,
                    "dose_unit": dose_unit,
                    "frequency": frequency,
                }
                resp = post(f"/medications/{nurse_id}/{patient_id}", payload)
                if resp.status_code == 200:
                    st.success("Medication added")
                    st.json(resp.json())
                else:
                    st.error(resp.json().get("detail", "Failed to add medication"))

    with tab_view:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="med_view_patient_id")
        if st.button("Load Medications"):
            resp = get(f"/medications/{nurse_id}/{patient_id}")
            if resp.status_code == 200:
                data = resp.json()
                meds = data.get("medications", data if isinstance(data, list) else [])
                if meds:
                    st.dataframe(meds, use_container_width=True)
                else:
                    st.info("No medications found for this patient.")
            else:
                st.error(resp.json().get("detail", "Failed to load medications"))

    with tab_delete:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="med_delete_patient_id")
        cm_id = st.text_input("Medication Record ID (cm_id)")
        if st.button("Delete Medication", type="primary"):
            if not patient_id or not cm_id:
                st.error("Patient ID and Medication Record ID are required")
            else:
                resp = delete(f"/medications/{nurse_id}/{patient_id}/{cm_id}")
                if resp.status_code == 200:
                    st.success("Medication deleted")
                else:
                    st.error(resp.json().get("detail", "Delete failed"))