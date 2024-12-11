import { IPage } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../../components/view/Card";
import { IEvents } from "../base/events";

export class Page extends Component<IPage> {
  protected pageContainer: HTMLElement
  protected _galleryContainer: HTMLElement
  protected _counterBasket: HTMLElement;
  protected _iconButtonBasket: HTMLButtonElement

  constructor(protected container: HTMLElement, protected events: IEvents) {
      super(container)

      this.pageContainer = ensureElement('.page__wrapper', this.container);
      this._galleryContainer = ensureElement('.gallery', this.container);
      this._counterBasket = ensureElement('.header__basket-counter', this.container);
      this._iconButtonBasket = ensureElement('.header__basket', this.container) as HTMLButtonElement;

      this._iconButtonBasket.addEventListener('click', () => this.events.emit('basket:open'))
  }

  // Отображение счётчика на иконке корзины
  set counterBasket(value: number) {
      this.setText(this._counterBasket, value)
  }

  // Получаем карточки
  set gallery(cards: HTMLElement[]) {
      this._galleryContainer.replaceChildren(...cards)
  }

  // Снятие скролла при открытии модального окна
  blockPageScroll(value: boolean) {
      this.toggleClass(this.pageContainer, 'page__wrapper_locked', value);
  }
}