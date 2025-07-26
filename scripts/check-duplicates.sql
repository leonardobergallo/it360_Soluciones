-- Script para verificar duplicados en la tabla Ticket
-- Ejecutar en el SQL Editor de Neon

-- 1. Verificar duplicados por nombre y email
SELECT 
    nombre,
    email,
    COUNT(*) as cantidad
FROM "Ticket"
WHERE tipo = 'presupuesto'
GROUP BY nombre, email
HAVING COUNT(*) > 1
ORDER BY cantidad DESC;

-- 2. Ver todos los tickets de presupuesto con detalles
SELECT 
    id,
    "ticketNumber",
    nombre,
    email,
    asunto,
    "createdAt"
FROM "Ticket"
WHERE tipo = 'presupuesto'
ORDER BY nombre, "createdAt" DESC;

-- 3. Contar total de tickets por tipo
SELECT 
    tipo,
    COUNT(*) as total
FROM "Ticket"
GROUP BY tipo
ORDER BY total DESC; 