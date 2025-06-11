// =====================
// INICIALIZAÇÃO DO USUÁRIO
// =====================

const greetingElement = document.getElementById('greeting');

let userName = localStorage.getItem('nomeUsuario');

// Solicita o nome do usuário, se não estiver salvo
if (!userName || userName.trim() === "") {
  userName = prompt("Olá! Qual é o seu nome?");
  if (userName && userName.trim() !== "") {
    localStorage.setItem('nomeUsuario', userName);
  } else {
    userName = "Visitante";
  }
}

// Exibe saudação personalizada
greetingElement.textContent = `Bem-vindo(a), ${userName || "Visitante"}!`;


// =====================
// VARIÁVEIS GLOBAIS E ELEMENTOS DO DOM
// =====================

let selectedEmoji = null;

const emojiButtons = document.querySelectorAll('.emoji');
const saveBtn = document.getElementById('saveBtn');
const noteField = document.getElementById('note');
const dateField = document.getElementById('moodDate'); // <- novo campo de data
const diaryEntries = document.getElementById('diaryEntries');
const summaryElement = document.getElementById('emojiSummary');


// =====================
// CARREGAR ENTRADAS SALVAS AO INICIAR
// =====================

window.addEventListener('DOMContentLoaded', () => {
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];
  savedEntries.forEach(entry => renderEntry(entry));
  updateEmojiSummary();
});


// =====================
// SELEÇÃO DE EMOJI
// =====================

emojiButtons.forEach(button => {
  button.addEventListener('click', () => {
    emojiButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedEmoji = button.textContent;
  });
});


// =====================
// SALVAR NOVA ENTRADA
// =====================

saveBtn.addEventListener('click', () => {
  const note = noteField.value.trim();
  const rawDate = dateField.value;

  if (!selectedEmoji) {
    alert('Por favor, selecione um emoji para o seu humor.');
    return;
  }

  if (!rawDate) {
    alert('Por favor, selecione a data referente ao seu humor.');
    return;
  }

  const formattedDate = formatDate(rawDate);

  const newEntry = {
    id: Date.now(),
    date: formattedDate,
    emoji: selectedEmoji,
    note: note || 'Sem comentário.'
  };

  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];
  savedEntries.unshift(newEntry);
  localStorage.setItem('diarioHumor', JSON.stringify(savedEntries));

  renderEntry(newEntry);
  updateEmojiSummary();

  noteField.value = '';
  dateField.value = '';
  selectedEmoji = null;
  emojiButtons.forEach(btn => btn.classList.remove('selected'));
});


// =====================
// FUNÇÃO: FORMATA A DATA EM dd/mm/aaaa
// =====================

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


// =====================
// FUNÇÃO: RENDERIZAR UMA ENTRADA NO DOM
// =====================

function renderEntry(entry) {
  const entryDiv = document.createElement('div');
  entryDiv.className = 'diary-entry';
  entryDiv.dataset.id = entry.id;

  entryDiv.innerHTML = `
    <strong>${entry.date}</strong> - ${entry.emoji}
    <p>${entry.note}</p>
    <button class="removeBtn">Remover</button>
  `;

  entryDiv.querySelector('.removeBtn').addEventListener('click', () => {
    removeEntry(entry.id);
  });

  diaryEntries.prepend(entryDiv);
}


// =====================
// FUNÇÃO: REMOVER ENTRADA
// =====================

function removeEntry(id) {
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];
  const updatedEntries = savedEntries.filter(entry => entry.id !== id);
  localStorage.setItem('diarioHumor', JSON.stringify(updatedEntries));

  const entryDiv = document.querySelector(`.diary-entry[data-id="${id}"]`);
  if (entryDiv) {
    diaryEntries.removeChild(entryDiv);
  }

  updateEmojiSummary();
}


// =====================
// FUNÇÃO: ATUALIZAR RESUMO DE EMOJIS
// =====================

function updateEmojiSummary() {
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];

  const emojiCounts = {};

  savedEntries.forEach(entry => {
    emojiCounts[entry.emoji] = (emojiCounts[entry.emoji] || 0) + 1;
  });

  summaryElement.innerHTML = Object.entries(emojiCounts)
    .map(([emoji, count]) => `<span>${emoji}: ${count}</span>`)
    .join(' ') || '<span>Nenhuma entrada ainda.</span>';
}
