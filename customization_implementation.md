# Implementación de personalización de items

## Tipos de item

```js
{
  text?: string,
  icon?: string,
  type?: "color" | "range" | "checkbox",
  value?: any,
  onChange?: (val) => void,
  divider?: boolean,
  disabled?: boolean,
  render?: (container, { onSelect, onChange }) => void,
  children?: Item[]
}
```

## Tipos prediseñados

### color
- `<input type="color">`
- Valor inicial: `value` (string hex, ej: "#ff0000")
- `onChange` recibe el color seleccionado

### range
- `<input type="range">`
- Propiedades: `min`, `max`, `value`
- Muestra el valor actual junto al input
- `onChange` recibe el número

### checkbox
- `<input type="checkbox">`
- Valor inicial: `value` (boolean)
- `onChange` recibe el boolean

## Render custom

Permite crear items completamente personalizados:

```js
{
  text: "Tamaño",
  render: (container, { onSelect, onChange }) => {
    const select = document.createElement('select');
    select.innerHTML = '<option>Pequeño</option><option>Mediano</option><option>Grande</option>';
    select.addEventListener('change', () => onChange(select.value));
    container.appendChild(select);
  }
}
```

- `onSelect` — cierra el menú y pasa valor al callback principal
- `onChange` — callback individual del item

## Helpers disponibles en render

| Helper | Uso |
|--------|-----|
| `onSelect(value)` | Cierra el menú, pasa `value` al `onSelect` global |
| `onChange(value)` | Llama al `onChange` del item, menú sigue abierto |

## Validación de items

Item vacío o sin contenido válido se salta silenciosamente:

```js
if (!item.text && !item.icon && !item.type && !item.render && !item.children && !item.divider) return;
```

## Pasos de implementación

### 1. CSS — contextual_menu.css

- Estilos base para inputs dentro del menú
- `input[type="color"]` — tamaño apropiado, borde estilizado
- `input[type="range"]` — ancho completo, altura del thumb coherente
- `input[type="checkbox"]` — alineado con texto, spacing correcto
- `.cm-input-wrapper` — contenedor común para inputs

### 2. JS — contextual_menu.js

#### 2.1. Modificar `renderMenu`

- Añadir validación de item vacío
- Añadir render de iconos
- Añadir render de inputs prediseñados

#### 2.2. Render de color

```js
// Pseudocódigo
const colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.value = item.value || '#000000';
colorInput.addEventListener('input', () => item.onChange?.(colorInput.value));
```

#### 2.3. Render de range

```js
// Pseudocódigo
const rangeInput = document.createElement('input');
rangeInput.type = 'range';
rangeInput.min = item.min ?? 0;
rangeInput.max = item.max ?? 100;
rangeInput.value = item.value ?? item.min ?? 0;
const valueDisplay = document.createElement('span');
valueDisplay.textContent = rangeInput.value;
rangeInput.addEventListener('input', () => {
  valueDisplay.textContent = rangeInput.value;
  item.onChange?.(Number(rangeInput.value));
});
```

#### 2.4. Render de checkbox

```js
// Pseudocódigo
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.checked = item.value ?? false;
checkbox.addEventListener('change', () => item.onChange?.(checkbox.checked));
```

#### 2.5. Render custom

```js
// Dentro del switch de tipos
case undefined:
  if (item.render) {
    item.render(container, {
      onSelect: (val) => close(false, val),
      onChange: (val) => item.onChange?.(val)
    });
  }
```

### 3. Test — script.js

Crear ejemplos para cada tipo:

```js
{
  id: 'cell-custom',
  items: [
    { text: 'Color', type: 'color', value: '#ff0000', onChange: (c) => console.log(c) },
    { text: 'Tamaño', type: 'range', min: 10, max: 100, value: 50, onChange: (v) => console.log(v) },
    { divider: true },
    { text: 'Activar', type: 'checkbox', value: false, onChange: (v) => console.log(v) },
    { divider: true },
    {
      text: 'Estilo',
      children: [
        { text: 'Custom', render: (container, { onChange }) => { /* crear select */ } }
      ]
    }
  ]
}
```

## Posibles problemas a tener en cuenta

- **Event bubbling:** Los inputs deben tener `e.stopPropagation()` para evitar que el click cierre el menú
- **Posicionamiento:** Los inputs pueden alterar el tamaño del menú, asegurar que `positionMenu` se calcula correctamente
- **Focus:** Inputs dentro del menú no deben cerrar el menú al hacer click
- **Discapacidad visual:** Los inputs deben ser accesibles y navegables con keyboard (futura mejora)