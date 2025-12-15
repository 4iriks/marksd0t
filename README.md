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

---

## Deployment на публичный сервер

### Требования для production:

1. **Открыть порты в firewall:**

   Linux (Ubuntu/Debian):
   ```bash
   sudo ufw allow 5000
   sudo ufw allow 5500
   sudo ufw reload
   ```

   Windows Server:
   ```powershell
   netsh advfirewall firewall add rule name="Flask API" dir=in action=allow protocol=TCP localport=5000
   netsh advfirewall firewall add rule name="Frontend" dir=in action=allow protocol=TCP localport=5500
   ```

2. **Запуск на публичном IP:**

   Backend автоматически слушает на всех интерфейсах (`0.0.0.0`).
   
   Frontend нужно запускать с параметром `--bind`:
   ```bash
   cd frontend
   python3 -m http.server 5500 --bind 0.0.0.0
   ```

3. **Доступ к приложению:**

   Откройте в браузере: `http://YOUR_SERVER_IP:5500/`
   
   API автоматически определит правильный адрес сервера.

### Важно для production:

- ⚠️ **Debug mode отключён** в `backend/run.py` (для безопасности)
- 🔒 Рекомендуется настроить **HTTPS** с сертификатом (Let's Encrypt)
- 🚀 Для высоких нагрузок используйте **Gunicorn** + **Nginx** вместо встроенных серверов

---

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
