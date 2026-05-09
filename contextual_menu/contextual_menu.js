let activeMenu = null;

function createContextMenu({ items, onSelect }) {
  let menuEl = null;
  let hoverTimeout = null;
  let isOpen = false;
  let justOpened = false;

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
      onSelect(selectedText);
    }
  }

  function clearHoverTimeout() {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  }

  function positionMenu(el, x, y) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    el.style.visibility = 'hidden';
    el.style.display = 'block';
    const rect = el.getBoundingClientRect();
    el.style.visibility = '';
    el.style.display = '';

    let left = x;
    let top = y;

    if (left + rect.width > vw) {
      left = x - rect.width;
    }
    if (top + rect.height > vh) {
      top = y - rect.height;
    }

    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function positionSubmenu(submenuEl, parentEl) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const parentRect = parentEl.getBoundingClientRect();
    const subRect = submenuEl.getBoundingClientRect();

    let left = parentRect.right;
    let top = parentRect.top;

    if (left + subRect.width > vw) {
      left = parentRect.left - subRect.width;
    }
    if (top + subRect.height > vh) {
      top = vh - subRect.height;
    }
    if (top < 0) {
      top = 0;
    }

    submenuEl.style.left = left + 'px';
    submenuEl.style.top = top + 'px';
  }

  function openSubmenu(itemEl, itemData) {
    const existing = itemEl.querySelector('.cm-submenu');
    if (existing) return;

    const submenu = document.createElement('div');
    submenu.className = 'cm-submenu';
    renderMenu(submenu, itemData.children, itemEl);

    const parent = itemEl.closest('.cm-menu');
    submenu.style.visibility = 'hidden';
    submenu.style.display = 'block';
    parent.appendChild(submenu);

    positionSubmenu(submenu, itemEl);

    submenu.style.visibility = '';
    submenu.style.display = '';

    requestAnimationFrame(() => {
      submenu.classList.add('cm-submenu-open');
    });
  }

  function closeSubmenus(container) {
    const submenus = container.querySelectorAll('.cm-submenu');
    submenus.forEach(s => {
      s.classList.remove('cm-submenu-open');
      setTimeout(() => s.remove(), 150);
    });
  }

  function handleItemClick(itemEl, itemData) {
    if (itemData.disabled) return;

    if (itemData.children) {
      const isOpen = itemEl.querySelector('.cm-submenu');
      closeSubmenus(itemEl.closest('.cm-menu'));
      if (!isOpen) {
        openSubmenu(itemEl, itemData);
      }
    } else {
      const selectedText = itemData.text;
      close(false, selectedText);
    }
  }

  function handleItemHover(itemEl, itemData) {
    if (itemData.disabled) return;

    itemEl.classList.add('cm-active');

    const isInSubmenu = itemEl.closest('.cm-submenu');
    if (!isInSubmenu) {
      closeSubmenus(itemEl.closest('.cm-menu'));
    }

    if (itemData.children) {
      clearHoverTimeout();
      hoverTimeout = setTimeout(() => {
        openSubmenu(itemEl, itemData);
      }, 500);
    }
  }

  function handleItemLeave(itemEl) {
    itemEl.classList.remove('cm-active');
    clearHoverTimeout();
  }

  function renderMenu(container, items) {
    container.innerHTML = '';

    items.forEach(item => {
      if (!item.text && !item.icon && !item.type && !item.render && !item.children && !item.divider) {
        return;
      }

      if (item.divider) {
        const div = document.createElement('div');
        div.className = 'cm-divider';
        container.appendChild(div);
        return;
      }

      const el = document.createElement('div');
      el.className = 'cm-item' + (item.disabled ? ' cm-disabled' : '');

      if (item.type) {
        const wrapper = document.createElement('div');
        wrapper.className = 'cm-input-wrapper';

        if (item.icon) {
          const icon = document.createElement('span');
          icon.className = 'cm-icon';
          icon.textContent = item.icon;
          wrapper.appendChild(icon);
        }

        if (item.type === 'color') {
          const colorInput = document.createElement('input');
          colorInput.type = 'color';
          colorInput.value = item.value || '#000000';
          colorInput.addEventListener('input', (e) => {
            e.stopPropagation();
            item.onChange?.(colorInput.value);
          });
          colorInput.addEventListener('click', (e) => e.stopPropagation());
          wrapper.appendChild(colorInput);
        }

        if (item.type === 'range') {
          const rangeInput = document.createElement('input');
          rangeInput.type = 'range';
          rangeInput.min = item.min ?? 0;
          rangeInput.max = item.max ?? 100;
          rangeInput.value = item.value ?? item.min ?? 0;

          const valueDisplay = document.createElement('span');
          valueDisplay.className = 'cm-range-value';
          valueDisplay.textContent = rangeInput.value;

          rangeInput.addEventListener('input', (e) => {
            e.stopPropagation();
            valueDisplay.textContent = rangeInput.value;
            item.onChange?.(Number(rangeInput.value));
          });
          rangeInput.addEventListener('click', (e) => e.stopPropagation());

          wrapper.appendChild(rangeInput);
          wrapper.appendChild(valueDisplay);
        }

        if (item.type === 'checkbox') {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = item.value ?? false;

          if (item.text) {
            const label = document.createElement('label');
            label.textContent = item.text;
            checkbox.addEventListener('change', (e) => {
              e.stopPropagation();
              item.onChange?.(checkbox.checked);
            });
            checkbox.addEventListener('click', (e) => e.stopPropagation());
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
          } else {
            checkbox.addEventListener('change', (e) => {
              e.stopPropagation();
              item.onChange?.(checkbox.checked);
            });
            checkbox.addEventListener('click', (e) => e.stopPropagation());
            wrapper.appendChild(checkbox);
          }
        }

        el.appendChild(wrapper);
        container.appendChild(el);
        return;
      }

      if (item.render) {
        const wrapper = document.createElement('div');
        wrapper.className = 'cm-input-wrapper';
        item.render(wrapper, {
          onSelect: (val) => close(false, val),
          onChange: (val) => item.onChange?.(val)
        });
        el.appendChild(wrapper);
        container.appendChild(el);
        return;
      }

      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'cm-icon';
        icon.textContent = item.icon;
        el.appendChild(icon);
      }

      const label = document.createElement('span');
      label.className = 'cm-label';
      label.textContent = item.text || '';
      el.appendChild(label);

      if (item.children) {
        const arrow = document.createElement('span');
        arrow.className = 'cm-arrow';
        arrow.textContent = '›';
        el.appendChild(arrow);
      }

      if (!item.disabled) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          handleItemClick(el, item);
        });

        el.addEventListener('mouseenter', () => {
          handleItemHover(el, item);
        });

        el.addEventListener('mouseleave', () => {
          handleItemLeave(el);
        });
      }

      container.appendChild(el);
    });
  }

  function activate(x, y) {
    close();

    if (activeMenu && activeMenu !== menuInstance) {
      activeMenu.close(true);
    }

    menuEl = document.createElement('div');
    menuEl.className = 'cm-menu';
    menuEl.style.visibility = 'hidden';
    menuEl.style.display = 'block';
    document.body.appendChild(menuEl);

    renderMenu(menuEl, items);

    positionMenu(menuEl, x, y);

    menuEl.style.visibility = '';
    menuEl.style.display = '';
    menuEl.classList.add('cm-open');

    isOpen = true;
    justOpened = true;
    activeMenu = menuInstance;
    setTimeout(() => { justOpened = false; }, 100);
  }

  function onKeyDown(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  function onScroll() {
    if (isOpen) {
      close();
    }
  }

  function onClickOutside(e) {
    if (justOpened) return;
    if (!e.target.closest('.cm-menu')) {
      close();
    }
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('scroll', onScroll, true);
  document.addEventListener('click', onClickOutside);

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

  return menuInstance;
}