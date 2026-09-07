import streamlit as st
from api.client import get, post, delete


def show_sbar():
    st.title("🔄 SBAR Handover")
    nurse_id = st.session_state.get("nurse_id", "")
    active_patient_id = st.session_state.get("active_patient_id", "")

    if active_patient_id:
        st.caption(f"Active patient: {st.session_state.get('active_patient_name')} ({active_patient_id})")
    else:
        st.warning("No active patient selected — go to Patients and click Select, or enter an ID manually below.")

    tab_create, tab_view, tab_delete = st.tabs(
        ["Create", "View", "Delete"]
    )

    with tab_create:
        with st.form("sbar_create_form"):
            patient_id = st.text_input("Patient ID", value=active_patient_id)
            situation = st.text_area("Situation")
            background = st.text_area("Background")
            assessment = st.text_area("Assessment")
            recommendation = st.text_area("Recommendation")
            submitted = st.form_submit_button("Create Handover")

        if submitted:
            payload = {
                "situation": situation,
                "background": background,
                "assessment": assessment,
                "recommendation": recommendation,
            }
            resp = post(f"/sbar/{nurse_id}/{patient_id}", payload)
            if resp.status_code == 201:
                st.success("SBAR created")
                st.json(resp.json())
            else:
                st.error(resp.json().get("detail", "Failed to create SBAR"))


    with tab_view:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="view_patient_id")
        if st.button("Load Handovers"):
            resp = get(f"/sbar/{nurse_id}/{patient_id}")
            if resp.status_code == 200:
                data = resp.json()
                handovers = data.get("handovers", [])
                if handovers:
                    st.dataframe(handovers, use_container_width=True)
                else:
                    st.info(data.get("message", "No SBAR handovers found"))
            else:
                st.error("Failed to load SBAR handovers")

    with tab_delete:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="del_patient_id")
        sbar_id = st.text_input("SBAR ID", key="del_sbar_id")
        if st.button("Delete Handover", type="primary"):
            resp = delete(f"/sbar/{nurse_id}/{patient_id}/{sbar_id}")
            if resp.status_code == 200:
                st.success("SBAR deleted")
            else:
                st.error(resp.json().get("detail", "Delete failed"))