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
    theme: 'light',
    items: [
      { text: 'Color', type: 'color', value: '#ff5500' },
      { text: 'Opacidad', type: 'range', min: 0, max: 100, value: 75 },
      { divider: true },
      { text: 'Activar modo oscuro', type: 'checkbox', value: false }
    ]
  },
  {
    id: 'cell4',
    theme: 'light',
    overrides: {
      background: '#3760b3',
      border: '#00ff00',
      hover: '#8b0000',
      text: '#000000',
      fontSize: '24px',
      fontFamily: 'Georgia, serif'
    },
    items: [
      { text: 'Color favorito', type: 'color', value: '#00ff00', onChange: (c) => console.log('Color:', c) },
      { text: 'Tamaño', type: 'range', min: 10, max: 100, value: 50, onChange: (v) => console.log('Tamaño:', v) },
      { divider: true },
      {
        text: 'Estilo',
        children: [
          { text: 'Moderno' },
          { text: 'Clásico' },
          { text: 'Minimalista' }
        ]
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
    theme: config.theme,
    overrides: config.overrides,
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