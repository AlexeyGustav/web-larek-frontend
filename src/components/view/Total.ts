import { ensureElement } from "../../utils/utils";
import { Component } from "../../components/base/Component";
import { IEvents } from "../../components/base/events";
import { IActions } from "../../types/index";

export interface ITotal {
  totalSum: number;
}

export class Total extends Component<ITotal>{
  protected total: HTMLElement;
  protected nextPage: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container)

    this.total = ensureElement<HTMLElement>(".order-success__description", this.container);
    this.nextPage = ensureElement<HTMLButtonElement>(".order-success__close", this.container);

    if (actions?.onClick) {
      if (this.nextPage) {
        this.nextPage.addEventListener('click', actions.onClick);
      }
    };
  }

  set totalSum(value: string) {
    this.total.innerText = `Списано ${value} cинапсов`
  }
}