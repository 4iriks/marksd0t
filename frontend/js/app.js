let currentFilters = {};
let editingNoteId = null;

async function loadNotes() {
    const notes = await api.getNotes(currentFilters);
    renderNotes(notes);
}

async function loadTags() {
    try {
        const tags = await api.getTags();
        const filterTag = document.getElementById('filterTag');
        // Сохраняем текущее значение
        const currentValue = filterTag.value;
        // Очищаем и добавляем опции
        filterTag.innerHTML = '<option value="">Все метки</option>';
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            filterTag.appendChild(option);
        });
        // Восстанавливаем выбранное значение
        filterTag.value = currentValue;
    } catch (error) {
        console.error('Ошибка загрузки меток:', error);
    }
}

function renderNotes(notes) {
    const container = document.getElementById('notesList');
    if (notes.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;">Заметок пока нет</p>';
        return;
    }
    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <h4>${note.title}</h4>
            <p>${note.description || 'Без описания'}</p>
            <div class="note-meta">
                <span class="status-badge">${note.status}</span>
                ${note.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
            </div>
            <div class="note-actions">
                <button onclick="editNoteHandler(${note.id})" class="btn-edit">Редактировать</button>
                <button onclick="deleteNoteHandler(${note.id})" class="btn-delete">Удалить</button>
            </div>
        </div>
    `).join('');
}


document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const noteData = {
        title: document.getElementById('noteTitle').value,
        description: document.getElementById('noteDescription').value,
        status: document.getElementById('noteStatus').value,
        tags: document.getElementById('noteTags').value.split(',').map(t => t.trim()).filter(t => t)
    };
    
    if (editingNoteId) {
        // Режим редактирования
        await api.updateNote(editingNoteId, noteData);
        editingNoteId = null;
        document.querySelector('.note-form h2').textContent = 'Создать заметку';
        document.querySelector('.note-form button[type="submit"]').textContent = 'Добавить заметку';
    } else {
        // Режим создания
        await api.createNote(noteData);
    }
    
    e.target.reset();
    loadNotes();
    loadTags();
});

async function editNoteHandler(id) {
    try {
        // Получаем все заметки и находим нужную
        const notes = await api.getNotes();
        const note = notes.find(n => n.id === id);
        
        if (!note) {
            alert('Заметка не найдена');
            return;
        }
        
        // Заполняем форму данными заметки
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteDescription').value = note.description || '';
        document.getElementById('noteStatus').value = note.status;
        document.getElementById('noteTags').value = note.tags.join(', ');
        
        // Меняем заголовок и кнопку формы
        document.querySelector('.note-form h2').textContent = 'Редактировать заметку';
        document.querySelector('.note-form button[type="submit"]').textContent = 'Сохранить изменения';
        
        // Сохраняем ID редактируемой заметки
        editingNoteId = id;
        
        // Прокручиваем к форме
        document.querySelector('.note-form').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Ошибка при загрузке заметки:', error);
        alert('Не удалось загрузить заметку для редактирования');
    }
}

async function deleteNoteHandler(id) {
    if (confirm('Удалить заметку?')) {
        await api.deleteNote(id);
        loadNotes();
        loadTags();
    }
}

document.getElementById('filterStatus').addEventListener('change', (e) => {
    currentFilters.status = e.target.value || undefined;
    loadNotes();
});

document.getElementById('filterTag').addEventListener('change', (e) => {
    currentFilters.tag = e.target.value || undefined;
    loadNotes();
});

document.getElementById('resetFilters').addEventListener('click', () => {
    currentFilters = {};
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterTag').value = '';
    loadNotes();
});

// Инициализация при загрузке страницы
loadNotes();
loadTags();
