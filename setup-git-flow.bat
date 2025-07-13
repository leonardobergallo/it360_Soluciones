@echo off
echo 🚀 Configurando Git Flow para IT360 Soluciones...
echo.

echo 📋 Verificando estado actual...
git status

echo.
echo 🔄 Configurando ramas principales...

REM Asegurar que estamos en main
git checkout main

REM Crear y cambiar a develop
git checkout -b develop

REM Crear rama de ejemplo feature
git checkout -b feature/ejemplo-funcionalidad

echo.
echo ✅ Ramas creadas exitosamente:
echo    - main (producción)
echo    - develop (desarrollo) 
echo    - feature/ejemplo-funcionalidad (ejemplo)

echo.
echo 📊 Estado de las ramas:
git branch -a

echo.
echo 🎯 Próximos pasos:
echo    1. Desarrollar en feature/ejemplo-funcionalidad
echo    2. Hacer merge a develop cuando esté listo
echo    3. Hacer merge de develop a main para producción
echo.
echo 💡 Comandos útiles:
echo    git checkout develop
echo    git checkout -b feature/nueva-funcionalidad
echo    git merge feature/nueva-funcionalidad
echo.
pause 