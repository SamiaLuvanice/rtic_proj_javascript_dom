let selectedEmoji = null;

const emojiButtons = document.querySelectorAll('.emoji');
const saveBtn = document.getElementById('saveBtn');
const noteField = document.getElementById('note');
const diaryEntries = document.getElementById('diaryEntries');

// Carrega entradas do localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];
  savedEntries.forEach(entry => renderEntry(entry));
});

// Seleção do emoji
emojiButtons.forEach(button => {
  button.addEventListener('click', () => {
    emojiButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedEmoji = button.textContent;
  });
});

// Salvar entrada
saveBtn.addEventListener('click', () => {
  const note = noteField.value.trim();
  if (!selectedEmoji) {
    alert('Por favor, selecione um emoji para o seu humor.');
    return;
  }

  const today = new Date();
  const dateString = today.toLocaleDateString('pt-BR');

  const newEntry = {
    id: Date.now(), // ID único
    date: dateString,
    emoji: selectedEmoji,
    note: note || 'Sem comentário.'
  };

  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];
  savedEntries.unshift(newEntry);
  localStorage.setItem('diarioHumor', JSON.stringify(savedEntries));

  renderEntry(newEntry);

  noteField.value = '';
  selectedEmoji = null;
  emojiButtons.forEach(btn => btn.classList.remove('selected'));
});

// Função para renderizar uma entrada no DOM
function renderEntry(entry) {
  const entryDiv = document.createElement('div');
  entryDiv.className = 'diary-entry';
  entryDiv.dataset.id = entry.id; // armazenar o id no DOM

  entryDiv.innerHTML = `
    <strong>${entry.date}</strong> - ${entry.emoji}
    <p>${entry.note}</p>
    <button class="removeBtn">Remover</button>
  `;

  // Evento de remover
  entryDiv.querySelector('.removeBtn').addEventListener('click', () => {
    removeEntry(entry.id);
  });

  diaryEntries.prepend(entryDiv);
}

// Função para remover a entrada
function removeEntry(id) {
  // Remover do localStorage
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];
  const updatedEntries = savedEntries.filter(entry => entry.id !== id);
  localStorage.setItem('diarioHumor', JSON.stringify(updatedEntries));

  // Remover do DOM
  const entryDiv = document.querySelector(`.diary-entry[data-id="${id}"]`);
  if (entryDiv) {
    diaryEntries.removeChild(entryDiv);
  }
}
