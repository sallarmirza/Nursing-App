import json
import streamlit as st
from api.client import get, post, delete


def show_notes():
    st.title("📝 Nursing Notes")
    nurse_id = st.session_state.get("nurse_id", "")
    active_patient_id = st.session_state.get("active_patient_id", "")

    if active_patient_id:
        st.caption(f"Active patient: {st.session_state.get('active_patient_name')} ({active_patient_id})")
    else:
        st.warning("No active patient selected — go to Patients and click Select, or enter an ID manually below.")

    tab_create, tab_soap, tab_view, tab_delete = st.tabs(
        ["Create Note", "Add SOAP", "View Notes", "Delete Note"]
    )

    with tab_create:
        with st.form("create_note_form"):
            patient_id = st.text_input("Patient ID", value=active_patient_id)
            patient_condition = st.selectbox(
                "Patient Condition",
                ["Stable", "Improving", "Under Consideration", "Critical"]
            )
            conscious_level = st.selectbox(
                "Level of Consciousness",
                ["Alert", "Responds to Voice", "Responds to Pain", "Unresponsive"]
            )
            glasgow_coma_score = st.number_input("Glasgow Coma Score", min_value=3, max_value=15, step=1, value=15)
            pain_scale = st.slider("Pain Scale", 0, 10, 0)
            submitted = st.form_submit_button("Create Note")

        if submitted:
            payload = {
                "patient_condition": patient_condition,
                "conscious_level": conscious_level,
                "glasgow_coma_score": glasgow_coma_score,
                "pain_scale": pain_scale,
            }
            resp = post(f"/notes/{nurse_id}/{patient_id}", payload)
            if resp.status_code == 200:
                st.success("Note created")
                st.json(resp.json())
            else:
                st.error(resp.json().get("detail", "Failed to create note"))

    with tab_soap:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="soap_patient_id")

        note_options = []
        if patient_id:
            notes_resp = get(f"/notes/{nurse_id}/{patient_id}")
            if notes_resp.status_code == 200:
                note_options = [n["note_id"] for n in notes_resp.json().get("notes", [])]

        if note_options:
            note_id = st.selectbox("Note ID", note_options, key="soap_note_id")
        else:
            st.info("No existing notes for this patient — create one in the 'Create Note' tab first.")
            note_id = st.text_input("Note ID (manual)", key="soap_note_id_manual")

        subjective = st.text_area("Subjective")
        objective = st.text_area("Objective")
        assessment = st.text_area("Assessment")
        plan = st.text_area("Plan")

        if st.button("Save SOAP"):
            if not patient_id or not note_id:
                st.error("Patient ID and Note ID are required")
            else:
                payload = {
                    "Subjective": subjective,
                    "Objective": objective,
                    "Assessment": assessment,
                    "Plan": plan,
                }
                resp = post(f"/notes/{nurse_id}/{patient_id}/{note_id}/soap", payload)
                if resp.status_code == 200:
                    st.success("SOAP note saved")
                    st.json(resp.json())
                else:
                    st.error(resp.json().get("detail", "Failed to save SOAP"))

    with tab_view:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="view_patient_id")
        if st.button("Load Notes"):
            resp = get(f"/notes/{nurse_id}/{patient_id}")
            if resp.status_code == 200:
                data = resp.json()
                notes = data.get("notes", [])
                if notes:
                    for note in notes:
                        header = (
                            f"{note['note_id']} · "
                            f"{note.get('patient_condition', '')} · "
                            f"{note.get('notes_created_at', '')}"
                        )
                        with st.expander(header):
                            st.write(f"**Conscious Level:** {note.get('conscious_level', '—')}")
                            st.write(f"**Glasgow Coma Score:** {note.get('glasgow_coma_score', '—')}")
                            st.write(f"**Pain Scale:** {note.get('pain_scale', '—')}")

                            soap_raw = note.get("soap_history")
                            soap_list = (
                                json.loads(soap_raw)
                                if isinstance(soap_raw, str)
                                else (soap_raw or [])
                            )

                            if soap_list:
                                st.markdown(f"**SOAP History ({len(soap_list)} entries)**")
                                for entry in soap_list:
                                    st.markdown(
                                        f"— **v{entry['version']}** · "
                                        f"{entry['created_at']} · by {entry['nurse_id']}"
                                    )
                                    st.write(f"S: {entry['subjective']}")
                                    st.write(f"O: {entry['objective']}")
                                    st.write(f"A: {entry['assessment']}")
                                    st.write(f"P: {entry['plan']}")
                                    st.divider()
                            else:
                                st.caption("No SOAP entries yet for this note.")
                else:
                    st.info(data.get("message", "No notes found"))
            else:
                st.error(resp.json().get("detail", "Failed to load notes"))

    with tab_delete:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="delete_note_patient_id")

        note_options = []
        if patient_id:
            notes_resp = get(f"/notes/{nurse_id}/{patient_id}")
            if notes_resp.status_code == 200:
                note_options = [n["note_id"] for n in notes_resp.json().get("notes", [])]

        if note_options:
            note_id = st.selectbox("Note ID", note_options, key="delete_note_id")
        else:
            st.info("No existing notes for this patient.")
            note_id = st.text_input("Note ID (manual)", key="delete_note_id_manual")

        if st.button("Delete Note", type="primary"):
            if not patient_id or not note_id:
                st.error("Patient ID and Note ID are required")
            else:
                # param order now matches every other notes route: /notes/{nurse_id}/{patient_id}/...
                resp = delete(f"/notes/{nurse_id}/{patient_id}/{note_id}")
                if resp.status_code == 200:
                    st.success("Note deleted")
                else:
                    st.error(resp.json().get("detail", "Delete failed"))