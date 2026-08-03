// Файловая система (виртуальная)
const fileSystem = {
    root: [
        { name: 'Документы', type: 'folder', path: 'documents' },
        { name: 'Изображения', type: 'folder', path: 'images' },
        { name: 'Загрузки', type: 'folder', path: 'downloads' },
        { name: 'readme.txt', type: 'file', content: 'Добро пожаловать в Qwin 11!' }
    ],
    documents: [
        { name: 'Отчет.docx', type: 'file', content: 'Содержимое отчета...' },
        { name: 'Презентация.pptx', type: 'file', content: 'Слайды презентации...' }
    ],
    images: [
        { name: 'photo1.jpg', type: 'file', content: '[Изображение]' },
        { name: 'screenshot.png', type: 'file', content: '[Изображение]' }
    ],
    downloads: []
};

// История браузера
let browserHistory = JSON.parse(localStorage.getItem('browserHistory')) || [];
let browserCookies = JSON.parse(localStorage.getItem('browserCookies')) || {};

// Состояние приложения
const state = {
    currentPath: 'root',
    windows: [],
    activeWindowId: null,
    zIndex: 100,
    darkTheme: localStorage.getItem('darkTheme') === 'true',
    wallpaper: localStorage.getItem('wallpaper') || '1',
    calendarDate: new Date()
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCalendar();
    initStartMenu();
    initNotificationCenter();
    initContextMenu();
    initDesktopIcons();
    applyTheme();
    applyWallpaper();
    loadFileSystem();
});

// Часы и дата
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    document.getElementById('clock-time').textContent = timeStr;
    document.getElementById('clock-date').textContent = dateStr;
    
    // Обновляем заголовок календаря
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('nc-date-title').textContent = now.toLocaleDateString('ru-RU', options);
}

// Календарь
function initCalendar() {
    renderCalendar(state.calendarDate);
    
    document.getElementById('cal-prev').addEventListener('click', () => {
        state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
        renderCalendar(state.calendarDate);
    });
    
    document.getElementById('cal-next').addEventListener('click', () => {
        state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
        renderCalendar(state.calendarDate);
    });
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    document.getElementById('cal-month-year').textContent = `${monthNames[month]} ${year}`;
    
    const calGrid = document.querySelector('.cal-grid');
    // Удаляем старые дни (оставляем заголовки)
    const dayNames = calGrid.querySelectorAll('.cal-day-name');
    calGrid.innerHTML = '';
    dayNames.forEach(day => calGrid.appendChild(day));
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Пн=0
    
    const today = new Date();
    
    // Пустые ячейки до первого дня
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'cal-day other-month';
        calGrid.appendChild(emptyDay);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-day';
        dayEl.textContent = day;
        
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
        }
        
        calGrid.appendChild(dayEl);
    }
}

// Меню Пуск
function initStartMenu() {
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('hidden');
        document.getElementById('notification-center').classList.add('hidden');
    });
    
    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startBtn) {
            startMenu.classList.add('hidden');
        }
    });
    
    // Клик по приложениям
    document.querySelectorAll('.app-item').forEach(item => {
        item.addEventListener('click', () => {
            const app = item.dataset.app;
            openApp(app);
            startMenu.classList.add('hidden');
        });
    });
}

// Центр уведомлений
function initNotificationCenter() {
    const trayBtn = document.getElementById('tray-btn');
    const nc = document.getElementById('notification-center');
    
    trayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nc.classList.toggle('hidden');
        document.getElementById('start-menu').classList.add('hidden');
    });
    
    document.addEventListener('click', (e) => {
        if (!nc.contains(e.target) && e.target !== trayBtn) {
            nc.classList.add('hidden');
        }
    });
    
    // Быстрые настройки
    document.getElementById('qs-wifi').addEventListener('click', function() {
        this.classList.toggle('active');
    });
    
    document.getElementById('qs-bluetooth').addEventListener('click', function() {
        this.classList.toggle('active');
    });
    
    document.getElementById('qs-theme-toggle').addEventListener('click', () => {
        toggleTheme();
    });
}

// Тема
function toggleTheme() {
    state.darkTheme = !state.darkTheme;
    localStorage.setItem('darkTheme', state.darkTheme);
    applyTheme();
}

