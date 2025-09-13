# ARSC DEX - Decentralized Exchange

🚀 **DEX Argentino** - Un exchange descentralizado construido con Uniswap V3 y Thirdweb SDK, soportando múltiples blockchains.

**⚠️ Disclaimer**: Este proyecto está en desarrollo. Úsalo bajo tu propio riesgo en mainnet. Siempre haz tus propias investigaciones antes de realizar transacciones.

## ✨ Características

- 🔄 **Intercambio Multichain**: Soporta Ethereum, Polygon, Optimism, Arbitrum y Base
- ⚡ **Transacciones Rápidas**: Integración directa con Uniswap V3 para la mejor liquidez
- 💰 **Tarifas Bajas**: Aprovecha las mejores rutas para minimizar costos
- 🎨 **UI Moderna**: Interfaz elegante con animaciones fluidas
- 🔒 **Seguro**: Contratos auditados y protocolos probados
- 🌐 **Web3 Native**: Conecta con cualquier wallet compatible

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 15.5, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4.1, Framer Motion 12
- **Web3**: Thirdweb SDK v5.105, Uniswap V3
- **UI Components**: Radix UI, shadcn/ui
- **Estado**: TanStack React Query v5

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 20+ (recomendado para Next.js 15)
- npm, yarn, pnpm o bun
- Una cuenta en [Thirdweb](https://thirdweb.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/yourusername/arsc-dex.git
cd arsc-dex
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Thirdweb

#### Paso 3.1: Crear proyecto en Thirdweb

1. Ve a [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Haz clic en "Create Project"
3. Selecciona "Create a new project"
4. Ingresa el nombre de tu proyecto (ej: "ARSC DEX")
5. Copia tu **Client ID** desde el dashboard

#### Paso 3.2: Configurar variables de entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tu Thirdweb Client ID:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=tu_client_id_aqui
```

⚠️ **Importante**: Nunca commitees el archivo `.env.local` al repositorio

### 4. Ejecutar el proyecto

```bash
npm run dev
# o
yarn dev
```

El proyecto estará disponible en `http://localhost:3000`.

## 📋 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run type-check` - Verifica los tipos de TypeScript

## 🔧 Configuración

### Tokens Soportados

El DEX viene preconfigurado con los siguientes tokens:

- **WETH** (Wrapped Ethereum)
- **WBTC** (Wrapped Bitcoin)
- **USDC** (USD Coin)
- **USDT** (Tether)

### Redes Soportadas

- **Ethereum Mainnet** (ChainId: 1)
- **Polygon** (ChainId: 137)
- **Optimism** (ChainId: 10)
- **Arbitrum** (ChainId: 42161)
- **Base** (ChainId: 8453)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes React reutilizables
│   │   └── ui/             # Componentes UI básicos (botones, cards, etc.)
│   ├── config/             # Configuración de chains y redes
│   ├── constants.ts        # Constantes del proyecto (tokens, contratos)
│   ├── context/            # Context providers (ChainContext)
│   ├── hooks/              # Custom hooks (useQuote)
│   ├── lib/                # Utilidades y helpers
│   ├── transactions/       # Lógica de transacciones Web3
│   ├── types/              # Definiciones de tipos TypeScript
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   ├── client.ts           # Cliente Thirdweb
│   └── providers.tsx       # Providers de la aplicación
├── public/                 # Assets estáticos
└── ...                     # Archivos de configuración
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Asegúrate de que los tests pasen
- Documenta cualquier nueva funcionalidad
- Mantén los commits limpios y descriptivos

## 📝 Roadmap

- [x] Implementar componente Swapper completo
- [x] Agregar soporte para tokens principales (WETH, WBTC, USDC, USDT)
- [x] Implementar funciones de wrap/unwrap
- [ ] Agregar análisis de precio y gráficos
- [ ] Soporte para pool de liquidez
- [ ] Integración con más DEXs
- [ ] App móvil

## 🚀 Despliegue

### Despliegue en Vercel (Recomendado)

1. **Preparar el proyecto para producción**:
   ```bash
   npm run build
   npm run type-check
   npm run lint
   ```

2. **Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Configura las variables de entorno:
     - `NEXT_PUBLIC_THIRDWEB_CLIENT_ID=tu_client_id_aqui`

3. **Configurar dominio personalizado** (opcional):
   - En el dashboard de Vercel, ve a Settings > Domains
   - Agrega tu dominio personalizado

### Despliegue en Netlify

1. **Build del proyecto**:
   ```bash
   npm run build
   ```

2. **Configurar Netlify**:
   - Conecta tu repositorio en [netlify.com](https://netlify.com)
   - Build command: `npm run build`
   - Publish directory: `out` (si usas `next export`) o `.next`
   - Environment variables:
     - `NEXT_PUBLIC_THIRDWEB_CLIENT_ID=tu_client_id_aqui`

### Despliegue Manual

1. **Generar build de producción**:
   ```bash
   npm run build
   ```

2. **Iniciar servidor de producción**:
   ```bash
   npm run start
   ```

### Variables de Entorno para Producción

Asegúrate de configurar estas variables en tu plataforma de despliegue:

```env
# Obligatorio
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=tu_client_id_de_thirdweb

# Opcional - para analytics
NEXT_PUBLIC_GA_ID=tu_google_analytics_id
```

## 🔐 Seguridad

- Nunca compartas tu clave privada
- Siempre verifica las transacciones antes de firmar
- Usa wallets de hardware para cantidades grandes
- Mantén tus dependencias actualizadas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Uniswap](https://uniswap.org/) por el protocolo DEX
- [Thirdweb](https://thirdweb.com/) por las herramientas Web3
- [Next.js](https://nextjs.org/) por el framework React
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Radix UI](https://radix-ui.com/) por los componentes accesibles

## 📞 Contacto

- Website: [[kevinmiani.com](https://www.linkedin.com/in/kevin-miani/)]

---