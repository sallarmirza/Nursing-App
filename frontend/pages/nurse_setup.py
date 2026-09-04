import streamlit as st
from api.client import post


def show_nurse_setup():
    st.title("Complete Profile")    
    nurse_id=st.session_state.get("nurse_id","")
    st.caption(f"Nurse ID: {nurse_id}")
    
    with st.form("nurse_setup_form"):
        nurse_name=st.text_input('Full Name')
        nurse_qualification=st.text_input('Qualification')
        nurse_designation=st.text_input("Designation")
        nurse_hospital=st.text_input("Hospital")
        nurse_experience=st.number_input("Experience")
        nurse_ward=st.text_input("Ward")
        nurse_submit_button=st.form_submit_button("Save Profile")
        
    if nurse_submit_button:
        if not nurse_name:
            st.error('Full name is required')
            return
        payload={"nurse_name":nurse_name}
        
        if nurse_qualification:
            payload['nurse_qualification']=nurse_qualification
        if nurse_designation:
            payload['nurse_designation']=nurse_designation
        if nurse_experience:
            payload['nurse_experience']=nurse_experience
        if nurse_hospital:
            payload['nurse_hospital']=nurse_hospital
        if nurse_ward:
            payload['nurse_ward']=nurse_ward
        
        resp = post(f"/nurse/setup/{nurse_id}", payload)
        if resp.status_code == 200:
            st.session_state.profile_complete = True
            st.session_state.nurse_name = nurse_name
            st.success("Profile saved")
            st.rerun()
        else:
            st.error(resp.json().get("detail", "Failed to save profile"))
    
    if st.button("Skip for now"):
        st.session_state.profile_complete=True
        st.rerun()