# MarksDot

Сервис заметок и задач

## О проекте

Простой веб-сервис для управления заметками с поддержкой меток и статусов.

## Технологии

- Backend: Python 3.9+, Flask 2.3.0, SQLAlchemy 2.0.36, SQLite
- Frontend: HTML, CSS, JavaScript (Vanilla)
- CI/CD: GitHub Actions

## Требования

- Python 3.9 или выше (для Python 3.13 требуется SQLAlchemy 2.0.36+)

## Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/4iriks/marksd0t.git
cd marksd0t
```

### 2. Установить зависимости

```bash
cd backend
pip install -r requirements.txt
```

### 3. Запустить backend (Flask API)

```bash
# Из папки backend
python run.py
```

Backend запустится на `http://localhost:5000/api`

### 4. Запустить frontend (в отдельном терминале)

```bash
# Из корня проекта
cd frontend
python -m http.server 5500
```

Frontend будет доступен на `http://localhost:5500/`

### 5. Открыть приложение

Откройте в браузере: `http://localhost:5500/`

## API

- `GET /api/notes` - получить заметки
- `POST /api/notes` - создать заметку
- `PUT /api/notes/<id>` - обновить заметку
- `DELETE /api/notes/<id>` - удалить заметку
- `GET /api/tags` - получить метки

## Структура

```
marksdot/
├── backend/          # Backend на Flask
│   ├── app/         # Код приложения
│   └── tests/       # Тесты
└── frontend/        # Frontend
    ├── css/
    ├── js/
    └── index.html
```

## Git Flow

- `main` - production
- `develop` - разработка
- `feature/*` - новые функции
- `hotfix/*` - исправления

## Автор

[@4iriks](https://github.com/4iriks)
