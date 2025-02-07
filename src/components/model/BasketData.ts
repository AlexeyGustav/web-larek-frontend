import { ICard, IBasketData, CardInfo } from '../../types/index';
import { IEvents } from "../base/events";

export class BasketData implements IBasketData {
  protected _cards: ICard[] = [];

  constructor(protected events: IEvents) {}

  get cards(): ICard[] {
    return this._cards;
  }

  get total(): number {
    return this.getTotal();
  }

  // Добавить товар
  addCard(card: ICard) {
    this._cards = [card, ...this.cards]
    this.events.emit('basket:changed')
  }

  // Удалить товар
  deleteCard(cardId: string) {
    this._cards = this.cards.filter(card => card.id !== cardId);
    this.events.emit('basket:changed')
  }

  // Получить количество товаров
  getBasketLength(): number {
    return this._cards.length ?? 0;
  };

  // Общая сумма в корзине
  getTotal(): number {
    if (!this._cards.length) {
      return 0;
    } else {
      return this._cards.map((item) => item.price).reduce((a, b) => a + b);
    };
  };

  // Проверка наличия
  contains(id: string): boolean {
    return this._cards.some(item => item.id === id);
  };

  // Очистка корзины
  clear(): void {
    this._cards = [];
    this.events.emit('basket:changed');
  };
}