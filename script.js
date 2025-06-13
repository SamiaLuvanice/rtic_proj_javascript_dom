// INICIALIZAÇÃO DO USUÁRIO

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


// VARIÁVEIS GLOBAIS E ELEMENTOS DO DOM

let selectedEmoji = null;

const emojiButtons = document.querySelectorAll('.emoji');
const saveBtn = document.getElementById('saveBtn');
const noteField = document.getElementById('note');
const dateField = document.getElementById('moodDate');
const diaryEntries = document.getElementById('diaryEntries');
const summaryElement = document.getElementById('emojiSummary');


// CARREGAR ENTRADAS SALVAS AO INICIAR

window.addEventListener('DOMContentLoaded', () => {
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || [];
  savedEntries.forEach(entry => renderEntry(entry));
  updateEmojiSummary();
});


// SELEÇÃO DE EMOJI

emojiButtons.forEach(button => {
  button.addEventListener('click', () => {
    emojiButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedEmoji = button.textContent;
  });
});


// SALVAR NOVA ENTRADA

saveBtn.addEventListener('click', () => {
  const note = noteField.value.trim();
  const rawDate = dateField.value;

  // Validações
  if (!selectedEmoji) {
    alert('Por favor, selecione um emoji para o seu humor.');
    return;
  }

  if (!rawDate) {
    alert('Por favor, selecione a data referente ao seu humor.');
    return;
  }

  const formattedDate = formatDate(rawDate);

  // Cria nova entrada
  const newEntry = {
    id: Date.now(),
    date: formattedDate,
    emoji: selectedEmoji,
    note: note || 'Sem comentário.'
  };

  // Salva no localStorage
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || []; // converte a string JSON para um array de objetos
  savedEntries.unshift(newEntry); //adiciona um item no início do array
  localStorage.setItem('diarioHumor', JSON.stringify(savedEntries));

  // Atualiza a interface
  renderEntry(newEntry);
  updateEmojiSummary();

  // Limpa campos
  noteField.value = '';
  dateField.value = '';
  selectedEmoji = null;
  emojiButtons.forEach(btn => btn.classList.remove('selected'));
});


// FUNÇÃO: FORMATA A DATA EM dd/mm/aaaa

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0"); //adc zero à esquerda para garantir dois dígitos
  const month = String(date.getMonth() + 1).padStart(2, "0"); //soma-se +1 para transformar em valores de 1 a 12
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


// FUNÇÃO: RENDERIZAR UMA ENTRADA NO DOM

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

  diaryEntries.prepend(entryDiv); // insere no topo
}


// FUNÇÃO: REMOVER ENTRADA

function removeEntry(id) {
  const savedEntries = JSON.parse(localStorage.getItem('diarioHumor')) || []; 
  const updatedEntries = savedEntries.filter(entry => entry.id !== id); //criar um novo array sem a entrada do id recebido
  localStorage.setItem('diarioHumor', JSON.stringify(updatedEntries));

  const entryDiv = document.querySelector(`.diary-entry[data-id="${id}"]`);
  if (entryDiv) {
    diaryEntries.removeChild(entryDiv);
  }

  updateEmojiSummary();
}


// FUNÇÃO: ATUALIZAR RESUMO DE EMOJIS

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
