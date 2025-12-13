from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from .database import get_db
from .models import Note, Tag

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/notes', methods=['POST'])
def create_note():
    """Создать новую заметку"""
    db = next(get_db())
    data = request.json
    
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    note = Note(
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'Новая')
    )
    
    # Добавляем метки
    tag_names = data.get('tags', [])
    for tag_name in tag_names:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
        note.tags.append(tag)
    
    db.add(note)
    db.commit()
    db.refresh(note)
    
    return jsonify({
        'id': note.id,
        'title': note.title,
        'description': note.description,
        'status': note.status,
        'tags': [tag.name for tag in note.tags],
        'created_at': note.created_at.isoformat(),
        'updated_at': note.updated_at.isoformat()
    }), 201
