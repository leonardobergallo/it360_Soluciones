const fs = require('fs');
const path = require('path');
const express = require('express');
const { google } = require('googleapis');

const PORT = 3001;
const CREDENTIALS_PATH = path.join(__dirname, 'balta.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Función para usar token guardado si existe
function loadToken() {
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);
    return true;
  }
  return false;
}

const app = express();

// Ruta para iniciar login solo si no hay token
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    prompt: 'select_account'
  });
  res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    res.send('✅ Autenticado! Token guardado.');
    console.log('Token guardado en', TOKEN_PATH);
    await listUnread(oAuth2Client);
  } catch (err) {
    console.error('Error obteniendo el token', err);
    res.status(500).send('Error durante la autenticación');
  }
});

// Función para listar correos
async function listUnread(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
    maxResults: 10,
  });

  const messages = res.data.messages || [];
  if (!messages.length) return console.log('📭 No hay mensajes no leídos.');

  for (const msg of messages) {
    const msgData = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'full',
    });

    const headers = msgData.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '(sin asunto)';
    const from = headers.find(h => h.name === 'From')?.value || '(desconocido)';

    // Cuerpo
    let body = '';
    const parts = msgData.data.payload.parts;
    if (parts && parts.length) {
      const textPart = parts.find(p => p.mimeType === 'text/plain');
      if (textPart?.body?.data) body = Buffer.from(textPart.body.data, 'base64').toString('utf8');
    } else if (msgData.data.payload.body?.data) {
      body = Buffer.from(msgData.data.payload.body.data, 'base64').toString('utf8');
    }

    console.log(`\n👤 De: ${from}\n📌 Asunto: ${subject}\n✉️ Contenido:\n${body}`);
  }
}

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🌐 Servidor en http://localhost:${PORT}`);

  if (loadToken()) {
    console.log('✅ Token cargado, listando mensajes sin abrir /auth');
    await listUnread(oAuth2Client);
  } else {
    console.log(`👉 Abrí http://localhost:${PORT}/auth para iniciar sesión en Google`);
  }
});
