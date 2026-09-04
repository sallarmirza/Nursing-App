import streamlit as st
from api.client import get, post, delete


def show_patients():
    st.title("🧑‍🤝‍🧑 Patients")
    nurse_id = st.session_state.get("nurse_id", "")

    tab_list,view_patient, tab_create, tab_delete = st.tabs(["All Patients","View Patient", "Add Patient", "Delete Patient"])

    with tab_list:
        resp = get(f"/patient/{nurse_id}/all")
        if resp.status_code == 200:
            patients = resp.json()
            if patients:
                for p in patients:
                    col1, col2, col3 = st.columns([3, 2, 1])
                    with col1:
                        st.write(f"**{p['patient_name']}**")
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

        with view_patient:
            active_id = st.session_state.get("active_patient_id")

            if not active_id:
                st.info("Select a patient from the 'All Patients' tab first.")
            else:
                resp = get(f"/patient/view/{nurse_id}/{active_id}")
                if resp.status_code == 200:
                    p = resp.json()
                    st.write(p)
                    st.subheader(f"{p['patient_name']}  ·  {p['patient_id']}")
                    col1, col2, col3 = st.columns(3)
                    col1.write(f"**Gender:** {p.get('patient_gender', '—')}")
                    col2.write(f"**DOB:** {p.get('date_of_birth', '—')}")
                    col3.write(f"**Ward:** {p.get('ward', '—')}")

                    col4, col5, col6 = st.columns(3)
                    col4.write(f"**Weight:** {p.get('patient_weight') or '—'}")
                    col5.write(f"**Height:** {p.get('patient_height') or '—'}")
                    col6.write(f"**Blood Group:** {p.get('patient_blood_group') or '—'}")

                    st.divider()

                    st.markdown("**Vitals**")
                    if p.get("vitals"):
                        for v in p["vitals"]:
                            st.write(f"- {v['recorded_at']} — {v['source']}: {v['vitals_data']}")
                    else:
                        st.caption("Not taken")

                    st.markdown("**Nursing Notes**")
                    if p.get("nursing_notes"):
                        for n in p["nursing_notes"]:
                            st.write(f"- {n['notes_created_at']}: {n.get('patient_condition') or '—'}")
                    else:
                        st.caption("Not attempted")

                    st.markdown("**Current Medications**")
                    if p.get("medications"):
                        for m in p["medications"]:
                            st.write(f"- {m['med_name']} — {m['dose']}{m['dose_unit']} ({m['frequency']})")
                    else:
                        st.caption("None recorded")

                    st.markdown("**SBAR Handovers**")
                    if p.get("sbar_handovers"):
                        for s in p["sbar_handovers"]:
                            st.write(f"- {s['sbar_created_at']}: {s.get('situation') or '—'}")
                    else:
                        st.caption("Not attempted")

                    st.markdown("**Dosage Calculations**")
                    if p.get("dosage_calculations"):
                        for d in p["dosage_calculations"]:
                            st.write(f"- {d['medication']}: {d['dose_per_kg']} {d['dose_unit']}/kg")
                    else:
                        st.caption("Not attempted")

                    st.markdown("**Drip Calculations**")
                    if p.get("drip_calculations"):
                        for dr in p["drip_calculations"]:
                            st.write(f"- {dr['total_volume_ml']}mL over {dr['time_duration_min']}min")
                    else:
                        st.caption("Not attempted")
                else:
                    st.error(resp.json().get("detail", "Failed to load patient info"))
                    
                
    with tab_create:
       with st.form("create_patient_form"):
        patient_first_name = st.text_input("First Name")
        patient_last_name = st.text_input("Last Name")
        gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        date_of_birth = st.date_input("Date of Birth", value=None)
        patient_weight = st.number_input("Weight (kg)", min_value=0.0, step=0.1, value=None)
        patient_height = st.number_input("Height (cm)", min_value=0.0, step=0.1, value=None)
        patient_blood_group = st.selectbox(
            "Blood Group",
            ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        )
        patient_ward = st.text_input("Ward ")
        submitted = st.form_submit_button("Create Patient")

    if submitted:
        if not patient_first_name or not patient_last_name:
            st.error("First and last name are required")
        else:
            payload = {
                "patient_first_name": patient_first_name,
                "patient_last_name": patient_last_name,
                "gender": gender,
            }
            if date_of_birth:
                payload["date_of_birth"] = date_of_birth.isoformat()
            if patient_weight:
                payload["patient_weight"] = patient_weight
            if patient_height:
                payload["patient_height"] = patient_height
            if patient_blood_group:
                payload["patient_blood_group"] = patient_blood_group
            if patient_ward:
                payload["patient_ward"] = patient_ward

            resp = post(f"/patient/create/{nurse_id}", payload)
            if resp.status_code == 200:
                data = resp.json()
                st.success("Patient created")
                st.session_state.active_patient_id = data["patient_id"]
                st.session_state.active_patient_name = f"{patient_first_name} {patient_last_name}".strip()
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