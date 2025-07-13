# 🎯 Configuración Git - IT360 Soluciones

## ✅ Estado Actual
- ✅ Repositorio inicializado
- ✅ Rama `main` (producción) creada
- ✅ Rama `develop` (desarrollo) creada
- ✅ Rama `feature/ejemplo-funcionalidad` creada

## 🚀 Próximos Pasos

### 1. Conectar con GitHub
```bash
git remote add origin https://github.com/leonardobergallo/it360_Soluciones.git
git push -u origin main
git push -u origin develop
```

### 2. Flujo de Trabajo Diario

#### Para nueva funcionalidad:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcionalidad
# ... desarrollar ...
git add .
git commit -m "🎉 feat: nueva funcionalidad"
git push origin feature/nombre-funcionalidad
```

#### Para integrar a develop:
```bash
git checkout develop
git merge feature/nombre-funcionalidad
git push origin develop
```

#### Para producción:
```bash
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
```

## 📋 Ramas Configuradas

- **main**: Producción (estable)
- **develop**: Desarrollo (integración)
- **feature/***: Características individuales

## 🔧 Comandos Rápidos

```bash
# Ver ramas
git branch -a

# Cambiar rama
git checkout develop

# Crear nueva feature
git checkout -b feature/nueva-funcionalidad

# Ver estado
git status
``` 