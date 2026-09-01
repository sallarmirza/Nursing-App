import streamlit as st
from api.client import get


def show_health():
    st.title("🏥 Nursing Dashboard")

    try:
        response = get("/nurse/all")
        if response.status_code == 200:
            st.success("Backend connected")
        else:
            st.error(f"Backend returned {response.status_code}")
    except Exception:
        st.error("Could not connect to FastAPI backend")


def _count_from(resp, key):
    """Safely pull a count from a list-shaped or dict-shaped JSON response."""
    if resp.status_code != 200:
        return 0
    try:
        data = resp.json()
    except ValueError:
        return 0
    if isinstance(data, list):
        return len(data)
    if isinstance(data, dict):
        return len(data.get(key, []))
    return 0


def _gather_dashboard_stats(nurse_id):
    patients_resp = get(f"/patient/{nurse_id}/all")
    patients = patients_resp.json() if patients_resp.status_code == 200 else []
    patient_ids = [p["patient_id"] for p in patients] if isinstance(patients, list) else []

    totals = {
        "patients": len(patient_ids),
        "notes": 0,
        "vitals": 0,
        "sbar": 0,
        "medications": 0,
        "drip_calcs": 0,
        "dosage_calcs": 0,
    }

    for pid in patient_ids:
        totals["notes"] += _count_from(get(f"/notes/{nurse_id}/{pid}"), "notes")
        totals["vitals"] += _count_from(get(f"/vitals/{nurse_id}/{pid}"), "vitals")
        totals["sbar"] += _count_from(get(f"/sbar/{nurse_id}/{pid}"), "handovers")
        totals["medications"] += _count_from(get(f"/medications/{nurse_id}/{pid}"), "medications")
        # nurse_id scoping added to list_drip_cal / list_dosage_cal — must be included here
        totals["drip_calcs"] += _count_from(get(f"/calc/drip/{nurse_id}/{pid}"), "drips")
        totals["dosage_calcs"] += _count_from(get(f"/calc/dose/{nurse_id}/{pid}"), "dosages")

    return totals


def show_dashboard():
    st.title("Dashboard")

    nurse_id = st.session_state.get("nurse_id", "")

    if not nurse_id:
        st.warning("No nurse logged in.")
        return

    if "dashboard_stats" not in st.session_state:
        st.session_state.dashboard_stats = None

    col_refresh, _ = st.columns([1, 5])
    with col_refresh:
        if st.button("🔄 Refresh"):
            with st.spinner("Loading stats across all patients..."):
                st.session_state.dashboard_stats = _gather_dashboard_stats(nurse_id)

    stats = st.session_state.dashboard_stats

    if stats is None:
        st.info("Click Refresh to load dashboard stats.")
        return

    row1 = st.columns(3)
    row1[0].metric("Patients", stats["patients"])
    row1[1].metric("Nursing Notes", stats["notes"])
    row1[2].metric("Vitals Recorded", stats["vitals"])

    row2 = st.columns(3)
    row2[0].metric("SBAR Handovers", stats["sbar"])
    row2[1].metric("Medications", stats["medications"])
    row2[2].metric("Calculations Saved", stats["drip_calcs"] + stats["dosage_calcs"])

    st.caption(
        "Counts are aggregated across every patient assigned to this nurse. "
        "Click Refresh to update after adding new records."
    )