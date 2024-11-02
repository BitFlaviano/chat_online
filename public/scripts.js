const socket = io();
let userName = '';
let emojiPickerVisible = false;
const messages = [];

function startChat() {
    userName = document.getElementById('name-input').value.trim();
    if (userName !== "") {
        document.getElementById('name-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        socket.emit('userJoined', userName);
    }
}

function leaveChat() {
    socket.emit('userLeft', userName);
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('name-container').style.display = 'flex';
    document.getElementById('name-input').value = userName;
}

function toggleEmojiPicker() {
    const pickerContainer = document.getElementById('emoji-picker');
    if (!emojiPickerVisible) {
        pickerContainer.innerHTML = '';
        const picker = new EmojiMart.Picker({
            set: 'apple',
            onClick: (emoji) => addEmojiToMessage(emoji)
        });
        pickerContainer.appendChild(picker);
        pickerContainer.style.display = 'block';
    } else {
        pickerContainer.style.display = 'none';
    }
    emojiPickerVisible = !emojiPickerVisible;
}

function addEmojiToMessage(emoji) {
    const messageInput = document.getElementById('message-input');
    messageInput.value += emoji.native;
}

socket.on('userJoined', (name) => {
    displayMessage(`${name} entrou no chat`, 'timestamp');
});

socket.on('userLeft', (name) => {
    displayMessage(`${name} saiu do chat`, 'timestamp');
});

socket.on('chatMessage', (data) => {
    const timestamp = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageClass = data.name === userName ? 'my-message' : 'other-message';
    displayMessage(`${data.name}: ${data.message}`, messageClass, timestamp);
    messages.push(`${data.name} (${timestamp}): ${data.message}`);
});

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    if (messageText !== "" && userName !== "") {
        socket.emit('chatMessage', { name: userName, message: messageText, timestamp: Date.now() });
        messageInput.value = '';
        messageInput.focus();
    }
}

function displayMessage(message, className, timestamp = '') {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<span>${message}</span>${timestamp ? `<br><span class="timestamp">${timestamp}</span>` : ''}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendEmail() {
    const formattedMessages = messages.join('\n');
    emailjs.send('service_wog62om', 'template_g11n86g', {
        from_name: userName,
        messages: formattedMessages,
        to_email: 'eudavi886@gmail.com'
    }).then(() => alert('E-mail enviado com sucesso!'), () => alert('Erro ao enviar o e-mail.'));
}

document.getElementById('message-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event