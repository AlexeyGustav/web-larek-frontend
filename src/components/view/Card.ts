import { IEvents } from "../../components/base/events";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { Component } from "../../components/base/Component";
import { ICard } from "../../types/index";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card  extends Component<ICard> {
  // protected itemElement: HTMLElement;


  protected events: IEvents;
  protected _title: HTMLElement;
  protected cardId: string;
  protected _image?: HTMLImageElement;
  protected button?: HTMLButtonElement;
  protected _price: HTMLElement;
  protected _category?: HTMLElement;

  constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
    super(container);
    this.events = events;

    this._title = this.container.querySelector(".card__title");
    this._image = this.container.querySelector(".card__image");
    this._price = this.container.querySelector(".card__price");
    this._category = this.container.querySelector(".card__category");
    this.button = this.container.firstElementChild.querySelector(".gallery__item");




 
    // this.deleteBtn = this.itemElement.querySelector(".basket__item-delete");

    // this.container.addEventListener("click", () => {
    //   this.events.emit("card:select", { card: this.cardId })
    // });



    // this.deleteBtn.addEventListener("click", () => {
    //   this.events.emit("card:delete", { card: this })
    // });
    
    if (actions?.onClick) {
      if (this.button) {
          this.button.addEventListener('click', actions.onClick);
      } else {
          container.addEventListener('click', actions.onClick);
      }
    }

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
      this._price.textContent = "Бесценно";
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
      case "софт-скил":
        this._category.style.background = "#83FA9D"
        break
    }
  }

  set image(link: string) {
    this.setImage(this._image, link)
  }




}

// Отображение карточки в модальном окне
export class ModalCardPreview<T> extends Card {
  protected _description: HTMLElement;
  protected buyBtn?: HTMLButtonElement;


  constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
    super(container, events)

    this._description = this.container.querySelector(".card__text");
    this.buyBtn = ensureElement(".card__button", this.container) as HTMLButtonElement;

    // }
    // if (this.buyBtn) {
    //   this.buyBtn.addEventListener("click", () => {
    //         this.events.emit("modalCard:changed", { card: this.cardId})
    //       });
    // }

    if (actions?.onClick) {
      if (this.buyBtn) {
          this.buyBtn.addEventListener('click', actions.onClick);
        }
    }

  }

  set description(description: string) {
    if (this._description) {
      this.setText(this._description, description);
    }
  }

  getDisabled(card: ICard) {
    if (card.price === null) {
      this.buyBtn.disabled = true
    } else {
      this.buyBtn.disabled = false
    }
  }

  replaceTextBtn(value: boolean) {
    if (value) {
      this.setText(this.buyBtn, "В корзину");
    } else {
      this.setText(this.buyBtn, "Удалить из корзины");
      this.events.emit("card: delete", { card: this.cardId });
    }
}

}

// Отображение карточки в корзине
export class ModalCardBasket extends Card {
  protected _basketIndex: HTMLElement;
  protected basketIndexDelete: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
    super(container, events);

    this._basketIndex = this.container.querySelector(".basket__item-index");
    this.basketIndexDelete = this.container.querySelector(".basket__item-delete") as HTMLButtonElement;

    if (actions?.onClick) {
      if (this.basketIndexDelete) {
          this.basketIndexDelete.addEventListener('click', actions.onClick);
      }  
    };

    // this.basketIndexDelete.addEventListener('click', () => {
    //   events.emit('delete:card', { card: this.cardId });
    // });
  }

  set basketIndex(index: number) {
    
    this.setText(this._basketIndex, index+1);
  }
}