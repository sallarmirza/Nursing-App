import streamlit as st
from pages.dashboard import show_dashboard, show_health
from pages.login import show_login
from pages.nurse_setup import show_nurse_setup
from pages.patients import show_patients
from pages.dosage import show_dosage_calculator
from pages.drip import show_drip_calculator
from pages.notes import show_notes
from pages.vitals import show_vitals
from pages.medications import show_medications
from pages.sbar import show_sbar

st.set_page_config(
    page_title="Nursing App",
    layout='wide'
)

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "profile_complete" not in st.session_state:
    st.session_state.profile_complete = False

if not st.session_state.logged_in:
    show_login()
elif not st.session_state.profile_complete:
    show_nurse_setup()
else:
    st.sidebar.title('Drawer')

    page = st.sidebar.radio(
        "Navigation",
        ["Dashboard", "Patients",
         "Dosage Calculator",
         "IV Drip Calculator",
         "Nursing Notes",
         "Vitals",
         "Medications",
         "SBAR Handover"]
    )

    if st.sidebar.button("Logout"):
        st.session_state.logged_in = False
        st.session_state.profile_complete = False
        st.session_state.pop("nurse_id", None)
        st.rerun()

    if page == "Dashboard":
        show_health()
        show_dashboard()
    elif page == "Patients":
        show_patients()
    elif page == "Dosage Calculator":
        show_dosage_calculator()
    elif page == "IV Drip Calculator":
        show_drip_calculator()
    elif page == "Nursing Notes":
        show_notes()
    elif page == "Vitals":
        show_vitals()
    elif page == "Medications":
        show_medications()
    elif page == "SBAR Handover":
        show_sbar()