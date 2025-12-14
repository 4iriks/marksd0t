let currentFilters = {};

async function loadNotes() {
    const notes = await api.getNotes(currentFilters);
    renderNotes(notes);
}
