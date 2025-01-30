import { IEvents } from "../../components/base/events";
import { ICard, IBasketData } from '../../types/index';
import { ensureElement, cloneTemplate, formatNumber, createElement } from "../../utils/utils";
import { Component } from '../base/Component';

export interface IBasket {

}


export class Basket extends Component<IBasketData> {
  protected events: IEvents;
  protected basketTitle: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketTotalPrice: HTMLElement;
  protected _list: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketTitle = this.container.querySelector("modal__title");
    this.basketButton = this.container.querySelector("basket__button") as HTMLButtonElement;
    this.basketTotalPrice = this.container.querySelector("basket__price");
    this._list = this.container.querySelector("basket__list");

    if (this.basketButton) {
      this.basketButton.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
    }
  }

  set totalPrice(total: number) {
    this.setText(this.basketTotalPrice, formatNumber(total));
  }

  // set selected(items: string[]) {
  //   if (items.length) {
  //     this.setDisabled(this.basketButton, false);
  //   } else {
  //     this.setDisabled(this.basketButton, true);
  //   }
  // }

}