# Guía de Contribución

¡Gracias por tu interés en contribuir al ARSC DEX! Esta guía te ayudará a entender cómo puedes participar en el desarrollo del proyecto.

## 📋 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente acogedor y respetuoso para todos. Por favor:

- Usa un lenguaje acogedor e inclusivo
- Respeta diferentes puntos de vista y experiencias
- Acepta críticas constructivas de forma elegante
- Enfócate en lo que es mejor para la comunidad

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor abre un issue con:

1. **Descripción clara** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado** vs comportamiento actual
4. **Screenshots** si es aplicable
5. **Información del entorno** (navegador, OS, etc.)

### Sugerir Features

Para sugerir nuevas características:

1. Verifica que no exista ya un issue similar
2. Crea un issue detallando:
   - La funcionalidad propuesta
   - Por qué sería útil
   - Posible implementación

### Pull Requests

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```
3. **Realiza tus cambios** siguiendo las guías de estilo
4. **Agrega tests** si es necesario
5. **Commit** tus cambios:
   ```bash
   git commit -m "feat: descripción clara del cambio"
   ```
6. **Push** a tu fork:
   ```bash
   git push origin feature/nombre-descriptivo
   ```
7. **Abre un Pull Request**

## 📝 Estándares de Código

### TypeScript

- Usa TypeScript estricto
- Define tipos explícitos para props y funciones
- Evita `any`, usa tipos específicos

### React

- Usa componentes funcionales con hooks
- Implementa `React.forwardRef` cuando sea necesario
- Usa `useCallback` y `useMemo` apropiadamente para optimización

### Styling

- Usa Tailwind CSS para estilos
- Mantén consistencia con el design system existente
- Usa variables CSS para colores del tema

### Commits

Sigue la convención de commits semánticos:

```
tipo(alcance): descripción

feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato/estilo
refactor: refactorización
test: tests
chore: mantenimiento
```

Ejemplos:
```bash
feat(dex): agregar soporte para token XYZ
fix(swap): corregir cálculo de slippage
docs(readme): actualizar instrucciones de instalación
```

## 🧪 Testing

- Ejecuta tests antes de enviar PR: `npm run test`
- Agrega tests para nuevas funcionalidades
- Asegúrate de que el coverage no disminuya

## 🔧 Configuración de Desarrollo

### Prerrequisitos

- Node.js 18+
- npm/yarn
- Git

### Setup

```bash
# Clonar tu fork
git clone https://github.com/tu-usuario/arsc-dex.git
cd arsc-dex

# Instalar dependencias
npm install

# Configurar env vars
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

### Comandos Útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos
```

## 📁 Estructura de Archivos

### Componentes

```tsx
// src/app/components/MiComponente.tsx
import React from 'react';
import { cn } from '@/app/lib/utils';

interface MiComponenteProps {
  className?: string;
  // ... otras props
}

export function MiComponente({ className, ...props }: MiComponenteProps) {
  return (
    <div className={cn("clase-base", className)} {...props}>
      {/* contenido */}
    </div>
  );
}
```

### Hooks

```tsx
// src/app/hooks/useMiHook.ts
import { useState, useEffect } from 'react';

export function useMiHook(parametro: string) {
  const [estado, setEstado] = useState<TipoEstado>();

  useEffect(() => {
    // lógica del hook
  }, [parametro]);

  return { estado, setEstado };
}
```

### Transacciones

```tsx
// src/app/transactions/miTransaccion.ts
import { PreparedTransaction } from 'thirdweb';

export function miTransaccion(
  parametros: MisParametros,
  contract: ThirdwebContract
): PreparedTransaction {
  return prepareTransaction({
    // lógica de transacción
  });
}
```

## 🎯 Áreas de Contribución

### Frontend
- Componentes UI/UX
- Optimización de rendimiento
- Responsive design
- Accesibilidad

### Web3
- Integración con nuevos protocolos
- Optimización de gas
- Manejo de errores Web3
- Testing de contratos

### Documentación
- Mejorar README
- Documentar APIs
- Tutoriales de uso
- Comentarios en código

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

## 💡 Tips para Contribuidores

1. **Empieza pequeño**: Comienza con issues marcados como "good first issue"
2. **Pregunta antes**: Si no estás seguro, abre un issue para discutir
3. **Mantén el scope pequeño**: PRs grandes son difíciles de revisar
4. **Documenta cambios**: Explica el "por qué" no solo el "qué"
5. **Sé paciente**: El review puede tomar tiempo

## 📞 Contacto

¿Tienes preguntas? ¡Contáctanos!

- Discord: [Enlace al Discord]
- Twitter: [@arsc_dex]
- Email: dev@arsc.com

## 🏆 Reconocimientos

Todos los contribuidores serán agregados al [CONTRIBUTORS.md](CONTRIBUTORS.md) y recibirán reconocimiento en nuestras redes sociales.

---

¡Gracias por ayudar a hacer ARSC DEX mejor! 🚀