function applyTheme() {
    if (state.darkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Обои
function applyWallpaper() {
    document.body.className = state.darkTheme ? 'dark-theme' : '';
    document.body.classList.add(`wallpaper-${state.wallpaper}`);
}

function setWallpaper(num) {
    state.wallpaper = num;
    localStorage.setItem('wallpaper', num);
    applyWallpaper();
}

// Контекстное меню
function initContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        if (e.target.closest('.window-content') || e.target.closest('#desktop')) {
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.classList.remove('hidden');
        }
    });
    
    document.addEventListener('click', () => {
        contextMenu.classList.add('hidden');
    });
    
    document.getElementById('ctx-refresh').addEventListener('click', () => {
        location.reload();
    });
    
    document.getElementById('ctx-new-folder').addEventListener('click', () => {
        createNewFolder();
    });
    
    document.getElementById('ctx-personalize').addEventListener('click', () => {
        openApp('settings');
    });
}

// Иконки рабочего стола
function initDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const app = icon.dataset.app;
            const path = icon.dataset.path;
            
            if (app === 'explorer') {
                openExplorer(path || 'root');
            } else {
                openApp(app);
            }
        });
    });
}

// Открытие приложений
function openApp(appName) {
    switch(appName) {
        case 'explorer':
            openExplorer('root');
            break;
        case 'browser':
            openBrowser();
            break;
        case 'settings':
            openSettings();
            break;
        case 'notepad':
            openNotepad();
            break;
        case 'calculator':
            openCalculator();
            break;
        case 'recycle-bin':
            openRecycleBin();
            break;
    }
}

// Создание окна
function createWindow(title, icon, content, width = 800, height = 500) {
    const id = Date.now();
    state.zIndex++;
    
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = `window-${id}`;
    windowEl.style.width = width + 'px';
    windowEl.style.height = height + 'px';
    windowEl.style.left = (100 + state.windows.length * 30) + 'px';
    windowEl.style.top = (50 + state.windows.length * 30) + 'px';
    windowEl.style.zIndex = state.zIndex;
    
    windowEl.innerHTML = `
        <div class="window-header">
            <div class="window-title"><i class="${icon}"></i> ${title}</div>
            <div class="window-controls">
                <button class="window-btn minimize"><i class="fa-solid fa-minus"></i></button>
                <button class="window-btn maximize"><i class="fa-regular fa-square"></i></button>
                <button class="window-btn close"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>
        <div class="window-content">${content}</div>
    `;
    
    document.getElementById('window-area').appendChild(windowEl);
    
    state.windows.push({ id, element: windowEl, minimized: false });
    setActiveWindow(id);
    
    // Обработчики
    setupWindowHandlers(windowEl, id);
    
    // Добавляем в панель задач
    addToTaskbar(id, icon);
    
    return id;
}

function setupWindowHandlers(windowEl, id) {
    const header = windowEl.querySelector('.window-header');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = windowEl.offsetLeft;
        initialTop = windowEl.offsetTop;
        
        setActiveWindow(id);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        windowEl.style.left = (initialLeft + dx) + 'px';
        windowEl.style.top = (initialTop + dy) + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Кнопки управления
    windowEl.querySelector('.close').addEventListener('click', () => closeWindow(id));
    windowEl.querySelector('.minimize').addEventListener('click', () => minimizeWindow(id));
    windowEl.querySelector('.maximize').addEventListener('click', () => maximizeWindow(id));
    
    // Активное окно при клике
    windowEl.addEventListener('mousedown', () => setActiveWindow(id));
}

function setActiveWindow(id) {
    state.activeWindowId = id;
    state.zIndex++;
    
    state.windows.forEach(win => {
        win.element.style.zIndex = win.id === id ? state.zIndex : state.zIndex - 1;
    });
    
    // Обновляем активное состояние в панели задач
    document.querySelectorAll('.taskbar-app').forEach(app => {
        app.classList.toggle('active', parseInt(app.dataset.windowId) === id);
    });
}

function closeWindow(id) {
    const winIndex = state.windows.findIndex(w => w.id === id);
    if (winIndex === -1) return;
    
    state.windows[winIndex].element.remove();
    state.windows.splice(winIndex, 1);
    
    removeFromTaskbar(id);
}

