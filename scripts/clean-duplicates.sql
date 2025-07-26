-- Script para limpiar duplicados en la tabla Ticket
-- Ejecutar en el SQL Editor de Neon

-- 1. Ver cuántos duplicados hay antes de limpiar
SELECT 
    COUNT(*) as total_duplicados
FROM (
    SELECT nombre, email
    FROM "Ticket"
    WHERE tipo = 'presupuesto'
    GROUP BY nombre, email
    HAVING COUNT(*) > 1
) duplicados;

-- 2. Eliminar duplicados manteniendo solo el más reciente
DELETE FROM "Ticket" 
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY nombre, email ORDER BY "createdAt" DESC) as rn
        FROM "Ticket"
        WHERE tipo = 'presupuesto'
    ) t
    WHERE rn > 1
);

-- 3. Verificar que se limpiaron los duplicados
SELECT 
    nombre,
    email,
    COUNT(*) as cantidad
FROM "Ticket"
WHERE tipo = 'presupuesto'
GROUP BY nombre, email
HAVING COUNT(*) > 1
ORDER BY cantidad DESC;

-- 4. Contar total final de tickets de presupuesto
SELECT 
    COUNT(*) as total_tickets_presupuesto
FROM "Ticket"
WHERE tipo = 'presupuesto'; 