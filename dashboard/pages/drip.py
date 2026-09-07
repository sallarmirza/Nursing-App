import streamlit as st
from api.client import get, post, delete


def show_drip_calculator():
    st.title("💧 IV Drip Calculator")
    st.caption("Reference tool only — always verify against prescriber orders and facility policy.")

    nurse_id = st.session_state.get("nurse_id", "")
    active_patient_id = st.session_state.get("active_patient_id", "")

    if active_patient_id:
        st.caption(f"Active patient: {st.session_state.get('active_patient_name')} ({active_patient_id})")
    else:
        st.warning("No active patient selected — go to Patients and click Select, or enter an ID manually below.")

    tab_quick, tab_save, tab_history, tab_delete = st.tabs(
        ["Quick Calculate", "Calculate & Save", "History", "Delete"]
    )

    with tab_quick:
        st.caption("Calculates without saving — no patient required.")
        col1, col2, col3 = st.columns(3)
        with col1:
            total_volume = st.number_input("Total Volume (mL)", min_value=0.0, step=1.0, key="quick_volume")
        with col2:
            time_duration_min = st.number_input("Time Duration (min)", min_value=0.0, step=1.0, key="quick_time")
        with col3:
            drop_factor = st.number_input("Drop Factor (gtt/mL)", min_value=0.0, step=1.0, value=20.0, key="quick_drop")

        if st.button("Calculate", key="calc_quick_drip"):
            if total_volume <= 0 or time_duration_min <= 0:
                st.error("Enter a valid volume and time duration")
            else:
                payload = {
                    "total_volume": total_volume,
                    "time_duration_min": time_duration_min,
                    "drop_factor": drop_factor,
                }
                resp = post("/calc/drip/calculate", payload)
                if resp.status_code == 200:
                    result = resp.json()
                    st.metric("Drip Rate", f"{result['drop_rate_gtt_min']} gtt/min")
                else:
                    st.error(resp.json().get("detail", "Calculation failed"))

    with tab_save:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="drip_save_patient_id")
        col1, col2, col3 = st.columns(3)
        with col1:
            total_volume = st.number_input("Total Volume (mL)", min_value=0.0, step=1.0, key="save_volume")
        with col2:
            time_duration_min = st.number_input("Time Duration (min)", min_value=0.0, step=1.0, key="save_time")
        with col3:
            drop_factor = st.number_input("Drop Factor (gtt/mL)", min_value=0.0, step=1.0, value=20.0, key="save_drop")

        if st.button("Calculate & Save"):
            if not patient_id:
                st.error("Patient ID is required")
            elif total_volume <= 0 or time_duration_min <= 0:
                st.error("Enter a valid volume and time duration")
            else:
                payload = {
                    "total_volume": total_volume,
                    "time_duration_min": time_duration_min,
                    "drop_factor": drop_factor,
                }
                resp = post(f"/calc/drip/{nurse_id}/{patient_id}", payload)
                if resp.status_code == 200:
                    result = resp.json()
                    st.success("Drip rate calculated and saved")
                    st.metric("Drip Rate", f"{result['drop_rate_gtt_min']} gtt/min")
                    st.json(result)
                else:
                    st.error(resp.json().get("detail", "Calculation failed"))

    with tab_history:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="drip_history_patient_id")
        if st.button("Load History"):
            resp = get(f"/calc/drip/{nurse_id}/{patient_id}")
            if resp.status_code == 200:
                data = resp.json()
                drips = data.get("drips", [])
                if drips:
                    st.dataframe(drips, use_container_width=True)
                else:
                    st.info(data.get("message", "No drip calculations found"))
            else:
                st.error(resp.json().get("detail", "Failed to load history"))

    with tab_delete:
        patient_id = st.text_input("Patient ID", value=active_patient_id, key="drip_delete_patient_id")
        drip_calc_id = st.text_input("Drip Calculation ID")
        if st.button("Delete Calculation", type="primary"):
            if not patient_id or not drip_calc_id:
                st.error("Patient ID and Drip Calculation ID are required")
            else:
                resp = delete(f"/calc/drip/{nurse_id}/{patient_id}/{drip_calc_id}")
                if resp.status_code == 200:
                    st.success("Drip calculation deleted")
                else:
                    st.error(resp.json().get("detail", "Delete failed"))