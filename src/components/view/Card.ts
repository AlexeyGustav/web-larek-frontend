import { EventEmitter, IEvents } from "../../components/base/events";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { ICard } from "../../types/index";

/**
 * Базовый компонент
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
      // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
  }

  // Инструментарий для работы с DOM в дочерних компонентах

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean) {
      element.classList.toggle(className, force);
  }

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: unknown) {
      if (element) {
          element.textContent = String(value);
      }
  }

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean) {
      if (element) {
          if (state) element.setAttribute('disabled', 'disabled');
          else element.removeAttribute('disabled');
      }
  }

  // Скрыть
  protected setHidden(element: HTMLElement) {
      element.style.display = 'none';
  }

  // Показать
  protected setVisible(element: HTMLElement) {
      element.style.removeProperty('display');
  }

  // Установить изображение с алтернативным текстом
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
      if (element) {
          element.src = src;
          if (alt) {
              element.alt = alt;
          }
      }
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}


// export class Card {
//   protected itemElement: HTMLElement;
//   protected events: IEvents;
//   // protected description?: HTMLElement;
//   protected title: HTMLElement;
//   protected cardId: string;
//   protected image?: HTMLImageElement;
//   protected button?: HTMLButtonElement;
//   protected price: HTMLElement;
//   protected category?: HTMLElement;
//   // protected deleteBtn?: HTMLElement;

//   constructor(template: HTMLTemplateElement, events: IEvents) {
//     this.events = events;
//     this.itemElement = cloneTemplate(template);

//     // this.description = this.itemElement.querySelector(".card__text");
//     this.title = this.itemElement.querySelector(".card__title");
//     this.image = this.itemElement.querySelector(".card__image");
//     this.price = this.itemElement.querySelector(".card__price");
//     this.category = this.itemElement.querySelector(".card__category");
//     // this.button = this.itemElement.baseElement.querySelector(".gallery__item");
//     // this.deleteBtn = this.itemElement.querySelector(".basket__item-delete");

//     // this.button.addEventListener("click", () => {
//     //   this.events.emit("card:select", { card: this })
//     // });

//     // this.deleteBtn.addEventListener("click", () => {
//     //   this.events.emit("card:delete", { card: this })
//     // });

//   }

//   setData(cardData: ICard) {
// 		this.cardId = cardData.id;
	
// 		this.title.textContent = cardData.title;
// 		this.price.textContent = `${String(cardData.price) + " синапсов"}`;
// 		// this.description.textContent = cardData.description; 
// 		this.image.src = cardData.image;
// 		this.category.textContent = cardData.category;
//     // кнопка

//     if(cardData.price === null) {
//       this.price.textContent = "Бесценно"
//     }
// 	}

//   get id() {
//     return this.cardId
//   }

//   deleteCard() {
//     this.itemElement.remove();
//     this.itemElement = null;
//   }

//   render() {
//     return this.itemElement
//   }
// }
interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

// export class Card {
//   protected itemElement: HTMLElement;
//   protected events: IEvents;
//   protected description?: HTMLElement;
//   protected title: HTMLElement;
//   protected cardId: string;
//   protected image?: HTMLImageElement;
//   protected button?: HTMLButtonElement;
//   protected price: HTMLElement;
//   protected category?: HTMLElement;
//   // protected deleteBtn?: HTMLElement;

//   constructor(template: HTMLTemplateElement, events: IEvents, actions?: ICardActions) {
//     this.events = events;
//     this.itemElement = cloneTemplate(template);

//     // this.description = this.itemElement.querySelector(".card__text");
//     this.title = this.itemElement.querySelector(".card__title");
//     this.image = this.itemElement.querySelector(".card__image");
//     this.price = this.itemElement.querySelector(".card__price");
//     this.category = this.itemElement.querySelector(".card__category");
//     this.button = this.itemElement.querySelector(".gallery__item");
//     console.log(' this.button: ',  this.button);
//     // this.deleteBtn = this.itemElement.querySelector(".basket__item-delete");

//     // this.button.addEventListener("click", () => {
//     //   this.events.emit("card:select", { card: this })
//     // });

//     // this.deleteBtn.addEventListener("click", () => {
//     //   this.events.emit("card:delete", { card: this })
//     // });

//   }

//   setData(cardData: ICard) {
// 		this.cardId = cardData.id;
	
// 		this.title.textContent = cardData.title;
// 		this.price.textContent = `${String(cardData.price) + " синапсов"}`;
// 		// this.description.textContent = cardData.description; 
// 		this.image.src = cardData.image;
// 		this.category.textContent = cardData.category;
//     // кнопка

//     if(cardData.price === null) {
//       this.price.textContent = "Бесценно"
//     }
// 	}

//   get id() {
//     return this.cardId
//   }

//   deleteCard() {
//     this.itemElement.remove();
//     this.itemElement = null;
//   }

//   render() {
//     return this.itemElement
//   }
// }
export class Card extends Component<ICard> {
  // protected itemElement: HTMLElement;
  protected events: IEvents;
  protected description?: HTMLElement;
  protected title: HTMLElement;
  protected cardId: string;
  protected image?: HTMLImageElement;
  protected button?: HTMLButtonElement;
  protected price: HTMLElement;
  protected category?: HTMLElement;
  // protected deleteBtn?: HTMLElement;

  constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
    super(container);
   
    this.events = events;

    this.title = ensureElement<HTMLElement>(".card__title", this.container);
    this.image = ensureElement(".card__image", this.container) as HTMLImageElement;
    this.price = ensureElement<HTMLElement>(".card__price", this.container);
    this.category = ensureElement<HTMLElement>(".card__category", this.container);
    // this.deleteBtn = this.itemElement.querySelector(".basket__item-delete");
    this.button = container.querySelector(".gallery__item") as HTMLButtonElement;


    // this.button.addEventListener("click", () => {
    //   this.events.emit("card:select", { card: this })
    // });

    // this.deleteBtn.addEventListener("click", () => {
    //   this.events.emit("card:delete", { card: this })
    // });

    // if (actions?.onClick) {
    //   if (this.button) {
    //       this.button.addEventListener('click', actions.onClick);
    //   } else {
    //       container.addEventListener('click', actions.onClick);
    //   }
    // }

  }

  // изменяет текст
  set name(value: string) {
    this.setText(this.price, value);
  }

  // пример для кнопок выбора оплаты
  // set complited(value: boolean) {
  //   this.toggleClass(this.button, "card", value);
  //   this.toggleClass(this.button, "cash", !value);
  // }
  // card1.complited = true



}