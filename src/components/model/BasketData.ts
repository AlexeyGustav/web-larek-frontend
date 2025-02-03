// import { CardData, ICardsData } from '../model/CardData';
import { ICard, IBasketData } from '../../types/index';
import { IEvents } from "../base/events";

export type CardInfo = Pick<ICard & {index: number}, 'index'|'id'|'price'|'title'>;

export class BasketData implements IBasketData {
  // protected _id: string;
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

  // Получить товар
  getIdBasketList(): CardInfo[] {
    return this._cards.map((card, index) => {
      return {
        id: card.id,
        title: card.title,
        price: card.price,
        index: index + 1
      };
    });
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