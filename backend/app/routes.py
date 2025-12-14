from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import Note, Tag

api = Blueprint('api', __name__, url_prefix='/api')


def _get_session() -> Session:
    """Создаём сессию БД с явным закрытием."""
    return SessionLocal()


@api.route('/notes', methods=['GET'])
def get_notes():
    """Получить все заметки с фильтрацией."""
    db = _get_session()
    try:
        query = db.query(Note)
        status = request.args.get('status')
        if status:
            query = query.filter(Note.status == status)
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
    finally:
        db.close()


@api.route('/notes', methods=['POST'])
def create_note():
    """Создать новую заметку."""
    db = _get_session()
    try:
        data = request.get_json(force=True) or {}
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        note = Note(
            title=data['title'],
            description=data.get('description', ''),
            status=data.get('status', 'Новая')
        )
        for tag_name in data.get('tags', []):
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
    finally:
        db.close()


@api.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id: int):
    """Обновить заметку."""
    db = _get_session()
    try:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        data = request.get_json(force=True) or {}
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
    finally:
        db.close()


@api.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id: int):
    """Удалить заметку."""
    db = _get_session()
    try:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        db.delete(note)
        db.commit()
        return '', 204
    finally:
        db.close()


@api.route('/tags', methods=['GET'])
def get_tags():
    """Получить список меток."""
    db = _get_session()
    try:
        tags = db.query(Tag).order_by(Tag.name).all()
        return jsonify([tag.name for tag in tags])
    finally:
        db.close()

