import { EventEmitter, IEvents } from "../../components/base/events";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { Component } from "../../components/base/Component";
import { ICard } from "../../types/index";

export class Card  extends Component<ICard> {
  // protected itemElement: HTMLElement;


  protected events: IEvents;
  protected _description?: HTMLElement;
  protected _title: HTMLElement;
  protected cardId: string;
  protected _image?: HTMLImageElement;
  protected button?: HTMLButtonElement;
  protected _price: HTMLElement;
  protected _category?: HTMLElement;
  // protected deleteBtn?: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this._title = this.container.querySelector(".card__title");
    this._image = this.container.querySelector(".card__image");
    this._price = this.container.querySelector(".card__price");
    this._category = this.container.querySelector(".card__category");
    this.button = this.container.firstElementChild.querySelector(".gallery__item");
    this._description = this.container.querySelector(".card__text");
    // this.deleteBtn = this.itemElement.querySelector(".basket__item-delete");

    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { card: this.cardId })
    });

    this.container.addEventListener("click", () => {
      this.events.emit("cardPreview:open", { card: this })
    });

    // this.deleteBtn.addEventListener("click", () => {
    //   this.events.emit("card:delete", { card: this })
    // });
    

  }

  set id(id: string) {
    this.cardId = id;
  }

  get id() {
    return this.cardId
  }

  set title(value: string) {
    this.setText(this._title, value)
  }

  set price(value: number) {
    this.setText(this._price, `${value + " синапсов"}`)

    if(value === null) {
      this._price.textContent = "Бесценно"
    }
  }

  set category(value: string) {
    this.setText(this._category, value);

    switch (this._category.textContent) {
      case "другое":
        this._category.style.background = "#FAD883"
        break
      case "дополнительное":
        this._category.style.background = "#B783FA"
        break
      case "кнопка":
        this._category.style.background = "#83DDFA"
        break
      case "хард-скил":
        this._category.style.background = "#FAA083"
        break
    }
  }

  set image(link: string) {
    this.setImage(this._image, link)
  }

  set description(description: string) {
    if (this._description) {
        this.setText( this._description, description);
    }
}


  // deleteCard() {
  //   this.itemElement.remove();
  //   this.itemElement = null;
  // }

}

// Отображение карточки в модальном окне

export class ModalCardPreview<T> extends Card {
  preview: string | null;

  constructor(container: HTMLElement, events: IEvents, data?: Partial<T>) {
    super(container, events)

    Object.assign(this, data);


  }

  set description(value: string) {
    this.setText(this._description, value)
  }

  setPreview(item: ICard) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  // Сообщить всем что модель поменялась
  emitChanges(event: string, payload?: object) {
    // Состав данных можно модифицировать
    this.events.emit(event, payload ?? {});
  }

}