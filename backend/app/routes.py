from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from .database import get_db
from .models import Note, Tag
from datetime import datetime

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/notes', methods=['GET'])
def get_notes():
    """Получить все заметки с фильтрацией"""
    db = next(get_db())
    
    query = db.query(Note)
    
    # Фильтрация по статусу
    status = request.args.get('status')
    if status:
        query = query.filter(Note.status == status)
    
    # Фильтрация по метке
    tag = request.args.get('tag')
    if tag:
        query = query.join(Note.tags).filter(Tag.name == tag)
    
    notes = query.order_by(Note.created_at.desc()).all()
    
    return jsonify([{
        'id': note.id,
        'title': note.title,
        'description': note.description,
        'status': note.status,
        'tags': [tag.name for tag in note.tags],
        'created_at': note.created_at.isoformat(),
        'updated_at': note.updated_at.isoformat()
    } for note in notes])


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


@api.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    """Обновить заметку"""
    db = next(get_db())
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if not note:
        return jsonify({'error': 'Note not found'}), 404
    
    data = request.json
    
    if 'title' in data:
        if not data['title']:
            return jsonify({'error': 'Title cannot be empty'}), 400
        note.title = data['title']
    
    if 'description' in data:
        note.description = data['description']
    
    if 'status' in data:
        note.status = data['status']
    
    if 'tags' in data:
        note.tags.clear()
        for tag_name in data['tags']:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
            note.tags.append(tag)
    
    note.updated_at = datetime.utcnow()
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
    })



@api.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    """Удалить заметку"""
    db = next(get_db())
    note = db.query(Note).filter(Note.id == note_id).first()
