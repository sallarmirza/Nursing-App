import streamlit as st
from api.client import get


def _check_backend():
    try:
        response = get("/nurse/all")
        return response.status_code == 200
    except Exception:
        return False


def show_health():
    """Slim connection indicator, no longer takes over the page with its own title."""
    connected = _check_backend()
    if connected:
        st.caption("🟢 Backend connected")
    else:
        st.caption("🔴 Could not reach backend — some data may be stale or unavailable")


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
        totals["drip_calcs"] += _count_from(get(f"/calc/drip/{nurse_id}/{pid}"), "drips")
        totals["dosage_calcs"] += _count_from(get(f"/calc/dose/{nurse_id}/{pid}"), "dosages")

    return totals


def show_dashboard():
    nurse_id = st.session_state.get("nurse_id", "")
    nurse_name = st.session_state.get("nurse_name", "")

    if not nurse_id:
        st.warning("No nurse logged in.")
        return

    # Greeting header
    greeting_col, refresh_col = st.columns([5, 1])
    with greeting_col:
        st.subheader(f"Welcome back{', ' + nurse_name if nurse_name else ''} 👋")
        show_health()
    with refresh_col:
        st.write("")
        refresh_clicked = st.button("🔄 Refresh", use_container_width=True)

    if "dashboard_stats" not in st.session_state:
        st.session_state.dashboard_stats = None

    # Auto-load on first visit, or when refresh is clicked
    if refresh_clicked or st.session_state.dashboard_stats is None:
        with st.spinner("Loading stats across all patients..."):
            st.session_state.dashboard_stats = _gather_dashboard_stats(nurse_id)

    stats = st.session_state.dashboard_stats

    st.divider()

    if stats["patients"] == 0:
        st.info("No patients assigned yet. Add a patient to start seeing activity here.")
        return

    # Primary stat cards
    st.markdown("#### Overview")
    row1 = st.columns(3)
    row1[0].metric("🧑‍🤝‍🧑 Patients", stats["patients"])
    row1[1].metric("📝 Nursing Notes", stats["notes"])
    row1[2].metric("❤️ Vitals Recorded", stats["vitals"])

    row2 = st.columns(3)
    row2[0].metric("🔁 SBAR Handovers", stats["sbar"])
    row2[1].metric("💊 Medications", stats["medications"])
    row2[2].metric("🧮 Calculations Saved", stats["drip_calcs"] + stats["dosage_calcs"])

    # Breakdown chart
    st.markdown("#### Activity breakdown")
    chart_data = {
        "Notes": stats["notes"],
        "Vitals": stats["vitals"],
        "SBAR": stats["sbar"],
        "Medications": stats["medications"],
        "Drip Calcs": stats["drip_calcs"],
        "Dosage Calcs": stats["dosage_calcs"],
    }
    st.bar_chart(chart_data)

    st.caption(
        "Counts are aggregated across every patient assigned to this nurse. "
        "Click Refresh to update after adding new records."
    )