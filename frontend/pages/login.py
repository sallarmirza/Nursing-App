import streamlit as st
from api.client import post

def show_login():
    st.title("Nursing App-Sign Up")
    st.caption("Login not working yet")
    
    with st.form("signup_form"):
        email=st.text_input("Email")
        password=st.text_input("Password",type="password")
        submitted=st.form_submit_button("Continue")
    
    if submitted:
        if not email or not password:
            st.error("Enter complete data")
        else:
            resp=post("/nurse/signup",{
                "nurse_email":email,
                "nurse_password":password
            })        
            
            if resp.status_code==200:
                data=resp.json()
                st.session_state.logged_in=True
                st.session_state.nurse_id=data["nurse_id"]
                st.session_state.nurse_email=email
                st.success(f"Account created-Nurse Id:{data['nurse_id']}")
                st.rerun()
            else:
                st.error(resp.json().get("detail","Sign Up failed"))
                