function minimizeWindow(id) {
    const win = state.windows.find(w => w.id === id);
    if (!win) return;
    
    win.minimized = true;
    win.element.classList.add('hidden');
    
    const taskbarApp = document.querySelector(`.taskbar-app[data-window-id="${id}"]`);
    if (taskbarApp) {
        taskbarApp.classList.remove('active');
    }
}

function maximizeWindow(id) {
    const win = state.windows.find(w => w.id === id);
    if (!win) return;
    
    if (win.element.style.width === '100%') {
        // Восстановить
        win.element.style.width = '800px';
        win.element.style.height = '500px';
        win.element.style.top = '50px';
        win.element.style.left = '100px';
    } else {
        // Развернуть
        win.element.style.width = '100%';
        win.element.style.height = 'calc(100vh - 48px)';
        win.element.style.top = '0';
        win.element.style.left = '0';
    }
}

function addToTaskbar(windowId, icon) {
    const taskbarApps = document.getElementById('taskbar-apps');
    
    const app = document.createElement('button');
    app.className = 'taskbar-app active';
    app.dataset.windowId = windowId;
    app.innerHTML = `<i class="${icon}"></i>`;
    
    app.addEventListener('click', () => {
        const win = state.windows.find(w => w.id === windowId);
        if (!win) return;
        
        if (win.minimized) {
            win.minimized = false;
            win.element.classList.remove('hidden');
            setActiveWindow(windowId);
        } else if (state.activeWindowId === windowId) {
            minimizeWindow(windowId);
        } else {
            setActiveWindow(windowId);
        }
    });
    
    taskbarApps.appendChild(app);
}

function removeFromTaskbar(id) {
    const app = document.querySelector(`.taskbar-app[data-window-id="${id}"]`);
    if (app) app.remove();
}

// Проводник
function openExplorer(path = 'root') {
    state.currentPath = path;
    
    const content = `
        <div class="explorer-layout">
            <div class="explorer-sidebar">
                <div class="sidebar-item ${path === 'root' ? 'active' : ''}" data-path="root">
                    <i class="fa-solid fa-computer"></i> Этот ПК
                </div>
                <div class="sidebar-item ${path === 'documents' ? 'active' : ''}" data-path="documents">
                    <i class="fa-solid fa-folder"></i> Документы
                </div>
                <div class="sidebar-item ${path === 'images' ? 'active' : ''}" data-path="images">
                    <i class="fa-solid fa-image"></i> Изображения
                </div>
                <div class="sidebar-item ${path === 'downloads' ? 'active' : ''}" data-path="downloads">
                    <i class="fa-solid fa-download"></i> Загрузки
                </div>
            </div>
            <div class="explorer-main">
                <div class="explorer-toolbar">
                    <button class="toolbar-btn" id="exp-back"><i class="fa-solid fa-arrow-left"></i> Назад</button>
                    <button class="toolbar-btn" id="exp-new-folder"><i class="fa-solid fa-folder-plus"></i> Новая папка</button>
                    <input type="text" class="explorer-address" value="${getPathName(path)}" readonly>
                </div>
                <div class="file-grid" id="file-grid-${path}"></div>
            </div>
        </div>
    `;
    
    const windowId = createWindow('Проводник', 'fa-solid fa-folder', content);
    
    renderFiles(path);
    
    // Обработчики проводника
    setTimeout(() => {
        const win = document.getElementById(`window-${windowId}`);
        
        win.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                const newPath = item.dataset.path;
                renderFiles(newPath, windowId);
                
                win.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                win.querySelector('.explorer-address').value = getPathName(newPath);
            });
        });
        
        win.querySelector('#exp-new-folder').addEventListener('click', () => {
            createNewFolderInCurrent(path, windowId);
        });
    }, 0);
}

function getPathName(path) {
    const names = {
        root: 'Этот ПК',
        documents: 'Документы',
        images: 'Изображения',
        downloads: 'Загрузки'
    };
    return names[path] || path;
}

