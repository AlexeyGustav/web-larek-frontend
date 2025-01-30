import {ICardsContainer} from "../../types/index";

export class CardsContainer {
  protected _catalog: HTMLElement[];
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items)
  }

  render(data:Partial<ICardsContainer>) {
    Object.assign(this, data);
    return this.container;
  }
}