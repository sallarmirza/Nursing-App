import streamlit as st
from api.client import post


def show_login():
    st.title("Nursing App")

    tab_login, tab_signup = st.tabs(["Log In", "Sign Up"])

    with tab_login:
        with st.form("login_form"):
            email = st.text_input("Email", key="login_email")
            password = st.text_input("Password", type="password", key="login_password")
            submitted = st.form_submit_button("Log In")

        if submitted:
            if not email or not password:
                st.error("Enter complete data")
            else:
                resp = post("/nurse/login", {
                    "nurse_email": email,
                    "nurse_password": password
                })

                if resp.status_code == 200:
                    data = resp.json()
                    st.session_state.logged_in = True
                    st.session_state.nurse_id = data["nurse_id"]
                    st.session_state.nurse_email = email
                    # Login always lands on the Dashboard — only signup routes through setup
                    st.session_state.profile_complete = True
                    st.rerun()
                else:
                    st.error(resp.json().get("detail", "Login failed"))

    with tab_signup:
        with st.form("signup_form"):
            email = st.text_input("Email", key="signup_email")
            password = st.text_input("Password", type="password", key="signup_password")
            submitted = st.form_submit_button("Continue")

        if submitted:
            if not email or not password:
                st.error("Enter complete data")
            else:
                resp = post("/nurse/signup", {
                    "nurse_email": email,
                    "nurse_password": password
                })

                if resp.status_code == 200:
                    data = resp.json()
                    st.session_state.logged_in = True
                    st.session_state.nurse_id = data["nurse_id"]
                    st.session_state.nurse_email = email
                    st.success(f"Account created — Nurse ID: {data['nurse_id']}")
                    st.rerun()
                else:
                    st.error(resp.json().get("detail", "Sign Up failed"))