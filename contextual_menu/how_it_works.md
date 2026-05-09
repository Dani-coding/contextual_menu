# Menú Contextual — Cómo Funciona

Documentación técnica para entender y modificar el código de la herramienta.

## Estructura de Archivos

```
contextual_menu/
├── contextual_menu.js    # Lógica principal
├── contextual_menu.css   # Estilos
├── how_to_use.md         # Documentación de uso
└── how_it_works.md       # Este archivo

```

## Arquitectura General

La herramienta sigue un patrón de **instancia única por menú**:

1. `createContextMenu()` devuelve un objeto con métodos públicos (`activate`, `close`, `destroy`)
2. Cada instancia mantiene su propio estado (elementos DOM, variables de control)
3. Los eventos globales se comparten entre todas las instancias

## JavaScript (contextual_menu.js)

### Variables Globales

```js
let activeMenu = null;  // Referencia al menú activo actualmente
```

### Temas Predefinidos

```js
const THEMES = {
  dark: { ... },
  light: { ... }
};
const DEFAULT_THEME = THEMES.dark;
```

Define los colores base para cada tema. Los temas se combinan con overrides en `resolveTheme`.

### Función resolveTheme(theme, overrides)

Combina tema base + overrides:

```js
function resolveTheme(theme, overrides) {
  let base = DEFAULT_THEME;

  // Si es string 'dark' o 'light', usar ese tema
  if (theme === 'dark' || theme === 'light') {
    base = THEMES[theme];
  }
  // Si es objeto, usar directamente
  else if (theme && typeof theme === 'object') {
    base = { ...DEFAULT_THEME, ...theme };
  }

  // Aplicar overrides
  if (overrides && typeof overrides === 'object') {
    return { ...base, ...overrides };
  }

  return base;
}
```

### Función applyTheme(el, theme)

Aplica el tema al elemento usando CSS custom properties:

```js
function applyTheme(el, theme) {
  el.style.setProperty('--cm-background', theme.background);
  el.style.setProperty('--cm-text', theme.text);
  // ... resto de propiedades
}
```

### Función createContextMenu(config)

Función principal que crea una instancia de menú.

#### Estado interno

```js
let menuEl = null;        // Elemento DOM del menú
let hoverTimeout = null;   // Timeout para abrir submenús
let isOpen = false;        // Si el menú está abierto
let justOpened = false;    // Flag para ignorar primer click
let resolvedTheme = null;  // Tema resuelto
```

#### Función close(silent, selectedText)

Cierra el menú:

```js
function close(silent = false, selectedText = null) {
  if (!isOpen) return;
  isOpen = false;
  clearHoverTimeout();
  if (menuEl && menuEl.parentNode) {
    menuEl.parentNode.removeChild(menuEl);
  }
  menuEl = null;
  if (activeMenu === menuInstance) {
    activeMenu = null;
  }
  if (!silent) {
    onSelect(selectedText);  // Llama al callback si no es silencio
  }
}
```

- `silent=true` → no llama a `onSelect`
- `silent=false` → llama a `onSelect` con el valor seleccionado

#### Función renderMenu(container, items)

Renderiza todos los items del menú. Flujo:

1. Limpia el contenedor
2. Para cada item:
   - Si está vacío (`{}`), salta
   - Si es `divider`, crea línea separadora
   - Si tiene `type`, renderiza input (color/range/checkbox)
   - Si tiene `render`, llama a la función custom
   - Si tiene `icon`, añade icono
   - Siempre añade columna de icono (vacía si no hay)
   - Añade label con texto
   - Si tiene `children`, añade flecha `›`

#### Posicionamiento

##### positionMenu(el, x, y)

Posiciona el menú principal:

```js
// Oculta para medir tamaño real
el.style.visibility = 'hidden';
el.style.display = 'block';
const rect = el.getBoundingClientRect();
// Restaura visibilidad
el.style.visibility = '';
el.style.display = '';

// Ajusta si no cabe en pantalla
if (left + rect.width > vw) left = x - rect.width;
if (top + rect.height > vh) top = y - rect.height;
```

##### positionSubmenu(submenuEl, parentEl)

Posiciona submenús junto al item padre:

```js
let left = parentRect.right;   // Comienza a la derecha del padre
let top = parentRect.top;

// Ajusta si no cabe a la derecha → usa izquierda
if (left + subRect.width > vw) {
  left = parentRect.left - subRect.width;
}
// Ajusta si no cabe abajo → usa arriba
if (top + subRect.height > vh) {
  top = vh - subRect.height;
}
if (top < 0) top = 0;
```

#### Submenús

##### openSubmenu(itemEl, itemData)

1. Crea el elemento submenú
2. Lo añade al DOM oculto
3. Lo posiciona con `positionSubmenu`
4. Lo hace visible con clase `.cm-submenu-open`

##### closeSubmenus(container)

Cierra todos los submenús de un contenedor eliminándolos del DOM.

