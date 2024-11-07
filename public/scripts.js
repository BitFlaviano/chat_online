const socket = io();
let userName = localStorage.getItem('userName') || '';
let soundEnabled = true;
const notificationSound = new Audio('pop.mp3');
const messages = [];

// Alterna o som de notificação
function toggleSound() {
    soundEnabled = !soundEnabled;
    document.querySelector('.toggle-sound').textContent = soundEnabled ? "🔊 Ativado" : "🔇 Desativado";
}

// Inicia o chat
function startChat() {
    userName = document.getElementById('name-input').value.trim();
    if (!userName) return;
    localStorage.setItem('userName', userName);
    document.getElementById('name-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    socket.emit('userJoined', userName);
}

// Sai do chat
function leaveChat() {
    socket.emit('userLeft', userName);
    localStorage.removeItem('userName');
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('name-container').style.display = 'flex';
    userName = '';
}

// Adiciona emoji ao campo de mensagem
const emojiPicker = new EmojiButton();
document.querySelector('#emoji-button').addEventListener('click', () => {
    emojiPicker.togglePicker(document.querySelector('#emoji-button'));
});
emojiPicker.on('emoji', emoji => document.getElementById('message-input').value += emoji);

socket.on('userJoined', name => displayMessage(`${name} entrou no chat`, 'timestamp'));
socket.on('userLeft', name => displayMessage(`${name} saiu do chat`, 'timestamp'));
socket.on('chatMessage', ({ name, message, timestamp }) => {
    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (name !== userName && soundEnabled) notificationSound.play();
    displayMessage(`${name}: ${message}`, name === userName ? 'my-message' : 'other-message', time);
    messages.push(`${name} (${time}): ${message}`);
});

// Envia a mensagem
function sendMessage() {
    const messageText = document.getElementById('message-input').value.trim();
    if (!messageText) return;
    socket.emit('chatMessage', { name: userName, message: messageText, timestamp: Date.now() });
    document.getElementById('message-input').value = '';
}

// Exibe a mensagem no chat
function displayMessage(message, className, timestamp = '') {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<span>${message}</span>${timestamp ? `<br><span class="timestamp">${timestamp}</span>` : ''}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Envia o conteúdo do chat por email
function sendEmail() {
    const formattedMessages = messages.join('\n');
    emailjs.send('service_wog62om', 'template_g11n86g', {
        from_name: userName,
        messages: formattedMessages,
        to_email: 'eudavi886@gmail.com'
    }).then(() => alert('E-mail enviado com sucesso!'), () => alert('Erro ao enviar o e-mail.'));
}

document.getElementById('message-input').addEventListener('keypress', event => {
    if (event.key === 'Enter') sendMessage();
});

document.addEventListener('DOMContentLoaded', () => {
    if (userName) startChat();
});
