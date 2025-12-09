let currentFilters = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    loadTags();
    setupEventListeners();
});

function setupEventListeners() {
    // Форма создания заметки
    document.getElementById('createNoteForm').addEventListener('submit', handleCreateNote);
    
    // Фильтры
    document.getElementById('filterStatus').addEventListener('change', handleFilterChange);
    document.getElementById('filterTag').addEventListener('change', handleFilterChange);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

async function handleCreateNote(e) {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value;
    const description = document.getElementById('noteDescription').value;
    const status = document.getElementById('noteStatus').value;
    const tagsInput = document.getElementById('noteTags').value;
    
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    try {
        await api.createNote({
            title,
            description,
            status,
            tags
        });
        
        // Очистка формы
        document.getElementById('createNoteForm').reset();
        
        // Перезагрузка списка
        await loadNotes();
        await loadTags();
        
        showNotification('Заметка создана!', 'success');
    } catch (error) {
        showNotification('Ошибка при создании заметки', 'error');
        console.error(error);
    }
}

async function loadNotes() {
    try {
        const notes = await api.getNotes(currentFilters);
        renderNotes(notes);
    } catch (error) {
        showNotification('Ошибка при загрузке заметок', 'error');
        console.error(error);
    }
}

function renderNotes(notes) {
    const container = document.getElementById('notesList');
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 Заметок пока нет</p>
                <p>Создайте первую заметку!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <div class="note-title">${escapeHtml(note.title)}</div>
                <span class="note-status status-${note.status.toLowerCase().replace(' ', '-')}">
                    ${note.status}
                </span>
            </div>
            ${note.description ? `<div class="note-description">${escapeHtml(note.description)}</div>` : ''}
            ${note.tags.length > 0 ? `
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            <div class="note-meta">
                Создано: ${formatDate(note.created_at)}
            </div>
            <div class="note-actions">
                <button onclick="editNote(${note.id})">Редактировать</button>
                <button class="btn-delete" onclick="deleteNote(${note.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

async function loadTags() {
    try {
        const tags = await api.getTags();
        const select = document.getElementById('filterTag');
        
        select.innerHTML = '<option value="">Все метки</option>' +
            tags.map(tag => `<option value="${escapeHtml(tag.name)}">${escapeHtml(tag.name)}</option>`).join('');
    } catch (error) {
        console.error('Ошибка при загрузке меток:', error);
    }
}

function handleFilterChange() {
    const status = document.getElementById('filterStatus').value;
    const tag = document.getElementById('filterTag').value;
    
    currentFilters = {};
    if (status) currentFilters.status = status;
    if (tag) currentFilters.tag = tag;
    
    loadNotes();
}

function resetFilters() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterTag').value = '';
    currentFilters = {};
    loadNotes();
}

async function deleteNote(id) {
    if (!confirm('Удалить эту заметку?')) return;
    
    try {
        await api.deleteNote(id);
        await loadNotes();
        await loadTags();
        showNotification('Заметка удалена', 'success');
    } catch (error) {
        showNotification('Ошибка при удалении', 'error');
        console.error(error);
    }
}

async function editNote(id) {
    // Простая реализация - можно улучшить
    const newTitle = prompt('Новый заголовок:');
    if (!newTitle) return;
    
    const newStatus = prompt('Новый статус (Новая/В работе/Завершена):');
    
    try {
        await api.updateNote(id, {
            title: newTitle,
            status: newStatus || 'Новая'
        });
        await loadNotes();
        showNotification('Заметка обновлена', 'success');
    } catch (error) {
        showNotification('Ошибка при обновлении', 'error');
        console.error(error);
    }
}

function showNotification(message, type) {
    // Простое уведомление через alert
    alert(message);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
}
