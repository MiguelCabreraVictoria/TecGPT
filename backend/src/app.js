import authRoutes from "./routes/auth.routes.js";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

const app = express();


const isProduction = process.env.NODE_ENV === "production";

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// CORS
app.use(
  cors({
    origin: isProduction ? "https://frontend.misitio.com": "http://localhost:5000", // TODO cambiar por el dominio del frontend
    credentials: true, // Permite enviar cookies y encabezados de autenticación
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Permite encabezados específicos
    legacyHeaders: false, // Desactiva encabezados obsoletos
  })
)


// Security 

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    standardHeaders: true, // Devuelve información de límite de solicitudes en los encabezados
  })
)

app.use(
  helmet({
    contentSecurityPolicy: isProduction // Activa CSP (Content Security Policy) que es una medida de seguridad para prevenir ataques XSS y otros tipos de inyecciones
      ? {
          directives: {
            defaultSrc: ["'self'"], // Permite solo el mismo origen
            scriptSrc: ["'self'", "https://apis.google.com"], // Permite scripts del mismo origen y de Google APIs
            objectSrc: ["'none'"], // No permite objetos
            connectSrc: ["'self'", "https://frontend.misitio.com"], // TODO cambiar por el dominio del frontend
            upgradeInsecureRequests: [], // Permite solicitudes seguras
          },
        }
      : {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://apis.google.com"],
            objectSrc: ["'none'"],
            connectSrc: ["'self'", "http://localhost:5000"], 
          },
        },
    referrerPolicy: { policy: "no-referrer" }, // Oculta la URL de origen en los requests
    frameguard: { action: "deny" }, // Evita ataques de clickjacking (es decir, que tu app se muestre en un iframe de otro sitio)
    hsts: isProduction // Fuerza HTTPS en produccion
      ? {
          maxAge: 31536000, // 1 año
          includeSubDomains: true,
          preload: true,
        }
      : false,
    crossOriginResourcePolicy: { policy: "same-origin" }, // Evita que otros origenes lean recursos del servidor
    crossOriginEmbedderPolicy: false,
    hidePoweredBy: true, // Elimina encabezado de Express
  })
);


app.use('/auth', authRoutes);

export default app;