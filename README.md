# Пет проект "Веб-ларек"

## Описание
Приложение Web Larek - это магазин в котором можно взаимодействовать с каталогом товаров, добавлять и удалять товары из корзины.

## Стек технологий
- Webpack
- TypeScript
- Sass
- Prettier
- ESLint
- Babel

**Структура:**
- src/ — исходники проекта
- src/components/ — TypeScript модули и компоненты
- src/components/base/ — базовый код

**Важные файлы:**
  src/:
- pages/ — HTML-файлы:
- types/index.html — Основной файл, DOM дерева.
- scss/styles.scss — основной файл со стилями
- index.ts — точка сборки
- utils/utils.ts — утилиты TypeScript
- utils/constants.ts — константы TypeScript
- model — классы данных
- view — классы отрисовки
- controller — классы контроллеров 

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Архитектура проекта

## Данные и типы, в проекте:

**Карточка товара**

```
interface ICard {
  _id: string;
  title: string;
  price: number | null;
  description?: string;
  image: string;
  category: string;
}
```

**Интерфейс модели работающей с массивом карточек товаров**

```
interface IDataCard {
  items: ICard[];
  previewCard: ICard;
  selectСard(item: ICard): void;
}
```

**Данные карточки, которая находится в корзине**

```
export type TCard = Pick<ICard, "id" | "price";
```


**Интерфейс для работы с корзиной**

```
interface IBasket {
  productsList: ICard[];
  payment: string;
  getSumProductsList: () => number;
  setToSelectСard(data: ICard): void;
  getToCounterCards: () => number;
  delToSelectСard(item: ICard): void;
  clearBasket(): void
}
```

**Интерфейс для работы с заказом из корзины**

```
interface IBasketOrdered {
  items: string[];
  email: string;
  payment: string;
  address: string;
  phone: string;
  total: number;
}
```

**Результат заказа из корзины**

```
interface IOrder {
  _id: string;
  total: number;
}
```

**Ошибки**

```
interface IOrder extends IForm {
    error: string;
}
```

**Интерфейс модели работы с формами**

```
interface IForm {
    address: string;
    telephone: string;
    email: string | RegExp;
    payment: string;
    total: number;
    items: string[];
    toCheckValidateBasket(): boolean;
    toCheckValidateUser(): boolean;
}
```



## Описание классов
Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.


### Класс `Api`

**Тип**
```
type TApiPostMethods = 'POST' | 'PUT' | 'DELETE'
```

Предназначен для работы с сервером. Имеет функции получения и отправки данных на сервер.
- readonly baseUrl: string // Содержит ссылку на сервер
- protected options: RequestInit // Объект конфигурации запросов, параметры - метод, тело запроса и заголовки.
- handleResponse()(response: Response) // метод ответа с сервера
- get()(endpoint: string) // Метод для отправки данных на сервер
- post()(endpoint: string, data: any) // Метод для получения данных с сервера

### Класс `EventEmitter`
Предназначен для взаимодействия с событиями.
- on()(event: string, listener: Function) // Установить обработчик на событие
- emit()(event: string, listener: Function) // Инициировать событие с данными
- trigger()(callback: Function)  // Сделать коллбек триггер, генерирующий событие при вызове

### Слой данных **MODEL**

#### Класс AuctionAPI
Класс отвечает за взаимодействие с сервером. Конструктор класса наследует экземпляр класса Api
**Методы**
- getLotList - массив данных карточек

#### Класс dataBasket
Класс данных в корзине
**Поля**
НАзвание товара
Стоимость товара
Сумма заказа

**Методы**
Удаление товара
Оформление товара

#### Класс OrderDetails
Класс данных заказа
**Поля**
Спопсоб оплаты
Адрес доставки
email Телефон    







### Классы представления **VIEW**











### Слой коммуникации

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.