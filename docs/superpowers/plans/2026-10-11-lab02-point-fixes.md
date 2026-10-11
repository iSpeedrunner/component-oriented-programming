# ЛР2 Point Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Усунути підтверджені дефекти ЛР2 без зміни поточної архітектури та публічних props-контрактів.

**Architecture:** Зберігаємо `DashboardPage` як container, `worldBankApi` як service, а `FilteredList` і `CountryTable` як UI-компоненти. Для тестованої фільтрації додається одна чиста utility-функція; для обробки скасування — один малий helper помилок запиту.

**Tech Stack:** React, Vite, native `fetch`, Node `node:test`, JavaScript/JSX.

**Spec:** User request: точкове виправлення недоліків аудиту ЛР2.

## Global Constraints

- Не встановлювати нові бібліотеки.
- Не проводити масштабний рефакторинг.
- Не змінювати публічні props-контракти компонентів.
- Не видаляти функціональність ЛР1.
- Не додавати пагінацію.
- Не змінювати математичну логіку KPI без підтвердженої помилки.
- Після змін виконати lint, тести та build.

## Review Focus

- API-нормалізований запис має фільтруватися за `regionName`, а не за legacy-полем `region`.
- Cleanup має передавати один `AbortSignal` у всі чотири API-запити.
- Abort-помилка не повинна переходити у видимий error state.
- KPI мають зберегти попередні числові результати, але інтерфейс має пояснювати `latest available`.

### Task 1: Align FilteredList with normalized records

**Files:**
- Create: `src/utils/filterCountries.js`
- Modify: `src/components/widgets/FilteredList.jsx`
- Test: `tests/worldBankDashboard.test.js`

**Interfaces:**
- Produces `filterCountriesByRegion(countries, region)` returning the filtered array.
- Keeps `FilteredList` props unchanged: `title`, `countries`, `regions`, `initialRegion`.

- [ ] Write a failing test for filtering by `regionName` and preserving the `All` behavior.
- [ ] Run the test and confirm it fails because the helper is not implemented.
- [ ] Implement the smallest utility and update `FilteredList` to use `regionName` for filtering and display.
- [ ] Run the focused test and the full test suite.

### Task 2: Add request cancellation lifecycle

**Files:**
- Create: `src/utils/requestErrors.js`
- Modify: `src/pages/DashboardPage.jsx`
- Modify: `tests/worldBankDashboard.test.js`

**Interfaces:**
- Produces `isAbortError(error)` for request error classification.
- `fetchWorldBankData({ signal })` remains the existing service contract.

- [ ] Write failing tests for AbortError classification and signal propagation through all requests.
- [ ] Run them and confirm the new behavior is not yet covered/implemented.
- [ ] Add conditional `AbortController`, pass its signal, abort on cleanup, and ignore cancellation in the catch path.
- [ ] Run the focused tests and the full suite.

### Task 3: Clarify KPI meaning without changing formulas

**Files:**
- Modify: `src/pages/DashboardPage.jsx`
- Test: `tests/worldBankDashboard.test.js` (existing KPI regression test)

**Interfaces:**
- No changes to `calculateDashboardMetrics` or KPI value formulas.

- [ ] Confirm the existing KPI test preserves numeric results.
- [ ] Update only visible labels/descriptions to say `latest available`.
- [ ] Run lint, the complete test suite, and a build to a temporary output directory.

