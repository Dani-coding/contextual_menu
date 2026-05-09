const menus = [
  {
    id: 'cell1',
    items: [
      { text: 'Nuevo archivo' },
      { text: 'Abrir...' },
      { text: 'Guardar' },
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
      { text: 'Opción A' },
      { text: 'Opción B' },
      { text: 'Opción C' },
      { divider: true },
      {
        text: 'Submenú',
        children: [
          { text: 'Elemento 1' },
          { text: 'Elemento 2' },
          { text: 'Elemento 3' }
        ]
      },
      { divider: true },
      { text: 'Opción D', disabled: true }
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
      if (text !== null) {
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