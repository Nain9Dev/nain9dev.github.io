# Política de Seguridad y Manejo de Archivos en Repositorio Público

## 1. Propósito
El repositorio `nain9dev.github.io` es de acceso público y sirve como portafolio personal y técnico. El propósito de esta política es garantizar que no se exponga código sensible, datos privados, credenciales ni información de configuración interna (incluyendo metaprompts para asistentes de IA) en el control de versiones, manteniendo un historial limpio y profesional.

## 2. Archivos Excluidos y Razones

La política dictamina la exclusión estricta de las siguientes categorías mediante el archivo `.gitignore`:

### 2.1. Archivos de Entorno y Credenciales
- **Qué incluye**: `.env`, `.env.*` (excepto `.env.example`), `secrets.json`, etc.
- **Razón**: Contienen claves API, tokens de bases de datos o secretos de acceso (ej. MailerLite keys, Analytics API keys) que permitirían el secuestro de servicios.

### 2.2. Configuración Interna de IA
- **Qué incluye**: `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.agents/`, `.continue/`, `.gemini/`.
- **Razón**: Pueden contener metaprompts, instrucciones de desarrollo, rutas locales del disco, configuraciones del workspace del desarrollador o claves de herramientas AI que no aportan valor al código fuente desplegable y comprometen el contexto interno de trabajo.

### 2.3. Cachés, Builds y Dependencias
- **Qué incluye**: `node_modules/`, `dist/`, `.astro/`, `*.tsbuildinfo`, `coverage/`.
- **Razón**: Archivos autogenerados. Sube la latencia de clonado, emborrona las Pull Requests y no forma parte del código fuente. Se reconstruyen dinámicamente en el flujo de CI/CD (GitHub Actions).

### 2.4. Archivos de IDE y Sistema
- **Qué incluye**: `.vscode/`, `.DS_Store`, `Thumbs.db`, `*.swp`.
- **Razón**: Configuraciones locales del desarrollador. Previene colisiones entre distintos colaboradores o entornos (Windows vs macOS).

## 3. Procedimiento ante Fugas de Información

Si un archivo sensible se commitea por error:
1. **No hacer simplemente un nuevo commit eliminando el archivo.** El archivo seguiría vivo en el historial de Git.
2. Utilizar comandos de reescritura de historial.
3. Para eliminar del caché:
   ```bash
   git rm --cached nombre_del_archivo
   git commit -m "chore: eliminar archivo sensible del tracking"
   ```
4. Para eliminar de la historia completa (si hubiese credenciales reales expuestas, además se **deben invalidar de inmediato** en el proveedor correspondiente, ej: regenerar el API Key de AWS/MailerLite):
   ```bash
   # Opción recomendada: BFG Repo-Cleaner
   bfg --delete-files .env
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   git push -f origin main
   ```

## 4. Auditoría Continua
Se recomienda ejecutar un escaneo de secretos local de forma periódica (ej. `gitleaks`) antes de empaquetar código. Cualquier documento de planificación estratégica o notas privadas debe ubicarse exclusivamente en el directorio `docs/private/`, que está explícitamente ignorado.
