# Настройка API для WineLine

## Что было сделано

Все хардкоженные URL с хостом `:3000` были заменены на использование единого API клиента `src/utils/api.js`.

## Файлы, которые были обновлены

### Основные компоненты:
- `src/components/MainPageComponets/Products/items.js`
- `src/components/KatalogComponents/filter/filters.js`
- `src/components/ShopComponent/MainShop.jsx`
- `src/components/ShopComponent/ModalBuying.jsx`
- `src/components/ShopComponent/BuyCrad.jsx`
- `src/components/ShopComponent/BuyingShop.jsx`
- `src/components/AdminComponents/users/Users.jsx`
- `src/components/AdminComponents/Tovars/AdminDeleteTovars.jsx`
- `src/components/AdminComponents/Add/Add.jsx`
- `src/components/AdminComponents/AddEvents/AddEvents.jsx`
- `src/components/cards/card.jsx`
- `src/components/Header/Header.jsx`
- `src/components/Map/Map.jsx`
- `src/components/TovarComponent/infoTovar/BuyTovar/BuyTovar.jsx`

### Страницы:
- `src/page/Search/SearchPage.jsx`
- `src/page/Event/Event.jsx`
- `src/page/EventPage/eventPage.jsx`
- `src/page/Cards.jsx/CardPage.jsx`
- `src/page/Shop/Shop.jsx`
- `src/page/Katalog/Katolog.jsx`
- `src/page/TovarPage/TovarPage.jsx`
- `src/page/Admin/AdminPage.jsx`
- `src/page/favorite/Favorite.jsx`
- `src/page/loginPage/Login.jsx`
- `src/App.jsx`

## Как настроить

### 1. Создайте файл `.env` в корне проекта:
```bash
# Базовый URL для API
VITE_API_URL=http://localhost:3000
```

### 2. Для продакшена измените URL:
```bash
# Пример для продакшена
VITE_API_URL=https://your-api-domain.com
```

### 3. Перезапустите приложение:
```bash
npm run dev
```

## Структура API клиента

Файл `src/utils/api.js` создает axios-клиент с базовым URL из переменной окружения `VITE_API_URL`.

```javascript
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL,
  withCredentials: false,
});

export default api;
```

## Преимущества

1. **Централизованное управление**: Все API вызовы теперь используют единый клиент
2. **Легкость смены хоста**: Достаточно изменить одну переменную окружения
3. **Консистентность**: Все URL теперь относительные и читаемые
4. **Безопасность**: Нет хардкоженных URL в коде

## Проверка

После настройки убедитесь, что:
- Приложение запускается без ошибок
- Все API вызовы работают корректно
- В консоли браузера нет ошибок CORS или 404
