// updateTickets.js
import fetch from "node-fetch";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/tickets";
const CHATGPT_URL = process.env.API_CHATGPT_URL || "http://localhost:3000/api/chatgpt";
const MAIL_URL = process.env.API_MAIL_URL || "http://localhost:3000/api/mail";

const TARGET_EMAILS = [
  "baltazarky2808@gmail.com",
  "baltazar2808@gmail.com"
];

(async function run() {
  try {
    // 1) Obtener todos los tickets
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`GET ${BASE_URL} -> ${res.status}`);
    const tickets = await res.json();

    // 2) Filtrar tickets por email
    const ticketsFiltrados = tickets.filter(t => TARGET_EMAILS.includes(t.email));

    if (!ticketsFiltrados.length) {
      console.log("❌ No se encontraron tickets con esos emails.");
      return;
    }

    // 3) Tomar el primer ticket
    const ticket = ticketsFiltrados[0];
    console.log("📌 Primer ticket encontrado:", ticket.ticketNumber);

    // 4) Generar correo con ChatGPT
    const chatgptRes = await fetch(CHATGPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mail: ticket.email,
        descripcion: ticket.descripcion
      })
    });

    if (!chatgptRes.ok) throw new Error(`POST ${CHATGPT_URL} -> ${chatgptRes.status}`);
    const correoGenerado = await chatgptRes.json();
    console.log("✉️ Correo generado por ChatGPT:", correoGenerado);

    // 5) Enviar correo usando la API de mails
    const mailRes = await fetch(MAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(correoGenerado)
    });

    if (!mailRes.ok) throw new Error(`POST ${MAIL_URL} -> ${mailRes.status}`);
    const mailResult = await mailRes.json();
    console.log("✅ Mail enviado:", mailResult);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
