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

**Тип посылаемого запроса для класса Api**
```
type TApiPostMethods = 'POST' | 'PUT' | 'DELETE'
```

**Запросы к серверу**

```
interface ICoursesAPI {
  cdn: string;
  getLotList: () => Promise<ICard[]>;
  postTotalOrder(order: ITotalData): Promise<IOrderResult>;
}
```

**Карточка товара**

```
interface ICard {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: string;
}
```

**Модель карточки товара**

```
interface ICardsData {
  cards: ICard[];
  getCard(cardId: string): ICard;
}
```

**Интерфейс контейнера для каталога товаров**

```
interface ICardsContainer {
  catalog: HTMLElement[] | HTMLElement;
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

**Контейнер для модального окна**

```
interface IModalData {
  content: HTMLElement | HTMLElement[];
}
```

**Контейнер для массива карточек и модального окна**

```
interface ICardsContainer {
  catalog: HTMLElement[] | HTMLElement;
}
```

**Данные и методы карточки, которая находится в корзине**

```
interface IBasketData {
  cards: ICard[] | ICard;
  total: number;
  addCard(card: ICard): void;
  deleteCard(cardId: string): void;
  getBasketLength(): number;
  getTotal(): number;
  contains(id: string): boolean;
  clear(): void;
}
```

**Интерфейс для работы с корзиной**

```
interface IBasket {
  items: HTMLElement[];
  totalPrice: number;
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
type TFormErrors = {
  email?: string;
  phone?: string;
  address?: string;
  paymend?: string;
}

interface IFormState {
    disabled: boolean;
    errors: string[];
}
```

**Интерфейсы работы с формами**

```
interface IOrderPay  {
  paymend: string;
  adress: string;
}

interface IContacts {
  email: string;
  phone: string;
}
```

**Интерфейс предсавления корзины, прокрутки модального окна и контейнера**
```
interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}
```

**Интерфейс слушателя клика**
```
interface IActions {
  onClick: (event: MouseEvent) => void;
}
```
**Интерфейс данных пользователя и мотодов в заказе**
```
interface IOrderDataAll {
  email: string;
  phone: string;
  address: string;
  paymend: string;
}