#### Eventos

##### activate(x, y)

Abre el menú:

```js
function activate(x, y) {
  close();  // Cierra cualquier menú abierto

  // Si hay otro menú activo, lo cierra silenciosamente
  if (activeMenu && activeMenu !== menuInstance) {
    activeMenu.close(true);
  }

  resolvedTheme = resolveTheme(theme, overrides);

  menuEl = document.createElement('div');
  menuEl.className = 'cm-menu';

  // Oculto para medir antes de mostrar
  menuEl.style.visibility = 'hidden';
  menuEl.style.display = 'block';
  document.body.appendChild(menuEl);

  applyTheme(menuEl, resolvedTheme);
  renderMenu(menuEl, items);

  // Ajusta columna de iconos
  if (items.some(item => item.icon)) {
    menuEl.classList.add('cm-has-icons');
  }

  positionMenu(menuEl, x, y);

  menuEl.style.visibility = '';
  menuEl.style.display = '';
  menuEl.classList.add('cm-open');

  isOpen = true;
  justOpened = true;
  activeMenu = menuInstance;
  setTimeout(() => { justOpened = false; }, 100);
}
```

##### onClickOutside(e)

Cierra el menú si se hace click fuera. Ignora si `justOpened=true` para evitar cerrar el menú inmediatamente al abrirlo.

##### onScroll()

Cierra el menú al hacer scroll en el documento.

##### onKeyDown(e)

Solo maneja Escape para cerrar el menú.

#### Instancia devuelta

```js
const menuInstance = {
  activate,
  close: (silent = false) => {
    close(silent);
  },
  destroy() {
    close();
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('scroll', onScroll, true);
    document.removeEventListener('click', onClickOutside);
  }
};
```

## CSS (contextual_menu.css)

### Variables CSS

Todas las propiedades de tema se definen como variables CSS con defaults:

```css
.cm-menu {
  background: var(--cm-background, #1e1e1e);
  color: var(--cm-text, #e0e0e0);
  border: 1px solid var(--cm-border, #333);
  /* ... */
}
```

Esto permite que:
- El tema se aplique dinámicamente vía JavaScript
- Si no se define un valor, usa el default
- Se puede hacer override por CSS externo

### Estructura Grid

Los items usan CSS Grid para alinear iconos y textos:

```css
.cm-item {
  display: grid;
  grid-template-columns: 0px 1fr auto;
  /* Columnas: icono | texto | flecha */
}

.cm-menu.cm-has-icons .cm-item {
  grid-template-columns: 24px 1fr auto;
  /* Columnas: icono (24px) | texto | flecha */
}
```

Sin iconos: columna de icono = 0px (no ocupa espacio)
Con iconos: columna de icono = 24px (espacio fijo para alinear textos)

### Selectores importantes

| Selector | Propósito |
|----------|-----------|
| `.cm-menu` | Menú principal |
| `.cm-submenu` | Submenús |
| `.cm-item` | Cada item |
| `.cm-item.cm-disabled` | Items deshabilitados |
| `.cm-item.cm-active` | Item bajo el cursor |
| `.cm-label` | Texto del item |
| `.cm-icon` | Icono (o espacio vacío) |
| `.cm-arrow` | Flecha `›` de submenú |
| `.cm-divider` | Línea separadora |
| `.cm-input-wrapper` | Contenedor de inputs |
| `.cm-has-icons` | Clase que activa columna de iconos |

## Flujo de Datos

```
Usuario abre menú
    ↓
createContextMenu → activate(x, y)
    ↓
resolveTheme(theme, overrides) → theme combinado
    ↓
createElement + applyTheme + renderMenu
    ↓
Menú visible con callbacks configurados
    ↓
Usuario interactúa (click, hover)
    ↓
handleItemClick / handleItemHover
    ↓
onSelect(value) / onChange(value)
    ↓
close() → remove DOM
```

## Puntos de Extensión

### Añadir nuevo tipo de input

En `renderMenu`, dentro del bloque `if (item.type)`:

```js
if (item.type === 'micolor') {
  const input = document.createElement('input');
  input.type = 'text';
  // ... configurar
  wrapper.appendChild(input);
}
```

### Añadir nueva propiedad de tema

1. Añadir en `THEMES.dark` y `THEMES.light`
2. Añadir en `applyTheme`:
   ```js
   el.style.setProperty('--cm-nueva', theme.nueva);
   ```
3. Añadir en CSS:
   ```css
   propiedad: var(--cm-nueva, valor-default);
   ```

### Modificar comportamiento de hover

En `handleItemHover`:

```js
function handleItemHover(itemEl, itemData) {
  // Modificar aquí el comportamiento al pasar el ratón
}
```

### Modificar apertura de submenú

El delay de apertura está en `handleItemHover`:

```js
hoverTimeout = setTimeout(() => {
  openSubmenu(itemEl, itemData);
}, 500);  // Cambiar 500ms por otro valor
```