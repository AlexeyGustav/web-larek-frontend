import { ICard, IDataCard } from "../../types/index";
import { EventEmitter, IEvents } from "../../components/base/events";

export class CardsData implements IDataCard {
  protected _cards: ICard[];
  protected previewCard: string | null;
  protected events: IEvents;
  selectСard?(item: ICard): void;

  constructor(events: IEvents) {
    this.events = events
  }

  set cards(cards: ICard[]) {
    this._cards = cards;
    this.events.emit('cards:changed')
  }

  get cards() {
    return this._cards;
  }

  getCard(cardId: string) {
    return this._cards.find((item) => item.id === cardId)
  }

  deleteCard(cardId: string, payload: Function | null = null) {
    this._cards = this._cards.filter(card => card.id !== cardId);

    if (payload) {
      payload();
    } else {
      this.events.emit('cards:changed')
    }
  }

  // Отвечает за id карточки, выбранной для просмотра в модальной окне
  set preview(cardId: string | null) {
    if (!cardId) {
      this.previewCard = null;
      return;
    }
    const selectedCard = this.getCard(cardId);
    if (selectedCard) {
      this.previewCard = cardId;
      this.events.emit('card:selected')
    }
  }

  get preview() {
    return this.previewCard;
  }
}