# Menú Contextual — Cómo Usar

Herramienta para crear menús contextuales personalizados con HTML, CSS y JavaScript vanilla. Sin dependencias.

## Instalación

1. Copia los archivos `contextual_menu.js` y `contextual_menu.css` en tu proyecto
2. Incluye ambos archivos en tu HTML:

```html
<link rel="stylesheet" href="contextual_menu.css">
<script src="contextual_menu.js"></script>
```

## Uso Básico

```js
const menu = createContextMenu({
  items: [
    { text: 'Opción 1' },
    { text: 'Opción 2' },
    { text: 'Opción 3' }
  ],
  onSelect: (value) => {
    console.log('Seleccionado:', value);
  }
});

// Abrir el menú al hacer click
document.addEventListener('click', (e) => {
  menu.activate(e.clientX, e.clientY);
});
```

## API

### createContextMenu(config)

Crea una instancia de menú. Recibe un objeto con:

| Propiedad | Descripción |
|-----------|-------------|
| `items` | Array de elementos del menú |
| `theme` | Tema predefinido: `'dark'` o `'light'` |
| `overrides` | Personalización adicional del tema |
| `onSelect` | Función que recibe el valor seleccionado |

### Métodos de la instancia

```js
menu.activate(x, y)  // Abre el menú en la posición indicada
menu.close()          // Cierra el menú (devuelve null)
menu.destroy()        // Limpia el menú y elimina listeners
```

## Estructura de Items

Cada elemento del menú puede ser:

### Item de texto simple

```js
{ text: 'Guardar' }
```

### Item con icono

```js
{ text: 'Guardar', icon: '💾' }
```

### Item deshabilitado

```js
{ text: 'Copiar', disabled: true }
```

### Separador

```js
{ divider: true }
```

### Submenú

```js
{
  text: 'Formato',
  children: [
    { text: 'Negrita' },
    { text: 'Cursiva' }
  ]
}
```

### Selector de color

```js
{
  text: 'Color',
  type: 'color',
  value: '#ff0000',
  onChange: (color) => console.log(color)
}
```

### Selector de rango

```js
{
  text: 'Opacidad',
  type: 'range',
  min: 0,
  max: 100,
  value: 50,
  onChange: (valor) => console.log(valor)
}
```

### Casilla de verificación

```js
{ text: 'Activar', type: 'checkbox', value: false, onChange: (checked) => console.log(checked) }
```

### Item personalizado (render)

```js
{
  text: 'Tamaño',
  render: (container, helpers) => {
    const select = document.createElement('select');
    select.innerHTML = '<option>Pequeño</option><option>Grande</option>';
    select.addEventListener('change', () => {
      helpers.onChange(select.value);
    });
    container.appendChild(select);
  }
}
```

Helpers disponibles en `render`:

| Helper | Descripción |
|--------|-------------|
| `onSelect(val)` | Cierra el menú y pasa el valor al `onSelect` global |
| `onChange(val)` | Llama al `onChange` del item sin cerrar el menú |

## Temas

### Tema oscuro (default)

```js
createContextMenu({
  items: [...],
  onSelect: ...
})
```

### Tema claro

```js
createContextMenu({
  items: [...],
  theme: 'light',
  onSelect: ...
})
```

### Tema custom

```js
createContextMenu({
  items: [...],
  theme: {
    background: '#1a1a2e',
    text: '#eaf',
    border: '#4a4a6a',
    hover: '#2a2a4e'
  },
  onSelect: ...
})
```

### Tema con overrides

```js
createContextMenu({
  items: [...],
  theme: 'light',
  overrides: {
    background: '#f0f0f0',
    borderRadius: '12px'
  },
  onSelect: ...
})
```

### Propiedades de tema disponibles

| Propiedad | Descripción | Default (dark) |
|-----------|-------------|-----------------|
| `background` | Color de fondo | `#1e1e1e` |
| `text` | Color del texto | `#e0e0e0` |
| `border` | Color del borde | `#333` |
| `hover` | Color al pasar el ratón | `#3a3a3a` |
| `disabled` | Color de items deshabilitados | `#666` |
| `shadow` | Sombra del menú | `0 4px 12px rgba(0,0,0,0.4)` |
| `borderRadius` | Redondeo de esquinas | `6px` |
| `fontSize` | Tamaño de fuente | `14px` |
| `fontFamily` | Familia tipográfica | `system-ui, sans-serif` |
| `arrow` | Color de la flecha `›` | `#888` |
| `divider` | Color del separador | `#333` |
| `inputAccent` | Color de inputs | `#888` |

## Comportamiento

### Apertura

- Se llama a `menu.activate(x, y)` con las coordenadas deseadas
- El menú aparece en esa posición, ajustado si no cabe en pantalla

### Selección

- Click en un item → devuelve su texto, cierra el menú
- Click fuera → cierra el menú, devuelve `null`
- Tecla Escape → cierra el menú, devuelve `null`
- Scroll en la página → cierra el menú, devuelve `null`

### Submenús

- Se abren con click o con hover tras 500ms
- El símbolo `›` indica que hay submenú
- Se reposicionan si no caben en pantalla

### Múltiples menús

Solo puede haber un menú abierto a la vez. Abrir uno cierra el anterior silenciosamente.

## Ejemplo Completo

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="contextual_menu.css">
</head>
<body>
  <button id="menuBtn">Menú</button>
  <script src="contextual_menu.js"></script>
  <script>
    const menu = createContextMenu({
      items: [
        { text: 'Nuevo', icon: '📄' },
        { text: 'Abrir', icon: '📂' },
        { divider: true },
        {
          text: 'Color de fondo',
          children: [
            { text: 'Rojo' },
            { text: 'Verde' },
            { text: 'Azul' }
          ]
        },
        { text: 'Ajustes', type: 'range', min: 0, max: 100, value: 50 }
      ],
      theme: 'dark',
      onSelect: (value) => {
        console.log('Seleccionado:', value);
      }
    });

    document.getElementById('menuBtn').addEventListener('click', (e) => {
      menu.activate(e.clientX, e.clientY);
    });
  </script>
</body>
</html>
```