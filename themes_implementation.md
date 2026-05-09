# Implementación de Theming

## Concepto

Permitir que el cliente personalice los colores y estilos visuales de los menús contextuales. Cada instancia puede tener su propio tema, permitiendo menús con estilos distintos dentro de la misma aplicación.

## Temas predefinidos

### dark
```js
{
  background: '#1e1e1e',
  text: '#e0e0e0',
  border: '#333',
  hover: '#3a3a3a',
  disabled: '#666',
  shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  borderRadius: '6px',
  fontSize: '14px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  arrow: '#888',
  divider: '#333',
  inputAccent: '#888'
}
```

### light
```js
{
  background: '#ffffff',
  text: '#333333',
  border: '#ddd',
  hover: '#f0f0f0',
  disabled: '#aaa',
  shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  borderRadius: '6px',
  fontSize: '14px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  arrow: '#888',
  divider: '#ddd',
  inputAccent: '#888'
}
```

## API de uso

```js
// 1. Tema predefinido
const menu = createContextMenu({
  items: [...],
  theme: 'light',
  onSelect: (val) => ...
});

// 2. Tema predefinido con overrides
const menu = createContextMenu({
  items: [...],
  theme: 'light',
  overrides: {
    background: '#f5f5f5',
    borderRadius: '8px'
  },
  onSelect: (val) => ...
});

// 3. Solo overrides (usa 'dark' por defecto)
const menu = createContextMenu({
  items: [...],
  overrides: {
    background: '#2d2d2d'
  },
  onSelect: (val) => ...
});

// 4. Tema custom completo
const menu = createContextMenu({
  items: [...],
  theme: {
    background: '#1a1a2e',
    text: '#eaf',
    border: '#4a4a6a',
    hover: '#2a2a4e',
    disabled: '#666',
    shadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'monospace',
    arrow: '#9cf',
    divider: '#4a4a6a',
    inputAccent: '#eaf'
  },
  onSelect: (val) => ...
});
```

## Pasos de implementación

### 1. Definir THEMES y defaultTheme

**Archivo:** `contextual_menu.js`

```js
const THEMES = {
  dark: { /* valores dark */ },
  light: { /* valores light */ }
};

const DEFAULT_THEME = THEMES.dark;
```

### 2. Crear función resolveTheme(theme, overrides)

```js
function resolveTheme(theme, overrides) {
  // Si theme es string, buscar en THEMES
  // Si theme es objeto, usar directamente
  // Si es undefined, usar DEFAULT_THEME
  // Aplicar overrides al final
  // Devolver theme combinado
}
```

### 3. Aplicar estilos en activate()

```js
function activate(x, y) {
  const theme = resolveTheme(config.theme, config.overrides);

  // Aplicar al menú principal
  menuEl.style.background = theme.background;
  menuEl.style.color = theme.text;
  // ... resto de propiedades

  // Aplicar a submenús (mismo método)
  // O usar CSS variables para compartir
}
```

### 4. Opciones de aplicación CSS

**Opción A: Inline styles** (simple, más específico)
- Cada propiedad se aplica directamente al elemento
- Funciona bien pero mucho código repetitivo

**Opción B: CSS variables + clase de tema** (recomendado)
- Generar clase `.cm-theme-{hash}` con variables
- Aplicar al abrir, limpiar al cerrar
- Más limpio y permite overrides en CSS externo

```js
function applyTheme(menuEl, theme) {
  const vars = Object.entries(theme)
    .map(([k, v]) => `--cm-${k}: ${v}`)
    .join('; ');
  menuEl.style.cssText = vars;
}
```

### 5. Actualizar CSS base

Eliminar valores hardcoded, usar variables CSS:

```css
.cm-menu {
  background: var(--cm-background, #1e1e1e);
  color: var(--cm-text, #e0e0e0);
  border: 1px solid var(--cm-border, #333);
  /* etc... */
}
```

### 6. Test

**Archivo:** `script.js`

Crear celdas que demuestren:
- Tema 'dark' (default)
- Tema 'light'
- Tema con overrides
- Tema custom completo

## Consideraciones

- Los valores no especificados en tema custom deben fallback a los de `dark`
- Los submenús heredan el tema del menú padre
- Las variables CSS permiten al cliente hacer overrides por CSS si lo prefiere
- No usar `!important` en el CSS base para no bloquear overrides

## Estructura de archivos

```
customization_implementation.md  ← existente
themes_implementation.md         ← este archivo
```

## Checklist

- [ ] Definir THEMES y DEFAULT_THEME
- [ ] Crear función resolveTheme
- [ ] Actualizar createContextMenu para recibir theme/overrides
- [ ] Función applyTheme
- [ ] Actualizar activate() para aplicar tema
- [ ] Actualizar CSS con variables CSS
- [ ] Actualizar test con ejemplos
- [ ] Probar en navegador