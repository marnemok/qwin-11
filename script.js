// Windows 11 Web Clone - Main Script

'use strict';

// === CONSTANTS ===
const SELECTORS = {
    DESKTOP: '#desktop',
    WINDOW_AREA: '#window-area',
    TASKBAR: '#taskbar',
    START_MENU: '#start-menu',
    START_BTN: '#start-btn',
    NOTIFY_BTN: '#notify-btn',
    NOTIFICATION_CENTER: '#notification-center',
    NC_CLOSE: '#nc-close',
    NC_MONTH: '#nc-month',
    NC_DAYS: '#nc-days',
    CONTEXT_MENU: '#context-menu',
    CLOCK_TIME: '#clock-time',
    CLOCK_DATE: '#clock-date',
    TB_ICONS: '.tb-icons'
};

const APP_INFO = {
    pc: { title: 'Этот ПК', content: '<h3>Устройства и диски</h3><p>Локальный диск (C:)</p><p>Системный диск</p>' },
    docs: { title: 'Документы', content: '<h3>Мои документы</h3><p>Папка пуста</p>' },
    trash: { title: 'Корзина', content: '<h3>Корзина</h3><p>Файлов нет</p>' }
};

// === STATE ===
const state = {
    windows: [],
    activeWindowId: null,
    zIndexCounter: 100,
    isStartMenuOpen: false,
    isNotificationCenterOpen: false
};

// === DOM ELEMENTS ===
const elements = {};

// === INITIALIZATION ===
function init() {
    cacheElements();
    setupClock();
    setupStartMenu();
    setupNotificationCenter();
    setupContextMenu();
    setupDesktopIcons();
    renderCalendar();
}

function cacheElements() {
    Object.keys(SELECTORS).forEach(key => {
        elements[key] = document.querySelector(SELECTORS[key]);
    });
}

// === CLOCK ===
function setupClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    
    const timeStr = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const dateStr = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    if (elements.CLOCK_TIME) {
        elements.CLOCK_TIME.textContent = timeStr;
    }
    if (elements.CLOCK_DATE) {
        elements.CLOCK_DATE.textContent = dateStr;
    }
}

// === START MENU ===
function setupStartMenu() {
    if (!elements.START_BTN || !elements.START_MENU) return;
    
    elements.START_BTN.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });
    
    elements.START_MENU.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.addEventListener('click', () => {
        closeStartMenu();
    });
}

function toggleStartMenu() {
    state.isStartMenuOpen = !state.isStartMenuOpen;
    elements.START_MENU.classList.toggle('visible', state.isStartMenuOpen);
    closeNotificationCenter();
}

function closeStartMenu() {
    state.isStartMenuOpen = false;
    elements.START_MENU.classList.remove('visible');
}

// === NOTIFICATION CENTER ===
function setupNotificationCenter() {
    if (!elements.NOTIFY_BTN || !elements.NOTIFICATION_CENTER) return;
    
    elements.NOTIFY_BTN.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNotificationCenter();
    });
    
    if (elements.NC_CLOSE) {
        elements.NC_CLOSE.addEventListener('click', closeNotificationCenter);
    }
    
    elements.NOTIFICATION_CENTER.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.addEventListener('click', () => {
        closeNotificationCenter();
    });
}

function toggleNotificationCenter() {
    state.isNotificationCenterOpen = !state.isNotificationCenterOpen;
    elements.NOTIFICATION_CENTER.classList.toggle('visible', state.isNotificationCenterOpen);
    closeStartMenu();
}

function closeNotificationCenter() {
    state.isNotificationCenterOpen = false;
    elements.NOTIFICATION_CENTER.classList.remove('visible');
}

// === CALENDAR ===
function renderCalendar() {
    if (!elements.NC_MONTH || !elements.NC_DAYS) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    elements.NC_MONTH.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    let daysHTML = '';
    
    for (let i = 0; i < adjustedFirstDay; i++) {
        const prevMonthDay = new Date(year, month, 0).getDate() - adjustedFirstDay + i + 1;
        daysHTML += `<div class="cw-day other-month">${prevMonthDay}</div>`;
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today ? 'today' : '';
        daysHTML += `<div class="cw-day ${isToday}">${day}</div>`;
    }
    
    const remainingDays = 42 - (adjustedFirstDay + daysInMonth);
    for (let i = 1; i <= remainingDays; i++) {
        daysHTML += `<div class="cw-day other-month">${i}</div>`;
    }
    
    elements.NC_DAYS.innerHTML = daysHTML;
}

// === CONTEXT MENU ===
function setupContextMenu() {
    if (!elements.CONTEXT_MENU) return;
    
    elements.DESKTOP.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY);
    });
    
    document.addEventListener('click', hideContextMenu);
    document.addEventListener('contextmenu', hideContextMenu);
    
    const refreshBtn = document.getElementById('ctx-refresh');
    const newBtn = document.getElementById('ctx-new');
    const propsBtn = document.getElementById('ctx-props');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            location.reload();
        });
    }
    
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            alert('Функция создания файла будет добавлена позже');
        });
    }
    
    if (propsBtn) {
        propsBtn.addEventListener('click', () => {
            alert('Свойства системы:\nOS: Windows 11 Web Clone\nVersion: 1.0.0');
        });
    }
}

function showContextMenu(x, y) {
    const menu = elements.CONTEXT_MENU;
    const rect = menu.getBoundingClientRect();
    
    let posX = x;
    let posY = y;
    
    if (x + rect.width > window.innerWidth) {
        posX = window.innerWidth - rect.width - 10;
    }
    if (y + rect.height > window.innerHeight - 48) {
        posY = window.innerHeight - 48 - rect.height - 10;
    }
    
    menu.style.left = `${posX}px`;
    menu.style.top = `${posY}px`;
    menu.classList.remove('hidden');
}

