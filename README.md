# TecGPT
# TecGPT 🤖

**Chat de Inteligencia Artificial para Consultas Administrativas del Tecnológico de Monterrey Campus Santa Fe**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.x-blue.svg)](https://postgresql.org/)
[![OpenStack](https://img.shields.io/badge/OpenStack-Deployed-orange.svg)](https://www.openstack.org/)

## 📋 Descripción

TecGPT es un chatbot inteligente desarrollado para automatizar la atención de consultas administrativas frecuentes en el Tecnológico de Monterrey Campus Santa Fe. El sistema utiliza un modelo de IA personalizado entrenado con más de 700 preguntas específicas del campus, proporcionando respuestas inmediatas y liberando al personal administrativo para casos más complejos.

### ✨ Características Principales

- 🎯 **IA Especializada**: Modelo entrenado con 700+ consultas específicas del Tec
- 🔐 **Autenticación Segura**: Sistema JWT con validación de emails @tec.mx
- 📱 **Diseño Responsivo**: Compatible con móviles, tablets y escritorio
- 🌙 **Modo Oscuro/Claro**: Interfaz adaptable según preferencias del usuario
- ⚡ **Respuestas Rápidas**: Tiempo de respuesta menor a 15 segundos
- 🛡️ **Seguridad Robusta**: Rate limiting, cifrado bcrypt, headers de seguridad
- 🏗️ **Arquitectura Escalable**: Desplegado en OpenStack con 4 instancias

## 🏛️ Arquitectura

```
Internet → NGINX (Load Balancer) → Frontend (React) → Backend (Node.js) → PostgreSQL
                                        ↓
                                Modelo IA (Hub Externo)
```

### 🖥️ Instancias OpenStack

| Instancia | Servicio | Puerto | Descripción |
|-----------|----------|--------|-------------|
| **NGINX** | Balanceador | 80/443 | Proxy reverso y load balancer |
| **Frontend** | React | 5001 | Interfaz de usuario |
| **Backend** | Node.js | 3000 | API REST y lógica de negocio |
| **Database** | PostgreSQL | 5432 | Base de datos principal |

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18.x+
- PostgreSQL 13.x+
- NGINX
- Acceso a instancias OpenStack
- Llave SSH TecGPT

### 1. Clonar el Repositorio
```bash
git clone https://github.com/MiguelCabreraVictoria/TecGPT
cd TecGPT
```

### 2. Configurar Base de Datos
```bash
# En instancia Database (172.20.100.12)
sudo apt install -y postgresql postgresql-contrib
sudo -i -u postgres
createdb tecgpt_db
createuser --interactive tecgpt_user
psql
ALTER USER tecgpt_user WITH ENCRYPTED PASSWORD 'TecGPT2025!';
GRANT ALL PRIVILEGES ON DATABASE tecgpt_db TO tecgpt_user;
```

### 3. Configurar Backend
```bash
# En instancia Backend (172.20.100.11)
cd TecGPT/backend
npm install
npx prisma generate
npx prisma migrate deploy
pm2 start src/server.js --name "tecgpt-backend"
```

### 4. Configurar Frontend
```bash
# En instancia Frontend (172.20.100.10)
cd TecGPT/frontend
npm install
npm run build
pm2 start "serve -s build -l 5001" --name "tecgpt-frontend"
```

### 5. Configurar NGINX
```bash
# En instancia NGINX (172.20.100.13)
sudo cp config/nginx/tecgpt /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tecgpt /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## ⚙️ Variables de Entorno

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://tecgpt_user:TecGPT2025!@172.20.100.12:5432/tecgpt_db"
JWT_SECRET="TecGPT_JWT_Secret_Key_2025"
AI_SERVICE_URL="http://172.20.100.254:8000"
CORS_ORIGIN="http://172.20.100.10:5001"
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://172.20.100.11:3000
PORT=5001
REACT_APP_TITLE="TecGPT - Campus Santa Fe"
```

## 📡 API Endpoints

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/auth/register` | POST | Registro de usuario | No |
| `/auth/login` | POST | Inicio de sesión | No |
| `/auth/logout` | GET | Cerrar sesión | Sí |
| `/conversation` | POST | Consulta al chatbot | Sí |

### Ejemplo de Uso
```bash
# Registro
curl -X POST http://172.20.100.11:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"campus":"Santa Fe","name":"Juan","lastName":"Pérez","email":"juan.perez@tec.mx","password":"password123"}'

# Login
curl -X POST http://172.20.100.11:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan.perez@tec.mx","password":"password123"}'

# Consulta al chatbot
curl -X POST http://172.20.100.11:3000/conversation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"prompt":"¿Dónde puedo sacar mi credencial?"}'
```

## 🛠️ Tecnologías

### Frontend
- **React 18.x** - Framework de interfaz de usuario
- **CSS3** - Estilos y diseño responsivo
- **React Router** - Navegación del lado cliente

### Backend
- **Node.js 18.x** - Runtime de JavaScript
- **Express 5.x** - Framework web
- **Prisma 6.x** - ORM para base de datos
- **JWT** - Autenticación con tokens
- **Bcrypt** - Cifrado de contraseñas

### Base de Datos
- **PostgreSQL 13.x** - Base de datos relacional

### Infraestructura
- **OpenStack** - Plataforma de nube privada
- **NGINX** - Servidor web y proxy reverso
- **PM2** - Gestor de procesos Node.js

## 📊 Monitoreo

### Comandos de Estado
```bash
# Ver estado de servicios
pm2 status
sudo systemctl status postgresql nginx

# Ver logs
pm2 logs tecgpt-backend
sudo tail -f /var/log/nginx/error.log

# Verificar conectividad
curl http://172.20.100.13  # Aplicación completa
```

### Métricas de Rendimiento
- ⚡ Tiempo de respuesta del chat: < 15 segundos
- 🚀 Carga inicial de página: < 2 segundos
- 🔒 Rate limiting: 100 peticiones por 15 minutos
- 🛡️ Disponibilidad objetivo: 99.5%

## 🧪 Testing

```bash
# Ejecutar tests del backend
cd backend && npm test

# Ejecutar tests del frontend
cd frontend && npm test

# Linting
npm run lint
```

## 🔧 Mantenimiento

### Actualizar Código
```bash
git pull origin main
pm2 restart all
sudo systemctl reload nginx
```

### Backup de Base de Datos
```bash
pg_dump -h 172.20.100.12 -U tecgpt_user tecgpt_db > backup_$(date +%Y%m%d).sql
```

### Logs y Debugging
```bash
# Ver todos los logs
pm2 logs

# Logs específicos por aplicación
pm2 logs tecgpt-backend --lines 100
pm2 logs tecgpt-frontend --lines 100
```

## 🔐 Seguridad

- ✅ Autenticación JWT con expiración de 1 hora
- ✅ Validación de emails institucionales (@tec.mx)
- ✅ Cifrado de contraseñas con bcrypt (salt factor 10)
- ✅ Rate limiting para prevenir ataques DDoS
- ✅ Headers de seguridad con Helmet.js
- ✅ CORS configurado para dominios específicos
- ✅ Validación y sanitización de entradas

## 👥 Equipo de Desarrollo

- **Dulce Daniela García Ruiz** - A01748013
- **Ian Luis Vázquez Morán** - A01027225
- **Miguel Ángel Cabrera Victoria** - A01782982
- **Paula Verdugo Márquez** - A01026218

### Profesores
- **Jorge Rodríguez Ruiz**
- **Octavio Navarro Hinojosa**

## 📄 Licencia

Este proyecto fue desarrollado como parte del programa académico del Tecnológico de Monterrey Campus Santa Fe.

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contacta al equipo de desarrollo a través del repositorio de GitHub.

---

**TecGPT** - Optimizando la atención estudiantil con Inteligencia Artificial 🎓✨
