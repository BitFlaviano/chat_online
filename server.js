const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
app.use(bodyParser.json());

// Configura o Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' ou ajuste conforme seu provedor de email
    auth: {
        user: 'seuemail@gmail.com', // Substitua pelo seu email
        pass: 'suasenha'            // Substitua pela sua senha
    }
});

io.on('connection', (socket) => {
    console.log('Novo usuário conectado');
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });
});
io.on('connection', (socket) => {
    socket.on('userJoined', (name) => {
        // Enviar a mensagem para todos os usuários conectados
        socket.broadcast.emit('userJoined', name);
    });

    socket.on('userLeft', (name) => {
        // Enviar a mensagem para todos os usuários conectados
        socket.broadcast.emit('userLeft', name);
    });
});

// Rota para enviar o email com as mensagens
app.post('/send-email', async (req, res) => {
    const messages = req.body.messages.join('\n');
    const mailOptions = {
        from: 'seuemail@gmail.com',
        to: 'sousaportoflaviano@hotmail.com',
        subject: 'Histórico de Chat',
        text: messages
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ message: 'Erro ao enviar email' });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
