-- Script para exportar presupuestos desde Neon
-- Ejecutar esto en el SQL Editor de Neon antes de la migración

-- Verificar si existe la tabla Presupuesto
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'Presupuesto';

-- Exportar todos los presupuestos
SELECT 
    id,
    nombre,
    email,
    telefono,
    empresa,
    servicio,
    mensaje,
    estado,
    "createdAt",
    "updatedAt"
FROM "Presupuesto"
ORDER BY "createdAt" DESC;

-- Contar cuántos presupuestos hay
SELECT COUNT(*) as total_presupuestos FROM "Presupuesto";

-- Crear backup de la estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'Presupuesto'
ORDER BY ordinal_position; 