# MarksDot

Сервис заметок и задач

## О проекте

Простой веб-сервис для управления заметками с поддержкой меток и статусов.

## Технологии

- Backend: Python, Flask, SQLAlchemy, SQLite
- Frontend: HTML, CSS, JavaScript
- CI/CD: GitHub Actions

## Установка

```bash
# Клонировать репозиторий
git clone https://github.com/4iriks/marksdot.git
cd marksdot

# Установить зависимости
cd backend
pip install -r requirements.txt

# Запустить сервер
python run.py
```

Откройте `frontend/index.html` в браузере.

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
