let currentFilters = {};

async function loadNotes() {
    const notes = await api.getNotes(currentFilters);
    renderNotes(notes);
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
                <button onclick="deleteNoteHandler(${note.id})" class="btn-delete">Удалить</button>
            </div>
        </div>
    `).join('');
}
