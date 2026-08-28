import streamlit as st
from api.client import get, post


def show_vitals():
    st.title("💓 Vitals")
    nurse_id = st.session_state.get("nurse_id", "")
    active_patient_id = st.session_state.get("active_patient_id", "")

    if active_patient_id:
        st.caption(f"Active patient: {st.session_state.get('active_patient_name')} ({active_patient_id})")
    else:
        st.warning("No active patient selected — go to Patients and click Select, or enter an ID manually below.")

    tab_add, tab_view = st.tabs(["Add Vitals", "View Vitals"])

    with tab_add:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="vitals_patient_id")

        note_options = []
        if patient_id:
            notes_resp = get(f"/notes/{nurse_id}/{patient_id}")
            if notes_resp.status_code == 200:
                note_options = [n["note_id"] for n in notes_resp.json().get("notes", [])]

        if note_options:
            note_id = st.selectbox("Note ID (from existing notes)", note_options)
        else:
            st.info("No existing notes for this patient — create one on the Nursing Notes page first, or enter a Note ID manually.")
            note_id = st.text_input("Note ID (manual)")

        source = st.selectbox("Source", ["Manual", "Monitor", "Device"])

        col1, col2, col3 = st.columns(3)
        with col1:
            heart_rate = st.number_input("Heart Rate (bpm)", min_value=0, step=1)
            temperature = st.number_input("Temperature (°C)", min_value=0.0, step=0.1)
        with col2:
            bp_systolic = st.number_input("BP Systolic", min_value=0, step=1)
            bp_diastolic = st.number_input("BP Diastolic", min_value=0, step=1)
        with col3:
            resp_rate = st.number_input("Respiratory Rate", min_value=0, step=1)
            spo2 = st.number_input("SpO2 (%)", min_value=0, max_value=100, step=1)

        if st.button("Save Vitals"):
            if not patient_id or not note_id:
                st.error("Patient ID and Note ID are required")
            else:
                vitals_data = {
                    "heart_rate": heart_rate,
                    "temperature": temperature,
                    "bp_systolic": bp_systolic,
                    "bp_diastolic": bp_diastolic,
                    "resp_rate": resp_rate,
                    "spo2": spo2,
                }
                payload = {
                    "source": source,
                    "vitals_data": vitals_data,
                }
                resp = post(f"/vitals/{nurse_id}/{patient_id}/{note_id}", payload)
                if resp.status_code == 200:
                    st.success("Vitals recorded")
                    st.json(resp.json())
                else:
                    st.error(resp.json().get("detail", "Failed to record vitals"))

    with tab_view:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="view_vitals_patient_id")
        if st.button("Load Vitals"):
            resp = get(f"/vitals/{nurse_id}/{patient_id}")
            if resp.status_code == 200:
                data = resp.json()
                records = data.get("vitals", [])
                if records:
                    st.dataframe(records, use_container_width=True)
                else:
                    st.info(data.get("message", "No vitals found"))
            else:
                st.error(resp.json().get("detail", "Failed to load vitals"))