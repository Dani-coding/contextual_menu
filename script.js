const menus = [
  {
    id: 'cell1',
    items: [
      { text: 'Nuevo archivo', icon: '📄' },
      { text: 'Abrir...', icon: '📂' },
      { text: 'Guardar', icon: '💾' },
      { divider: true },
      { text: 'Cerrar' }
    ]
  },
  {
    id: 'cell2',
    items: [
      { text: 'Copiar', disabled: true },
      { text: 'Pegar' },
      { text: 'Cortar' },
      { divider: true },
      { text: 'Seleccionar todo' }
    ]
  },
  {
    id: 'cell3',
    items: [
      {
        text: 'Formato',
        icon: '🎨',
        children: [
          { text: 'Negrita' },
          { text: 'Cursiva' },
          { text: 'Subrayado' },
          {
            text: 'Color',
            children: [
              { text: 'Rojo' },
              { text: 'Verde' },
              { text: 'Azul' }
            ]
          }
        ]
      },
      { text: 'Alinear', disabled: true },
      { text: 'Ordenar' }
    ]
  },
  {
    id: 'cell4',
    items: [
      { text: 'Color', type: 'color', value: '#ff0000', onChange: (c) => console.log('Color:', c) },
      { text: 'Opacidad', type: 'range', min: 0, max: 100, value: 75, onChange: (v) => console.log('Opacidad:', v) },
      { divider: true },
      { text: 'Activar modo oscuro', type: 'checkbox', value: false, onChange: (v) => console.log('Checkbox:', v) },
      { divider: true },
      {
        text: 'Estilo',
        render: (container, { onChange }) => {
          const select = document.createElement('select');
          select.style.cssText = 'background: #333; color: #e0e0e0; border: 1px solid #555; padding: 4px; width: 100%;';
          select.innerHTML = `
            <option value="moderno">Moderno</option>
            <option value="clasico">Clásico</option>
            <option value="minimalista">Minimalista</option>
          `;
          select.addEventListener('change', (e) => {
            e.stopPropagation();
            onChange(select.value);
          });
          select.addEventListener('click', (e) => e.stopPropagation());
          container.appendChild(select);
        }
      }
    ]
  }
];

const menuInstances = menus.map(config => {
  const cell = document.getElementById(config.id);
  const result = cell.querySelector('.result');
  const resultText = result.textContent;

  const menu = createContextMenu({
    items: config.items,
    onSelect: (text) => {
      if (text === null) {
        result.textContent = resultText;
      } else {
        result.textContent = text;
      }
    }
  });

  cell.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.activate(e.clientX, e.clientY);
  });

  return menu;
});