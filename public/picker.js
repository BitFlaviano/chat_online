// Função para tocar som de notificação
function playNotificationSound() {
    const audio = new Audio('/sounds/pop.mp3'); // Certifique-se de que o áudio 'pop.mp3' está em 'public/sounds'
    audio.play().catch(error => {
        console.error("Erro ao reproduzir som de notificação:", error);
    });
}

// Exemplo de integração com o chat para tocar som quando uma mensagem for recebida
if (typeof socket !== 'undefined') {
    socket.on('chatMessage', (data) => {
        // Tocar som ao receber uma nova mensagem
        playNotificationSound();

        // Adicionar mensagem ao chat (exemplo de função)
        addMessageToChat(data);
    });
}
