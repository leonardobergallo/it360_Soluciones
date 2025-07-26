-- Script para probar el sistema unificado de tickets
-- Ejecutar en el SQL Editor de Neon

-- 1. Ver todos los tickets ordenados por fecha
SELECT 
    "ticketNumber",
    nombre,
    email,
    tipo,
    categoria,
    asunto,
    estado,
    urgencia,
    prioridad,
    "createdAt"
FROM "Ticket"
ORDER BY "createdAt" DESC;

-- 2. Ver solo tickets de presupuesto (los migrados)
SELECT 
    "ticketNumber",
    nombre,
    email,
    empresa,
    servicio,
    asunto,
    estado,
    "createdAt"
FROM "Ticket"
WHERE tipo = 'presupuesto'
ORDER BY "createdAt" DESC;

-- 3. Ver estadísticas por tipo de ticket
SELECT 
    tipo,
    COUNT(*) as total,
    COUNT(CASE WHEN estado = 'abierto' THEN 1 END) as abiertos,
    COUNT(CASE WHEN estado = 'en_proceso' THEN 1 END) as en_proceso,
    COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as resueltos
FROM "Ticket"
GROUP BY tipo
ORDER BY total DESC;

-- 4. Ver estadísticas por urgencia
SELECT 
    urgencia,
    COUNT(*) as total
FROM "Ticket"
GROUP BY urgencia
ORDER BY total DESC;

-- 5. Ver estadísticas por prioridad
SELECT 
    prioridad,
    COUNT(*) as total
FROM "Ticket"
GROUP BY prioridad
ORDER BY total DESC; 