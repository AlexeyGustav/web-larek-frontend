import { IEvents } from "../../components/base/events";
import { IBasket } from '../../types/index';
import { ensureElement, formatNumber, createElement } from "../../utils/utils";
import { Component } from '../base/Component';


export class Basket extends Component<IBasket> {
  protected events: IEvents;
  protected _basketButton: HTMLButtonElement;
  protected basketTotalPrice: HTMLElement;
  protected _list: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._basketButton = this.container.querySelector(".basket__button") as HTMLButtonElement;
    this.basketTotalPrice = this.container.querySelector(".basket__price");
    this._list = ensureElement(".basket__list", this.container);

    if (this._basketButton) {
      this._basketButton.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this._basketButton.removeAttribute('disabled')
    } else {
      this._basketButton.setAttribute('disabled', 'disabled');
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'В корзине нет товаров'
      }));
    }
  }

  set totalPrice(total: number) {
    this.setText(this.basketTotalPrice, `${formatNumber(total)} синапсов`);
  }
}