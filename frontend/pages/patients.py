import streamlit as st
from api.client import get, post, delete


def show_patients():
    st.title("🧑‍🤝‍🧑 Patients")
    nurse_id = st.session_state.get("nurse_id", "")

    tab_list, tab_create, tab_delete = st.tabs(["All Patients", "Add Patient", "Delete Patient"])

    with tab_list:
        resp = get(f"/patient/{nurse_id}/all")
        if resp.status_code == 200:
            patients = resp.json()
            if patients:
                for p in patients:
                    col1, col2, col3 = st.columns([3, 2, 1])
                    with col1:
                        st.write(f"**{p['patient_name']}**  ·  {p['patient_id']}")
                    with col2:
                        st.write(f"{p.get('ward', '—')}")
                    with col3:
                        if st.button("Select", key=f"select_{p['patient_id']}"):
                            st.session_state.active_patient_id = p['patient_id']
                            st.session_state.active_patient_name = p['patient_name']
                            st.success(f"Active patient: {p['patient_name']}")
            else:
                st.info("No patients yet — add one from the 'Add Patient' tab.")
        else:
            st.error(resp.json().get("detail", "Failed to load patients"))

        if st.session_state.get("active_patient_id"):
            st.caption(f"Active patient: {st.session_state.get('active_patient_name')} ({st.session_state['active_patient_id']})")

    with tab_create:
        with st.form("create_patient_form"):
            patient_name = st.text_input("Full Name")
            gender = st.selectbox("Gender", ["Male", "Female", "Other"])
            date_of_birth = st.date_input("Date of Birth")
            patient_weight = st.number_input("Weight (kg)", min_value=0.0, step=0.1)
            patient_height = st.number_input("Height (cm)", min_value=0.0, step=0.1)
            patient_blood_group = st.selectbox(
                "Blood Group (optional)",
                ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
            )
            patient_ward = st.text_input("Ward (optional)")
            submitted = st.form_submit_button("Create Patient")

        if submitted:
            if not patient_name:
                st.error("Full name is required")
            else:
                payload = {
                    "patient_name": patient_name,
                    "gender": gender,
                    "date_of_birth": date_of_birth.isoformat(),
                    "patient_weight": patient_weight,
                    "patient_height": patient_height,
                }
                if patient_blood_group:
                    payload["patient_blood_group"] = patient_blood_group
                if patient_ward:
                    payload["patient_ward"] = patient_ward

                resp = post(f"/patient/create/{nurse_id}", payload)
                if resp.status_code == 200:
                    data = resp.json()
                    st.success("Patient created")
                    st.session_state.active_patient_id = data["patient_id"]
                    st.session_state.active_patient_name = patient_name
                    st.json(data)
                else:
                    st.error(resp.json().get("detail", "Patient not created"))

    with tab_delete:
        patient_id = st.text_input("Patient ID to delete")
        if st.button("Delete Patient", type="primary"):
            resp = delete(f"/patient/delete/{nurse_id}/{patient_id}")
            if resp.status_code == 200:
                st.success("Patient deleted")
                if st.session_state.get("active_patient_id") == patient_id:
                    st.session_state.pop("active_patient_id", None)
                    st.session_state.pop("active_patient_name", None)
                st.json(resp.json())
            else:
                st.error(resp.json().get("detail", "Delete failed"))