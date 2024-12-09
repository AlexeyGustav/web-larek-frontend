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
  cards: ICard[];
  previewCard: ICard;
  selectСard(item: ICard): void;
}
```

**Интерфейс и типы для работы с событиями**
```
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
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

**Модальное окно**

```
interface IModal {
    modalContent: HTMLElement;
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


**Поля:**

#### Класс CardsData
Этот класс представляет модель товара, содержащую основную информацию о продукте, которую можно отображать на страницах.
В полях класса хранятся следующие данные:
- cards: ICard[] - массив объектов карточек
- preview: string | null - id карточки, выбранной для просмотра в модальной окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
**Методы**
- getCard - получить список карточек
- deleteCard - удалить карточку из списка

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







### Слой представления данных **VIEW**

#### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия, изображения, описания,
раздел. Класс используется для отображения карточек на странице сайта. 
В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать 
карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, 
в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает 
экземпляр `EventEmitter` для инициации событий.

**Поля**
 itemElement: HTMLElement; - элемент разметки
  events: IEvents; - экземпляр `EventEmitter` для инициации событий
  title: HTMLElement; - заголовок
  cardId: string; - id карточки
  image?: HTMLImageElement; - изображение в карточке
  price: HTMLElement; - цена
  category?: HTMLElement; - категория
  button?: HTMLButtonElement; 
  // deleteBtn?: HTMLElement;
  // description?: HTMLElement;

**Методы:**
- setData(cardData: ICard): void - заполняет атрибуты элементов карточки данными

- deleteCard(): void - метод для удаления разметки карточки
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями
- геттер id возвращает уникальный id карточки

#### Класс Modal

Класс, который реализует модальное окно. Предоставляет такие методы: `openModal` и `closeModal` для отображения модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. \
Метод `render(): HTMLElement` возвращает заполненную карточку со слушателями

`constructor(protected container: HTMLElement, protected events: IEvents)`- в параметры принимает контейнер и экземпляр `EventEmitter` для инициации событий

**Поля**
- modalContent: HTMLElement - элемент модального окна

**Методы:**
- `closeEscape = (evt: KeyboardEvent)` - метод закрытия окна по нажатию клавиши Escape
- `toggleModal(state: boolean)` - метод переключения класса модального окна







### Слой коммуникации

#### Класс Component

Абстрактный класс, отвечает за создания DOM-элементов.

`constructor(protected readonly container: HTMLElement)`- в параметрах принимает конструктор, куда будет вставляться DOM-элемент.

**Методы:**
 - `toggleClass` - переключает класс.

 - `setDisabled` - меняет статус блокировки.

 - `setText` - устанавливает текстовое содержимое элементу.

 - `setVisible` - показывает элемент.

 - `setHidden` - скрывает элемент.

 - `setImage` - устанавливает изображение с алтернативным текстом

 - `render` - вставляет корневой DOM-элемент в разметку.     

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*


*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card:select` - выбор карточки для отображения в модальном окне
- `card:delete` - выбор карточки для удаления