# Windows 11 Web Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Профессиональный клон интерфейса Windows 11 для браузера, реализованный с использованием современных веб-технологий.

## 📋 Описание

Этот проект представляет собой функциональную имитацию операционной системы Windows 11, работающую непосредственно в браузере. Интерфейс полностью на русском языке и включает все ключевые элементы оригинальной ОС.

### ✨ Возможности

- **Рабочий стол** с иконками приложений (Этот ПК, Документы, Корзина)
- **Панель задач** с центрированными кнопками и живыми часами
- **Меню Пуск** с поиском, закрепленными приложениями и рекомендациями
- **Система окон** с поддержкой:
  - Перетаскивания (Drag & Drop)
  - Изменения размера (Resize)
  - Сворачивания/разворачивания/закрытия
  - Управления активным окном (Z-Index)
- **Центр уведомлений** с календарем и быстрыми настройками
- **Контекстное меню** по правому клику

## 🚀 Как запустить

### Вариант 1: Простой запуск
1. Откройте файл `index.html` в любом современном браузере (Chrome, Firefox, Edge, Safari)

### Вариант 2: Локальный сервер (рекомендуется)
```bash
# Используя Python
python -m http.server 8000

# Используя Node.js (требуется установка http-server)
npx http-server

# Затем откройте в браузере: http://localhost:8000
```

## 🛠 Стек технологий

- **HTML5** - Семантическая разметка
- **CSS3** - Современные стили с переменными, Flexbox, Grid, анимации
- **JavaScript (ES6+)** - Модульная архитектура, стрелочные функции, шаблонные строки
- **SVG** - Векторная графика для иконок

### Ключевые особенности реализации

- **Fluent Design** - Эффекты стекла (backdrop-filter: blur), скругления 8px, тени
- **Чистый код** - Без inline-стилей, строгое разделение логики
- **Валидный HTML/SVG** - Исправлены ошибки с пробелами в атрибутах
- **Event Delegation** - Корректная обработка закрытия меню

---

# Windows 11 Web Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Professional Windows 11 interface clone for browsers, built with modern web technologies.

## 📋 Description

This project is a functional imitation of the Windows 11 operating system running directly in the browser. The interface is fully in Russian and includes all key elements of the original OS.

### ✨ Features

- **Desktop** with application icons (This PC, Documents, Trash)
- **Taskbar** with centered buttons and live clock
- **Start Menu** with search, pinned apps, and recommendations
- **Window Management System** supporting:
  - Drag & Drop
  - Resize
  - Minimize/Maximize/Close
  - Active window management (Z-Index)
- **Notification Center** with calendar and quick settings
- **Context Menu** on right-click

## 🚀 Usage

### Option 1: Simple Launch
1. Open the `index.html` file in any modern browser (Chrome, Firefox, Edge, Safari)

### Option 2: Local Server (recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js (requires http-server installation)
npx http-server

# Then open in browser: http://localhost:8000
```

## 🛠 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styles with variables, Flexbox, Grid, animations
- **JavaScript (ES6+)** - Modular architecture, arrow functions, template strings
- **SVG** - Vector graphics for icons

### Key Implementation Features

- **Fluent Design** - Glass effects (backdrop-filter: blur), 8px border radius, shadows
- **Clean Code** - No inline styles, strict logic separation
- **Valid HTML/SVG** - Fixed attribute spacing errors
- **Event Delegation** - Proper menu close handling

## 📁 Структура проекта / Project Structure

```
├── index.html      # Основная разметка / Main markup
├── styles.css      # Все стили / All styles
├── script.js       # Логика приложения / Application logic
└── README.md       # Документация / Documentation
```

## 🎮 Управление / Controls

| Действие / Action | Способ / Method |
|------------------|-----------------|
| Открыть окно / Open window | Двойной клик по иконке / Double-click icon |
| Перетаскивание / Drag | Заголовок окна / Window header |
| Изменение размера / Resize | Правый нижний угол / Bottom-right corner |
| Контекстное меню / Context menu | Правый клик / Right-click |
| Меню Пуск / Start Menu | Кнопка слева / Left button |
| Уведомления / Notifications | Иконка справа / Right icon |

## 📄 Лицензия / License

MIT License - см. файл LICENSE для деталей / see LICENSE file for details.

## 👨‍💻 Автор / Author

Senior Front-End Developer

---

*Проект создан в образовательных целях / Project created for educational purposes*
