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
    service: 'gmail', // Ajuste conforme o provedor de email
    auth: {
        user: process.env.EMAIL_USER, // Use uma variável de ambiente para o email
        pass: process.env.EMAIL_PASS  // Use uma variável de ambiente para a senha
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
        socket.broadcast.emit('userJoined', name);
    });

    socket.on('userLeft', (name) => {
        socket.broadcast.emit('userLeft', name);
    });
});

// Rota para enviar o email com as mensagens
app.post('/send-email', async (req, res) => {
    const messages = req.body.messages.join('\n');
    const mailOptions = {
        from: process.env.EMAIL_USER,
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

// Define a porta usando a variável de ambiente PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
