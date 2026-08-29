from fastapi import APIRouter, HTTPException, status

from nursing_notes.notes_service import Notes
from storage import DBManager
from schema.note_schema import (
    NursingNoteRegister,
    NursingNotesResponse,
    SoapRegister,
)

db = DBManager()
notes = Notes(db)

router = APIRouter()


@router.post("/{nurse_id}/{patient_id}")
def create_nursing_note(
    nurse_id: str,
    patient_id: str,
    data: NursingNoteRegister
):
    try:
        return notes.create_notes(
            nurse_id=nurse_id,
            patient_id=patient_id,
            data=data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{nurse_id}/{patient_id}/{note_id}/soap")
def save_soap(
    nurse_id: str,
    patient_id: str,
    note_id: str,
    data: SoapRegister
):
    try:
        return notes.register_soap(
            nurse_id=nurse_id,
            patient_id=patient_id,
            note_id=note_id,
            data=data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
        
        
@router.get('/{nurse_id}/{patient_id}')
def show_notes(nurse_id: str, patient_id: str):
    """return the notes"""
    try:
        return notes.show_nursing_notes(
            nurse_id=nurse_id,
            patient_id=patient_id
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{note_id}/{nurse_id}/{patient_id}")
def remove_notes(
    note_id: str,
    nurse_id: str,
    patient_id: str
):
    try:
        return notes.delete_notes(
            nurse_id=nurse_id,
            patient_id=patient_id,
            note_id=note_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )