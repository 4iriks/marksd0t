from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from .database import get_db
from .models import Note, Tag
from datetime import datetime

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    """Обновить заметку"""
    db = next(get_db())
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if not note:
        return jsonify({'error': 'Note not found'}), 404
