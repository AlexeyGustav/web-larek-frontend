import { Modal } from "./Modal";
import { IEvents } from "../base/events";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { ICard } from "../../types/index";

interface IModalCardPreview {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image: string;
  category: string;
}

export class ModalCardPreview extends Modal<IModalCardPreview> {
  protected itemElement: HTMLElement;
  protected cardId: string;
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected description: HTMLElement;
  protected image: HTMLImageElement;
  protected category: HTMLElement;
  protected buyButton: HTMLButtonElement;

  constructor(container: HTMLElement, template: HTMLTemplateElement, events: IEvents) {
    super(container, events)

    this.itemElement = cloneTemplate(template);

    this.description = this.itemElement.querySelector(".card__text");
    this.title = this.itemElement.querySelector(".card__title");
    this.image = this.itemElement.querySelector(".card__image");
    this.price = this.itemElement.querySelector(".card__price");
    this.category = this.itemElement.querySelector(".card__category");
    this.buyButton = this.itemElement.querySelector(".button");
  }

  setData(cardData: Partial<ICard>) {
    this.cardId = cardData.id;

    this.title.textContent = cardData.title;
    this.price.textContent = `${String(cardData.price) + " синапсов"}`;
    this.description.textContent = cardData.description;
    this.image.src = cardData.image;
    this.category.textContent = cardData.category;
    this.buyButton.textContent = "Купить"

    if (cardData.price === null) {
      this.price.textContent = "Бесценно"
    }



    // super.open();
  }

  render() {
    return this.itemElement
  }
}