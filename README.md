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
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image: string;
  category: string;
  index?: number;
}
```

**Интерфейс главной страницы**

```
interface IPage {
    gallery: HTMLElement[];
    counterBasket: number;
}
```

**Методы сервера**

```
type ApiMethods = 'POST' | 'PUT' | 'DELETE'
```

**Метод передачи данных заказа на сервер**

```
type TDataOrder = Partial<IInfoOrder & IBasketData>
```

**Заказ завершён**

```
type TBingo = Pick<IInfoOrder, 'total'>

type ApiListResponse = {
  items: ICard[];
  total: number;
}
```

**Модальное окно**

```
interface IModal {
    modalContent: HTMLElement;
}
```

**Интерфейс данных сервера**
```
interface ICoursesApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiMethods):Promise<T>;
}
```
**Интерфейсы формы**

```
interface IForm extends IInfoOrder {
    error: string;
    valid: boolean;
}

interface IInfoOrder {                 
  payment: string;                     
  address: string;
  phone: string;
  email: string;                        
}
```

**Модель данных корзины**

```
interface IBasket {
    items: HTMLElement[];
    total: number;
}
```

```
interface IBasketData {
    getTotal(): number;
    cardsBasket: ICard[];
    add(card: ICard): void;
    getIdBasketList(): string[];
    contains(id: string): boolean;
    remove(id: string): void;
    getBasketLength():number;
    getBasketList(): void;
    clear(): void;
}
```

**Карточка заказа**

```
interface IInfoOrder {                 
    payment: string;                     
    email: string;                        
    phone: string;
    address: string;
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

### Класс `EventEmitter`
Предназначен для взаимодействия с событиями.
- on()(event: string, listener: Function) // Установить обработчик на событие
- emit()(event: string, listener: Function) // Инициировать событие с данными
- trigger()(callback: Function)  // Сделать коллбек триггер, генерирующий событие при вызове
 - onAll() установить слушатель на все события.  

### Слой данных **MODEL**

#### Класс CardData

Хранит в себе карточки товара и отвечает за работу с ними

**Поля**
- _cards: ICard[] - массив карточек
- _selectCardId: string | null - id выбранной карточки, для просмотра в модальном окне

**Методы**
- setSelected(cardId: string): void - передаёт карточку по её id
- getCard(cardId:string): ICard - возвращает карточку по id.
- getSelected(): ICard - возвращает карточку, которую выбрали
- геттеры и сеттеры для сохранения и получения данных их полей класса.

#### Класс BasketData

Содержит в себе данные о товарах в корзине

**Поля**
- cardsBasket: ICard[] - массив объектов товаров, выбранных для оформленния заказа

**Методы**
- getIdBasketList(): string[] - возвращает id товаров для передачи данных на сервер
- getTotal(): number - возвращает общую сумму корзины
- remove(id: string): void - удаляет товар из корзины
- add(card: ICard): void - добавляет товар в корзину
- getBasketList(): void - нумерует товары и возвращает список в корзине.
- contains - проверяет на наличие товара в корзине
- clear(): void - очищает корзину
- getBasketLength():number - Возвращает длину массива заказа







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

#### Класс Basket

Отображает товары в корзине. Класс применяется для отображения выбранных для заказа товаров и их общей суммы. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.

**Поля**
- items: HTMLElement[] - массив выбранных карточек
- total: number - общая сумма заказа

**Методы**
- сеттеры для сохранения данных в поля класса
- toggleButton(state: boolean) - переключение класса у кнопки
- render(): HTMLElement - возвращает заполненную карточку с установленными слушателями





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