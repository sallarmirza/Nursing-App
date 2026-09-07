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
    layout="wide",
)

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "profile_complete" not in st.session_state:
    st.session_state.profile_complete = False

if "current_page" not in st.session_state:
    st.session_state.current_page = None

PAGES = [
    {"number": 1, "name": "Patients", "icon": "🧑‍🤝‍🧑"},
    {"number": 2, "name": "Dosage Calculator", "icon": "💊"},
    {"number": 3, "name": "IV Drip Calculator", "icon": "💉"},
    {"number": 4, "name": "Nursing Notes", "icon": "📝"},
    {"number": 5, "name": "Vitals", "icon": "❤️"},
    {"number": 6, "name": "Medications", "icon": "💊"},
    {"number": 7, "name": "SBAR Handover", "icon": "🔁"},
]


def show_grid_dashboard():
    st.title("Dashboard")
    show_health()

    st.markdown("### Select a module")

    cols_per_row = 4
    rows = [PAGES[i:i + cols_per_row] for i in range(0, len(PAGES), cols_per_row)]

    for row in rows:
        cols = st.columns(cols_per_row)
        for col, page in zip(cols, row):
            with col:
                label = f"{page['icon']}\n\n**{page['number']}. {page['name']}**"
                if st.button(label, key=f"nav_{page['number']}", use_container_width=True):
                    st.session_state.current_page = page["name"]
                    st.rerun()

    st.divider()
    show_dashboard()


if not st.session_state.logged_in:
    show_login()
elif not st.session_state.profile_complete:
    show_nurse_setup()
else:
    st.sidebar.title("Nursing App")
    if st.sidebar.button("🏠 Home / Dashboard", use_container_width=True):
        st.session_state.current_page = None
        st.rerun()

    if st.sidebar.button("Logout", use_container_width=True):
        st.session_state.logged_in = False
        st.session_state.profile_complete = False
        st.session_state.current_page = None
        st.session_state.pop("nurse_id", None)
        st.rerun()

    page = st.session_state.current_page

    if page is None:
        show_grid_dashboard()
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

    if page is not None:
        st.divider()
        if st.button("← Back to Dashboard"):
            st.session_state.current_page = None
            st.rerun()