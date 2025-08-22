// app/api/chatgpt/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { mail, descripcion } = await request.json();

    if (!mail || !descripcion) {
      return NextResponse.json(
        { error: "Debe enviar 'mail' y 'descripcion'" },
        { status: 400 }
      );
    }

    const prompt = `A partir del siguiente ticket, genera un correo profesional y claro. Devuelve solo un JSON con las llaves "to", "subject" y "body". 
    Ticket:
    Email: ${mail}
    Descripción: ${descripcion}
    Instrucciones:
    - "to" debe ser el email del destinatario
    - "subject" debe ser un título breve y claro
    - "body" debe ser un texto listo para enviar
    - Devuelve **solo** el JSON sin ningún texto adicional`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente profesional que genera correos claros y concisos." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      functions: [
        {
          name: "generate_email",
          description: "Genera un correo a partir de un ticket",
          parameters: {
            type: "object",
            properties: {
              to: { type: "string", description: "Email del destinatario" },
              subject: { type: "string", description: "Título del correo" },
              body: { type: "string", description: "Contenido del correo" }
            },
            required: ["to", "subject", "body"]
          }
        }
      ],
      function_call: { name: "generate_email" }
    });

    const message = completion.choices[0].message;

    if (!message.function_call?.arguments) {
      return NextResponse.json(
        { error: "No se pudo generar el correo" },
        { status: 500 }
      );
    }

    const correoGenerado = JSON.parse(message.function_call.arguments);

    return NextResponse.json(correoGenerado);

  } catch (error: any) {
    console.error("Error en API ChatGPT:", error);
    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}
