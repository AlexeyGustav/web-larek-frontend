import { ICard, ICardData } from "../../types/index";
import { IEvents } from "../base/events";

export class CardData implements ICardData {
  protected _cards: ICard[];
  protected _selectCardId: string | null;

  
  constructor(protected events: IEvents) {

  };

  // Получить массив карточек
  get cards() {
    return this._cards;
  };

  set cards(cards: ICard[]) {
    this._cards = cards;
  };

  // Находим карточку по её id
  getCard(id: string): ICard {
    return this._cards.find(card => card.id === id);
  };

  // Получить карточки Selected
  getSelected(): ICard {
    return this.cards.find(card => card.id === this._selectCardId)!;
  };

  // Передать карточки Selected
  setSelected(cardId: string): void {
    this._selectCardId = cardId;
  };
}