import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { google } from "googleapis";

// Tomar paths desde variables de entorno
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH;
const TOKEN_PATH = process.env.GOOGLE_TOKEN_PATH;

// Inicializar cliente OAuth2 de Google
function getOAuth2Client() {
  if (!CREDENTIALS_PATH || !TOKEN_PATH) {
    throw new Error("No están definidas las variables GOOGLE_CREDENTIALS_PATH o GOOGLE_TOKEN_PATH");
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oAuth2Client.setCredentials(token);
  } else {
    throw new Error("No se encontró el token en GOOGLE_TOKEN_PATH. Ejecutá el flujo de OAuth2 primero.");
  }

  return oAuth2Client;
}

// Función para enviar mail
async function sendMail(auth: any, to: string, subject: string, body: string) {
  const gmail = google.gmail({ version: "v1", auth });

  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    "",
    body,
  ];
  const message = Buffer.from(messageParts.join("\n")).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: message },
  });

  return res.data;
}

// API route
export async function POST(request: NextRequest) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Faltan campos: to, subject o body" }, { status: 400 });
    }

    const auth = getOAuth2Client();
    const result = await sendMail(auth, to, subject, body);

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("Error enviando mail:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