function hideContextMenu() {
    elements.CONTEXT_MENU.classList.add('hidden');
}

// === DESKTOP ICONS ===
function setupDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    
    icons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appType = icon.dataset.app;
            if (APP_INFO[appType]) {
                createWindow(APP_INFO[appType].title, APP_INFO[appType].content);
            }
        });
    });
}

// === WINDOW MANAGEMENT ===
function createWindow(title, content) {
    const id = `window-${Date.now()}`;
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = id;
    windowEl.style.left = `${100 + state.windows.length * 30}px`;
    windowEl.style.top = `${50 + state.windows.length * 30}px`;
    windowEl.style.width = '500px';
    windowEl.style.height = '350px';
    windowEl.style.zIndex = ++state.zIndexCounter;
    
    windowEl.innerHTML = `
        <div class="window-header">
            <span class="window-title">${title}</span>
            <div class="window-controls">
                <button class="window-btn minimize" title="Свернуть">─</button>
                <button class="window-btn maximize" title="Развернуть">□</button>
                <button class="window-btn close" title="Закрыть">✕</button>
            </div>
        </div>
        <div class="window-content">${content}</div>
        <div class="window-resize-handle"></div>
    `;
    
    elements.WINDOW_AREA.appendChild(windowEl);
    
    state.windows.push({ id, element: windowEl, minimized: false, maximized: false });
    
    setupWindowEvents(windowEl, id);
    addTaskbarIcon(id, title);
    focusWindow(id);
}

function setupWindowEvents(windowEl, id) {
    const header = windowEl.querySelector('.window-header');
    const closeBtn = windowEl.querySelector('.window-btn.close');
    const minimizeBtn = windowEl.querySelector('.window-btn.minimize');
    const maximizeBtn = windowEl.querySelector('.window-btn.maximize');
    const resizeHandle = windowEl.querySelector('.window-resize-handle');
    
    let isDragging = false;
    let isResizing = false;
    let startX, startY, startLeft, startTop, startWidth, startHeight;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return;
        
        const winData = state.windows.find(w => w.id === id);
        if (winData && winData.maximized) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = windowEl.offsetLeft;
        startTop = windowEl.offsetTop;
        
        focusWindow(id);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            windowEl.style.left = `${startLeft + dx}px`;
            windowEl.style.top = `${startTop + dy}px`;
        }
        
        if (isResizing) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            windowEl.style.width = `${Math.max(300, startWidth + dx)}px`;
            windowEl.style.height = `${Math.max(200, startHeight + dy)}px`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
    });
    
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowEl.offsetWidth;
        startHeight = windowEl.offsetHeight;
        focusWindow(id);
    });
    
    closeBtn.addEventListener('click', () => {
        closeWindow(id);
    });
    
    minimizeBtn.addEventListener('click', () => {
        minimizeWindow(id);
    });
    
    maximizeBtn.addEventListener('click', () => {
        toggleMaximize(id);
    });
    
    windowEl.addEventListener('mousedown', () => {
        focusWindow(id);
    });
}

function focusWindow(id) {
    const winData = state.windows.find(w => w.id === id);
    if (!winData) return;
    
    state.activeWindowId = id;
    winData.element.style.zIndex = ++state.zIndexCounter;
    
    state.windows.forEach(w => {
        const btn = document.querySelector(`.tb-icon[data-window="${w.id}"]`);
        if (btn) {
            btn.classList.toggle('active', w.id === id);
        }
    });
}

function closeWindow(id) {
    const winData = state.windows.find(w => w.id === id);
    if (!winData) return;
    
    winData.element.remove();
    state.windows = state.windows.filter(w => w.id !== id);
    
    const tbIcon = document.querySelector(`.tb-icon[data-window="${id}"]`);
    if (tbIcon) {
        tbIcon.remove();
    }
    
    if (state.activeWindowId === id) {
        state.activeWindowId = null;
    }
}

function minimizeWindow(id) {
    const winData = state.windows.find(w => w.id === id);
    if (!winData) return;
    
    winData.minimized = true;
    winData.element.classList.add('hidden');
    
    const tbIcon = document.querySelector(`.tb-icon[data-window="${id}"]`);
    if (tbIcon) {
        tbIcon.classList.remove('active');
    }
}

function restoreWindow(id) {
    const winData = state.windows.find(w => w.id === id);
    if (!winData) return;
    
    winData.minimized = false;
    winData.element.classList.remove('hidden');
    focusWindow(id);
}

function toggleMaximize(id) {
    const winData = state.windows.find(w => w.id === id);
    if (!winData) return;
    
    winData.maximized = !winData.maximized;
    winData.element.classList.toggle('maximized', winData.maximized);
    
    const maximizeBtn = winData.element.querySelector('.window-btn.maximize');
    if (maximizeBtn) {
        maximizeBtn.textContent = winData.maximized ? '❐' : '□';
    }
}

function addTaskbarIcon(windowId, title) {
    const container = elements.TB_ICONS;
    if (!container) return;
    
    const btn = document.createElement('button');
    btn.className = 'tb-icon active';
    btn.dataset.window = windowId;
    btn.title = title;
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#0078d4"/>
            <path d="M8 8H16V16H8V8Z" fill="white"/>
        </svg>
    `;
    
    btn.addEventListener('click', () => {
        const winData = state.windows.find(w => w.id === windowId);
        if (winData) {
            if (winData.minimized) {
                restoreWindow(windowId);
            } else if (state.activeWindowId === windowId) {
                minimizeWindow(windowId);
            } else {
                focusWindow(windowId);
            }
        }
    });
    
    container.appendChild(btn);
}

// === RUN ===
document.addEventListener('DOMContentLoaded', init);
