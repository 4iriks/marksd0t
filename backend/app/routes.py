from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from .database import get_db
from .models import Note, Tag

api = Blueprint('api', __name__, url_prefix='/api')
