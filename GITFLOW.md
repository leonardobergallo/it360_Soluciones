# 🚀 Flujo de Trabajo Git - IT360 Soluciones

## 📋 Estructura de Ramas

### 🌟 **main** (Producción)
- **Propósito**: Código estable y listo para producción
- **Protección**: Solo se actualiza desde `develop` mediante Pull Requests
- **Deploy**: Automático a producción

### 🔧 **develop** (Desarrollo)
- **Propósito**: Integración de nuevas características
- **Origen**: Rama principal para desarrollo
- **Deploy**: Automático a staging/testing

### 🌿 **feature/** (Características)
- **Propósito**: Desarrollo de nuevas funcionalidades
- **Origen**: Se crean desde `develop`
- **Destino**: Se fusionan de vuelta a `develop`

## 🔄 Flujo de Trabajo

### 1. Desarrollo de Nuevas Características

```bash
# 1. Asegurarse de estar en develop
git checkout develop
git pull origin develop

# 2. Crear rama de característica
git checkout -b feature/nueva-funcionalidad

# 3. Desarrollar y hacer commits
git add .
git commit -m "✨ Agregar nueva funcionalidad"

# 4. Subir la rama
git push origin feature/nueva-funcionalidad

# 5. Crear Pull Request a develop
# (Hacer en GitHub/GitLab)
```

### 2. Integración a Develop

```bash
# 1. Revisar y aprobar Pull Request
# 2. Fusionar a develop
git checkout develop
git pull origin develop
```

### 3. Release a Producción

```bash
# 1. Cuando develop esté estable
git checkout main
git merge develop

# 2. Crear tag de versión
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
```

## 📝 Convenciones de Commits

### Emojis para Tipos de Cambio
- 🎉 `feat:` Nueva característica
- 🐛 `fix:` Corrección de bug
- 📚 `docs:` Documentación
- 🎨 `style:` Cambios de estilo/formato
- ♻️ `refactor:` Refactorización de código
- ⚡ `perf:` Mejoras de rendimiento
- ✅ `test:` Agregar o corregir tests
- 🔧 `chore:` Tareas de mantenimiento

### Ejemplos
```bash
git commit -m "🎉 feat: Agregar sistema de autenticación"
git commit -m "🐛 fix: Corregir error en login"
git commit -m "📚 docs: Actualizar README"
```

## 🛡️ Protección de Ramas

### main
- ✅ Requiere Pull Request
- ✅ Requiere revisión de código
- ✅ Requiere tests pasando
- ✅ No permite push directo

### develop
- ✅ Requiere Pull Request
- ✅ Requiere revisión de código
- ✅ No permite push directo

## 🚀 Comandos Útiles

### Ver estado de ramas
```bash
git branch -a
git status
```

### Ver historial de commits
```bash
git log --oneline --graph --all
```

### Limpiar ramas locales
```bash
git branch -d feature/rama-completada
git remote prune origin
```

## 📋 Checklist para Releases

### Antes de hacer merge a main
- [ ] Todos los tests pasan
- [ ] Code review completado
- [ ] Documentación actualizada
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Deploy de staging exitoso

### Después del release
- [ ] Tag de versión creado
- [ ] Release notes actualizados
- [ ] Deploy a producción verificado
- [ ] Notificación al equipo

## 🔧 Configuración Inicial

### Configurar usuario Git
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Configurar rama por defecto
```bash
git config --global init.defaultBranch main
```

## 📞 Soporte

Para dudas sobre el flujo de trabajo, consultar:
- Documentación de Git
- Equipo de desarrollo
- Pull Request templates 