interface IOrderData {
  setOrder(field: keyof TFormErrors, value: string): void;
  updatePaymentMethod(method: string): void;
  validateOrder(): boolean;
}
```

**Интерфейс объекта заказа для отправки на сервер**
```
interface ITotalData {
  email: string;
  phone: string;
  address: string;
  payment: string;
  items: string[];
  total: number;
}
```

**Интерфейс промиса возвращаемого с сервера, при успешной отправки**
```
interface IOrderResult {
  id: string;
  total: number;
}
```

## Описание классов
Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.


### Класс `Api`

Предназначен для работы с сервером. Имеет функции получения и отправки данных на сервер.
- readonly baseUrl: string // Содержит ссылку на сервер
- protected options: RequestInit // Объект конфигурации запросов, параметры - метод, тело запроса и заголовки.
- handleResponse()(response: Response) // метод ответа с сервера
- get()(endpoint: string) // Метод для отправки данных на сервер
- post()(endpoint: string, data: any) // Метод для получения данных с сервера

### Класс `Component`

Предназначен для для работы с DOM в дочерних компонентах

**Методы**
setText() - Установить текстовое содержимое
setImage() - Установить изображение с алтернативным текстом
render() - Рендер объекта

### Слой **Controller**

### Класс `EventEmitter`
Предназначен для взаимодействия с событиями.
- on()(event: string, listener: Function) // Установить обработчик на событие
- emit()(event: string, listener: Function) // Инициировать событие с данными
- trigger()(callback: Function)  // Сделать коллбек триггер, генерирующий событие при вызове

### Слой данных **MODEL**

#### Класс CardData
Этот класс представляет модель товара, содержащую массив данных товаров.

**Поля:**
`cards: ICard[]` — массив данных товаров.
`events: IEvents` — обработчик события.

**Методы**
 - getCard() - возвращает карточку товара по айди

#### Класс CoursesAPI
Класс отвечает за взаимодействие с сервером. Конструктор класса наследует экземпляр класса Api

**Поля:**
`cdn` — константа.

**Методы**
- getLotList - гет запрос, возвращает массив данных карточек
- postTotalOrder - пост запрос, отправляет объект заказа на сервер 

#### Класс CardData
Принимает в модель данные от сервера. Ещё принимает событие EventEmitter

**Поля:**
`_cards: ICard[]` — массив данных товаров.
`events: IEvents` — обработчик события.

**Методы**
- cards() - записывает в сетер массив данных о карточках товаров
- cards() - отдаёт геттер массив данных о карточках товаров
- getCard() - возвращает карточку товара по id

#### Класс BasketData
Класс данных в корзине. Принимает событие EventEmitter и массив данных карточек

**Поля**
`_cards: ICard[]` — массив товаров.

**Методы**
- cards() - геттер возвращает массив данных карточек
- total() - геттер возвращает цену товара
- addCard - добавление товара в массив
- deleteCard - Удаление товара
- getBasketLength - Отдаёт количество товаров
- getTotal - Общая сумма товаров в корзине
- contains - Проверка наличия товара в корзине
- getListInBasket - достать массив айдишников товаров
- clear - Очистка корзины

#### Класс OrderData
Класс данных заказа. Принимает в поля данные о пользователе.

**Поля**
`order` - объект данных о пользователе
`formErrors` - объект данных об ошибках, если пользователь не введёт то или иное поле

**Методы**
- setOrder - сеттер сохраняет данные в поля о пользователе
- updatePaymentMethod - сеттер сохраняет данные оплаты
- validateOrder - вариант ошибки если поле не заполнено
- clear - Очистка данных пользователя


### Слой представления данных **VIEW**

#### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия, изображения, описания, категории, цены. Класс используется для отображения карточек на странице сайта. 
В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, 
в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает 
экземпляр `EventEmitter` для инициации событий.

**Поля**
`events: IEvents` - экземпляр `EventEmitter` для инициации событий
`title: HTMLElement` - заголовок
`cardId: string` - id карточки
`image?: HTMLImageElement` - изображение в карточке
`price: HTMLElement` - цена
`button?: HTMLButtonElement`

**Методы:**
- геттер id возвращает уникальный id карточки
- сеттер id записывает уникальный id карточки
- сеттер title() заголовка у карточки
- сеттер price() цены у карточки
- сеттер category() категории у карточки
- сеттер image() изображения у карточки

#### Класс CardsContainer

**Поля**
`catalog: HTMLElement[]` - массив темплейтов карточек
`container: HTMLElement` - корневой элемент DOM, в котором отрисовывется массив темплейтов карточек

**Методы:**
- сеттер возвращает массив темплейтов карточек
- render() метод возвращает полностью заполненный массив с карточками

#### Класс Page
Отвечает за отображение главной страницы и её элементов - галереи и иконки корзины. \ Принимает темплейт и экземпляр `EventEmitter` для инициации событий

**Поля**
`counter: HTMLElement` - счётчик товаров
`catalog: HTMLElement` - контейнер для массива карточек
`wrapper: HTMLElement` - контейнер для всей страницы
`basket: HTMLElement` - иконка корзины на главной странице

**Методы:**

- counter() сеттер сохранения количества товаров в корзине
- locked() - блокирует прокрутку страницы при открытии модального окна

### Класс Modal
Наследуется от класса Component. Принимает темплейты разных модальных окон. А так же экземпляр `EventEmitter` для инициации событий

**Поля**
`closeButton: HTMLButtonElement` - кнопка закрытия модального окна
`content: HTMLElement` - сеттер для сохранения объекта в разметку модального окна

**Методы:**
- open() - открыть модальное окно
- close() - закрыть модальное окно
- handleEscUp() - закрыть модальное окно кнопкой `Escape`
- render() - отрисовка модального окна

### Класс ModalCardPreview
В конструкторе находим поля описания и кнопки "Купить". Наследует поля и события класса Card. Принимает темплейт, обработчик события и слушатель события. 

**Поля**
`description: HTMLElement` - описание карточки товара.
`buyBtn: HTMLButtonElement` - кнопка карточки товара в модальном окне.

**Методы:**
- set description() - сеттер который принимает описание карточки товара.
- getDisabled() - метод, который дизэйблит кнопку, если цена товара равна null.
- replaceTextBtn() - меняет текст кнопки в зависимости от того, добавлен товар \
в корзину или нет.

### Класс ModalCardBasket
Класс отвечает за отображение корзины в модальном окне. В конструктор принимает темплейт, обработчик события и слушатель события. НАследуется от класса Card, принимает его поля.

**Поля**
`basketIndex: HTMLElement` - номер карточки товара
`basketIndexDelete: HTMLButtonElement` - кнопка удалить

**Методы:**
- basketIndex() - сеттер который принимает номер карточки товара

### Класс Form
Класс наследуется от класса Component и отвечает за валидацию и вывод ошибок.

**Поля**
`_submit: HTMLButtonElement` - кнопку отправить форму и перейти на следующее модальное окно
`_errors: HTMLElement` - вывод ошибокесли поле не заполнено 

**Методы:**
- errors - сеттер сохраняет и выводит название ошибки
- render - метод рендер 

### Класс OrderPay
Класс отвечает за отображение модального окна с методаом оплаты и адресом пользователя

**Поля**
`paymentMethod: HTMLButtonElement[]` - массив кнопок для метода оплаты пользователя
`paymentMethodCard: HTMLButtonElement` - отдельная кнопка для выбора оплаты по карте
`paymentMethodCash: HTMLButtonElement` - отдельная кнопка для выбора оплаты за наличные
`nextPage: HTMLButtonElement` - кнопка переводящая на следующее модальное окно

**Методы:**
- disabled - сеттер отвечает за disabled кнопки
- address - сеттер отвечает за поле с адресом
- phone - сеттер отвечает за поле с телефоном
- email - сеттер отвечает за поле с email
- resetPaymentMethod - обнуляет выбор оплаты

### Класс Contacts
Класс отвечает за отображение модального окна с email  и телефоном пользователя

**Поля**
`nextPage: HTMLButtonElement` -  кнопка переводящая на следующее модальное окно

**Методы:**
- disabled - сеттер отвечает за disabled кнопки

### Класс Total
Класс обозначает успешную отправку данных заказа на сервер и отвечает за финальное окно успеха с суммой зааза, наследуется от класса Component. Принимает контейнер для темплейта и слушатель события

**Поля**
`total: HTMLElement` - сумма заказа
`nextPage: HTMLButtonElement` - кнопка завершения заказа

**Методы:**
- totalSum - сеттер для записи суммы заказа

### Слой коммуникации

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
- `events.onAll` - Слушать все события
- `basket:changed` 
- `card:select` - выбор карточки для отображения в модальном окне
- `basket:changed` - Изменения в корзине
- `delete:card` - удаление карточки товара в корзине
- `basket:open` - открыть корзину
- `modal:open` - открытое модальное окно
- `modal:close` - закрытое модальное окно
- `order:changed` - изменения в данных пользователя в заказе
- `paymend:change` - изменения в данных о выборе оплаты
- `order:open` - открытое модальное окно выбора оплаты и адреса пользователя
- `order:submit` - открытое модальное окно контакты
- `^order\..*:change` - регулярное выражение для записи изменений окна выбора оплаты \ и адреса пользователя
- `^contacts\..*:change` - регулярное выражение для записи изменений окна email и телефона пользователя
- `'contacts:submit'` - отправка заказа и финальное окно подтверждение заказа