function renderFiles(path, windowId) {
    const files = fileSystem[path] || [];
    let grid;
    
    if (windowId) {
        const win = document.getElementById(`window-${windowId}`);
        grid = win.querySelector('.file-grid');
    } else {
        grid = document.querySelector('.file-grid');
    }
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Кнопка "Наверх" если не корень
    if (path !== 'root') {
        const upItem = document.createElement('div');
        upItem.className = 'file-item folder';
        upItem.innerHTML = '<i class="fa-solid fa-level-up-alt"></i><span>..</span>';
        upItem.addEventListener('dblclick', () => {
            // Переход на уровень выше (упрощенно - в root)
            renderFiles('root', windowId);
        });
        grid.appendChild(upItem);
    }
    
    files.forEach((item, index) => {
        const fileEl = document.createElement('div');
        fileEl.className = `file-item ${item.type === 'folder' ? 'folder' : ''}`;
        
        const iconClass = item.type === 'folder' ? 'fa-folder' : 
                         item.name.endsWith('.docx') ? 'fa-file-word' :
                         item.name.endsWith('.pptx') ? 'fa-file-powerpoint' :
                         item.name.endsWith('.jpg') || item.name.endsWith('.png') ? 'fa-file-image' :
                         'fa-file';
        
        fileEl.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${item.name}</span>`;
        
        if (item.type === 'folder') {
            fileEl.addEventListener('dblclick', () => {
                renderFiles(item.path, windowId);
            });
        } else {
            fileEl.addEventListener('dblclick', () => {
                alert(`Открытие файла: ${item.name}\n\n${item.content}`);
            });
        }
        
        grid.appendChild(fileEl);
    });
}

function createNewFolderInCurrent(path, windowId) {
    const name = prompt('Введите имя папки:', 'Новая папка');
    if (!name) return;
    
    if (!fileSystem[path]) fileSystem[path] = [];
    
    const newPath = `folder_${Date.now()}`;
    fileSystem[path].push({ name, type: 'folder', path: newPath });
    fileSystem[newPath] = [];
    
    renderFiles(path, windowId);
}

// Браузер
function openBrowser() {
    const content = `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <div class="browser-toolbar">
                <div class="browser-nav">
                    <button class="nav-btn" id="browser-back"><i class="fa-solid fa-arrow-left"></i></button>
                    <button class="nav-btn" id="browser-forward"><i class="fa-solid fa-arrow-right"></i></button>
                    <button class="nav-btn" id="browser-refresh"><i class="fa-solid fa-rotate-right"></i></button>
                </div>
                <input type="text" class="browser-url" id="browser-url" placeholder="Введите URL или поисковый запрос">
                <button class="nav-btn" id="browser-go"><i class="fa-solid fa-arrow-right-to-bracket"></i></button>
            </div>
            <div class="browser-content" id="browser-frame">
                <div class="browser-home">
                    <h1>Qwin Browser</h1>
                    <input type="text" class="browser-search" id="browser-search" placeholder="Поиск в интернете...">
                </div>
            </div>
        </div>
    `;
    
    const windowId = createWindow('Браузер', 'fa-brands fa-edge', content, 900, 600);
    
    setTimeout(() => {
        const win = document.getElementById(`window-${windowId}`);
        const urlInput = win.querySelector('#browser-url');
        const searchInput = win.querySelector('#browser-search');
        const frame = win.querySelector('#browser-frame');
        
        // Навигация
        win.querySelector('#browser-back').addEventListener('click', () => {
            if (browserHistory.length > 1) {
                browserHistory.pop();
                const prevUrl = browserHistory[browserHistory.length - 1];
                loadUrl(prevUrl, frame, urlInput);
            }
        });
        
        win.querySelector('#browser-refresh').addEventListener('click', () => {
            const currentUrl = urlInput.value;
            if (currentUrl) loadUrl(currentUrl, frame, urlInput);
        });
        
        win.querySelector('#browser-go').addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                browserHistory.push(url);
                localStorage.setItem('browserHistory', JSON.stringify(browserHistory));
                loadUrl(url, frame, urlInput);
            }
        });
        
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const url = urlInput.value.trim();
                if (url) {
                    browserHistory.push(url);
                    localStorage.setItem('browserHistory', JSON.stringify(browserHistory));
                    loadUrl(url, frame, urlInput);
                }
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    browserHistory.push(url);
                    localStorage.setItem('browserHistory', JSON.stringify(browserHistory));
                    urlInput.value = url;
                    loadUrl(url, frame, urlInput);
                }
            }
        });
    }, 0);
}

function loadUrl(url, frame, urlInput) {
    // Эмуляция загрузки страницы
    if (url.includes('google')) {
        frame.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: white;">
                <h1 style="color: #4285f4; font-size: 48px; margin-bottom: 20px;">Google</h1>
                <input type="text" style="width: 400px; padding: 12px 20px; border: 1px solid #ddd; border-radius: 25px; font-size: 16px;" placeholder="Поиск...">
            </div>
        `;
    } else if (url.includes('youtube')) {
        frame.innerHTML = `
            <div style="background: #ff0000; color: white; height: 100%; display: flex; align-items: center; justify-content: center;">
                <h1>YouTube (эмуляция)</h1>
            </div>
        `;
    } else {
        frame.innerHTML = `
            <div style="padding: 20px; background: white; height: 100%;">
                <h2>${url}</h2>
                <p>Это эмуляция браузера. Реальные веб-страницы не могут быть загружены из соображений безопасности.</p>
                <p>Попробуйте ввести:</p>
                <ul>
                    <li>google.com - страница Google</li>
                    <li>youtube.com - страница YouTube</li>
                </ul>
            </div>
        `;
    }
}

// Настройки
function openSettings() {
    const content = `
        <div class="settings-layout">
            <div class="settings-sidebar">
                <div class="settings-item active" data-section="personalization">
                    <i class="fa-solid fa-paintbrush"></i> Персонализация
                </div>
                <div class="settings-item" data-section="system">
                    <i class="fa-solid fa-computer"></i> Система
                </div>
                <div class="settings-item" data-section="apps">
                    <i class="fa-solid fa-layer-group"></i> Приложения
                </div>
            </div>
            <div class="settings-content">
                <div class="settings-section" id="settings-personalization">
                    <h3>Персонализация</h3>
                    <div class="setting-row">
                        <span>Тёмная тема</span>
                        <div class="toggle-switch ${state.darkTheme ? 'active' : ''}" id="theme-toggle"></div>
                    </div>
                    <div class="setting-row" style="flex-direction: column; align-items: flex-start; margin-top: 20px;">
                        <span>Обои</span>
                        <div class="wallpaper-grid">
                            <div class="wallpaper-option wp-1 ${state.wallpaper === '1' ? 'selected' : ''}" data-wp="1"></div>
                            <div class="wallpaper-option wp-2 ${state.wallpaper === '2' ? 'selected' : ''}" data-wp="2"></div>
                            <div class="wallpaper-option wp-3 ${state.wallpaper === '3' ? 'selected' : ''}" data-wp="3"></div>
                            <div class="wallpaper-option wp-4 ${state.wallpaper === '4' ? 'selected' : ''}" data-wp="4"></div>
                            <div class="wallpaper-option wp-5 ${state.wallpaper === '5' ? 'selected' : ''}" data-wp="5"></div>
                            <div class="wallpaper-option wp-6 ${state.wallpaper === '6' ? 'selected' : ''}" data-wp="6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const windowId = createWindow('Параметры', 'fa-solid fa-gear', content, 700, 500);
    
    setTimeout(() => {
        const win = document.getElementById(`window-${windowId}`);
        
        // Переключатель темы
        win.querySelector('#theme-toggle').addEventListener('click', function() {
            this.classList.toggle('active');
            toggleTheme();
        });
        
        // Выбор обоев
        win.querySelectorAll('.wallpaper-option').forEach(option => {
            option.addEventListener('click', () => {
                win.querySelectorAll('.wallpaper-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                setWallpaper(option.dataset.wp);
            });
        });
    }, 0);
}

// Блокнот
function openNotepad() {
    const content = `
        <textarea style="width: 100%; height: 100%; border: none; padding: 10px; font-family: monospace; font-size: 14px; resize: none; outline: none;" placeholder="Введите текст..."></textarea>
    `;
    
    createWindow('Блокнот', 'fa-solid fa-note-sticky', content, 600, 400);
}

// Калькулятор
function openCalculator() {
    const content = `
        <div style="padding: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; height: 100%;">
            <input type="text" id="calc-display" style="grid-column: span 4; padding: 15px; font-size: 24px; text-align: right; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); color: var(--text-color);" readonly value="0">
            <button class="calc-btn" data-val="C" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--hover-color); cursor: pointer;">C</button>
            <button class="calc-btn" data-val="±" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--hover-color); cursor: pointer;">±</button>
            <button class="calc-btn" data-val="%" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--hover-color); cursor: pointer;">%</button>
            <button class="calc-btn" data-val="/" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--accent-color); color: white; cursor: pointer;">÷</button>
            <button class="calc-btn" data-val="7" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">7</button>
            <button class="calc-btn" data-val="8" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">8</button>
            <button class="calc-btn" data-val="9" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">9</button>
            <button class="calc-btn" data-val="*" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--accent-color); color: white; cursor: pointer;">×</button>
            <button class="calc-btn" data-val="4" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">4</button>
            <button class="calc-btn" data-val="5" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">5</button>
            <button class="calc-btn" data-val="6" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">6</button>
            <button class="calc-btn" data-val="-" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--accent-color); color: white; cursor: pointer;">−</button>
            <button class="calc-btn" data-val="1" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">1</button>
            <button class="calc-btn" data-val="2" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">2</button>
            <button class="calc-btn" data-val="3" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">3</button>
            <button class="calc-btn" data-val="+" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--accent-color); color: white; cursor: pointer;">+</button>
            <button class="calc-btn" data-val="0" style="grid-column: span 2; padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">0</button>
            <button class="calc-btn" data-val="." style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--window-bg); cursor: pointer;">.</button>
            <button class="calc-btn" data-val="=" style="padding: 15px; font-size: 18px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--accent-color); color: white; cursor: pointer;">=</button>
        </div>
    `;
    
    const windowId = createWindow('Калькулятор', 'fa-solid fa-calculator', content, 320, 450);
    
    setTimeout(() => {
        const win = document.getElementById(`window-${windowId}`);
        const display = win.querySelector('#calc-display');
        let currentValue = '0';
        let previousValue = '';
        let operator = '';
        
        win.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.val;
                
                if (val >= '0' && val <= '9') {
                    currentValue = currentValue === '0' ? val : currentValue + val;
                } else if (val === '.') {
                    if (!currentValue.includes('.')) currentValue += '.';
                } else if (val === 'C') {
                    currentValue = '0';
                    previousValue = '';
                    operator = '';
                } else if (val === '±') {
                    currentValue = String(-parseFloat(currentValue));
                } else if (val === '%') {
                    currentValue = String(parseFloat(currentValue) / 100);
                } else if (['+', '-', '*', '/'].includes(val)) {
                    previousValue = currentValue;
                    operator = val;
                    currentValue = '0';
                } else if (val === '=') {
                    if (operator && previousValue) {
                        const prev = parseFloat(previousValue);
                        const curr = parseFloat(currentValue);
                        let result;
                        
                        switch(operator) {
                            case '+': result = prev + curr; break;
                            case '-': result = prev - curr; break;
                            case '*': result = prev * curr; break;
                            case '/': result = prev / curr; break;
                        }
                        
                        currentValue = String(result);
                        previousValue = '';
                        operator = '';
                    }
                }
                
                display.value = currentValue;
            });
        });
    }, 0);
}

// Корзина
function openRecycleBin() {
    const content = `
        <div style="padding: 20px; text-align: center; color: var(--text-color);">
            <i class="fa-solid fa-trash-can" style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;"></i>
            <p>Корзина пуста</p>
        </div>
    `;
    
    createWindow('Корзина', 'fa-solid fa-trash-can', content, 500, 350);
}

// Загрузка файловой системы из localStorage
function loadFileSystem() {
    const savedFS = localStorage.getItem('fileSystem');
    if (savedFS) {
        Object.assign(fileSystem, JSON.parse(savedFS));
    }
}

// Сохранение файловой системы
function saveFileSystem() {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
}

function createNewFolder() {
    const name = prompt('Введите имя папки:', 'Новая папка');
    if (!name) return;
    
    if (!fileSystem[state.currentPath]) fileSystem[state.currentPath] = [];
    
    const newPath = `folder_${Date.now()}`;
    fileSystem[state.currentPath].push({ name, type: 'folder', path: newPath });
    fileSystem[newPath] = [];
    
    saveFileSystem();
}
