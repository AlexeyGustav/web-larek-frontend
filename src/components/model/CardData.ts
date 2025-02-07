import { ICard } from "../../types/index";
import { IEvents } from "../base/events";

// TODO: добавить интерфейс в типы и ридми
export interface ICardsData {
	cards: ICard[];
  getCard(cardId: string): ICard;
}

export class CardData implements ICardsData {
  protected _cards: ICard[];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  set cards(cards: ICard[]) {
    this._cards = cards;
  }

  get cards() {
    return this._cards;
  }

  // Отдать карточку
  getCard(cardId: string): ICard {
    return this._cards.find((item) => item.id === cardId)
  }

}