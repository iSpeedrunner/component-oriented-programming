# Лабораторна робота №1

## Компонентно-орієнтоване програмування

### Simple Dashboard Widgets — World Bank

Навчальний React + Vite застосунок, який демонструє компонентну декомпозицію,
props, локальний стан, обробку подій та роботу з локальними mock-даними.

Реальний World Bank API у цій лабораторній роботі не використовується.

## Технології

- React.
- Vite.
- JavaScript / JSX.
- CSS.
- React Hooks (`useState`).
- Локальні mock-дані.

## Архітектурні рівні

Проєкт розділений на рівні за відповідальністю:

- `App` — кореневий рівень, який підключає головну сторінку.
- `pages` — сторінки застосунку та їхня композиція.
- `components/widgets` — самостійні функціональні віджети зі своїм локальним станом.
- `components/ui` — невеликі повторно використовувані UI-компоненти.
- `data` — локальні mock-дані, незалежні від JSX-представлення.

## Структура проєкту

```text
src/
├── App.jsx
├── App.css
├── index.css
├── main.jsx
│
├── pages/
│   └── DashboardPage.jsx
│
├── components/
│   ├── widgets/
│   │   ├── Counter.jsx
│   │   ├── Counter.css
│   │   ├── Toggle.jsx
│   │   ├── Toggle.css
│   │   ├── FilteredList.jsx
│   │   └── FilteredList.css
│   │
│   └── ui/
│       ├── KpiCard.jsx
│       └── KpiCard.css
│
└── data/
    ├── countries.js
    └── dashboardMetrics.js
```

## Компоненти та їхні контракти

### `DashboardPage`

Композиційний компонент сторінки. Він підключає дані, створює конфігурації та
передає їх віджетам через props. Внутрішню логіку віджетів не дублює.

### `KpiCard`

Відображає один KPI та не залежить від конкретного показника World Bank.

Props:

- `title` — назва показника;
- `value` — значення;
- `change` — текст зміни показника.

### `Counter`

Самостійний віджет лічильника. Його стан `count` зберігається локально.

Props:

- `title`;
- `initialValue`;
- `min`;
- `max`;
- `step`;
- `itemLabel`.

Кнопки `+` і `−` враховують `step` та межі. `Reset` повертає `initialValue`.

### `Toggle`

Перемикає два режими та зберігає активний режим локально.

Props:

- `title`;
- `firstLabel`;
- `secondLabel`;
- `firstValue`;
- `secondValue`;
- `initialMode`.

Компонент не знає, що режими називаються GDP або Population. Ці значення
передаються з `DashboardPage`.

### `FilteredList`

Відображає список і фільтрує його за регіоном. Вибраний регіон є локальним
станом компонента.

Props:

- `title`;
- `countries`;
- `regions`;
- `initialRegion`.

Список країн рендериться через `.map()` із `key={country.id}`.

## Дані

- `data/countries.js` містить масив країн із полями `id`, `name`, `region`,
  `gdp` та `population`.
- `data/dashboardMetrics.js` містить значення KPI та тексти їхніх змін.

Зміна mock-даних не потребує редагування внутрішньої логіки компонентів.

## Принципи компонентно-орієнтованого програмування

- **Separation of Interface from Implementation:** компоненти взаємодіють через
  зрозумілі props-контракти.
- **Encapsulation:** локальний стан `Counter`, `Toggle` і `FilteredList` не
  доступний напряму батьківським компонентам.
- **Reusability:** компоненти можна використовувати з іншими заголовками,
  значеннями, списками та режимами.
- **Loose Coupling:** віджети не імпортують дані сторінки напряму.
- **Replaceability:** компонент можна замінити іншою реалізацією з тим самим
  контрактом props.
- **Configurability:** параметри компонентів змінюються у `DashboardPage`.
- **Single Responsibility:** кожен рівень і компонент має окрему логічну
  відповідальність.

## Запуск

Встановлення залежностей:

```bash
npm install
```

Запуск у режимі розробки:

```bash
npm run dev
```

Перевірка коду та production-збірка:

```bash
npm run lint
npm run build
```

## Функціональність

- Три KPI-картки економічних показників.
- Counter із початковим значенням `3` і діапазоном `1–10`.
- Toggle GDP / Population.
- Фільтрація п’яти країн за регіонами Europe, Asia та Latin America.
- Локальні дані без API-запитів.
