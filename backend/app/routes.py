from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from .database import get_db
from .models import Note, Tag

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/notes', methods=['GET'])
def get_notes():
    """Получить все заметки с фильтрацией"""
    db = next(get_db())
    
    query = db.query(Note)
