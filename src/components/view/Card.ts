import { EventEmitter, IEvents } from "../../components/base/events";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { ICard } from "../../types/index";

export class Card {
  protected itemElement: HTMLElement;
  protected events: IEvents;
  // protected description?: HTMLElement;
  protected title: HTMLElement;
  protected cardId: string;
  protected image?: HTMLImageElement;
  protected button?: HTMLButtonElement;
  protected price: HTMLElement;
  protected category?: HTMLElement;
  // protected deleteBtn?: HTMLElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events;
    this.itemElement = cloneTemplate(template);

    // this.description = this.itemElement.querySelector(".card__text");
    this.title = this.itemElement.querySelector(".card__title");
    this.image = this.itemElement.querySelector(".card__image");
    this.price = this.itemElement.querySelector(".card__price");
    this.category = this.itemElement.querySelector(".card__category");
    this.button = this.itemElement.firstElementChild.querySelector(".gallery__item");
    // this.deleteBtn = this.itemElement.querySelector(".basket__item-delete");

    this.itemElement.addEventListener("click", () => {
      this.events.emit("card:select", { card: this })
    });

    this.itemElement.addEventListener("click", () => {
      this.events.emit("cardPreview:open", { card: this })
    });

    // this.deleteBtn.addEventListener("click", () => {
    //   this.events.emit("card:delete", { card: this })
    // });

  }

  setData(cardData: Partial<ICard>) {
		this.cardId = cardData.id;
	
		this.title.textContent = cardData.title;
		this.price.textContent = `${String(cardData.price) + " синапсов"}`;
		// this.description.textContent = cardData.description; 
		this.image.src = cardData.image;
		this.category.textContent = cardData.category;
    // кнопка

    if(cardData.price === null) {
      this.price.textContent = "Бесценно"
    }

    switch (this.category.textContent) {
      case "другое":
        this.category.style.background = "#FAD883"
        break
      case "дополнительное":
        this.category.style.background = "#B783FA"
        break
      case "кнопка":
        this.category.style.background = "#83DDFA"
        break
      case "хард-скил":
        this.category.style.background = "#FAA083"
        break
    }
	}

  get id() {
    return this.cardId
  }

  deleteCard() {
    this.itemElement.remove();
    this.itemElement = null;
  }

  render() {
    return this.itemElement
  }
}