# Menú Contextual — Proyecto

Herramienta reutilizable para crear menús contextuales (click con botón izquierdo).

## Ámbito

- HTML, CSS, Vanilla JS
- Sin dependencias externas

## Estructura de archivos

```
menu_contextual/
├── index.html
├── styles.css
├── script.js
└── contextual_menu/
    ├── contextual_menu.js
    └── contextual_menu.css
```

- `index.html`, `styles.css`, `script.js` — proyecto de test básico
- `contextual_menu.js` y `contextual_menu.css` — módulo exportable

## Proyecto de test

- Grid 2x2 con 4 divs
- Estilo oscuro
- Cada div muestra un menú contextual diferente
- Al seleccionar, el resultado se muestra en grande dentro del div
- Al cerrar sin selección, devuelve `null`

## API del módulo

```js
const menu = createContextMenu({
  items: Item[],
  onSelect: (text: string) => void
});

menu.activate(x, y);  // posición donde aparece
menu.close();         // cierra el menú desde fuera, devuelve null
menu.destroy();       // limpieza del DOM
```

## Formato de datos (Item)

```js
{
  text: string;         // texto del item
  children?: Item[];  // submenú (array recursivo)
  disabled?: boolean;   // item no clickeable
  divider?: boolean;   // línea separadora
  // --- Futuros ---
  icon?: string;       // SVG o clase
  shortcut?: string;   // atajo de teclado
  checked?: boolean;   // marca checkbox
  type?: "item" | "color" | "range" | "text" | "custom";  // variantes futuras
  render?: (container: HTMLElement) => void;  // para type: "custom"
  onSelect?: (value: any) => void;
}
```

Orden de los items según el array (el orden importa).

## Comportamiento

### Apertura
- Se llama a `menu.activate(x, y)`
- El menú aparece en `(x, y)`

### Posicionamiento
1. Intenta derecha + abajo
2. Si no cabe a la derecha → usa izquierda
3. Si no cabe abajo → usa arriba
4. Los submenús siguen la misma lógica

### Navegación
- **Ratón:** hover abre submenú tras 500ms
- Click en item → devuelve texto, cierra menú
- Click fuera / Escape / Scroll → cierra, devuelve `null`

### Submenús
- Símbolo `>` al final si hay `children`
- Se abre con click o con hover tras 500ms

## Eventos de retorno

| Acción | Resultado |
|--------|-----------|
| Click en item | `onSelect(texto)` |
| Click fuera | `null` |
| Escape | `null` |
| Scroll documento | `null` |



### Futuro
- Iconos en items
- Atajos de teclado (`shortcut`)
- Items checked
- Eventos: `onOpen`, `onClose`, `onHover`
- Menú horizontal (estilo barra de herramientas)