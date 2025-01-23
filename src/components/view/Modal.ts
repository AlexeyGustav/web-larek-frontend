import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModalData {
  content: HTMLElement;
}

export class Modal<T> extends Component<T> {
  protected modal: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    // this.modal = container;
    const closeButtonElement = this.container.querySelector(".modal__close");
    closeButtonElement.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  // Запоняем контентом
  set modalContent(content: HTMLElement) {
    this.modal.replaceChildren(content);
  }

  // Открыть модальное окно
  open() {
    this.container.classList.add("modal_active");
    document.addEventListener("keyup", this.handleEscUp);
      }

  // Закрыть модальное окно
  close() {
    this.container.classList.remove("modal_active");
    document.removeEventListener("keyup", this.handleEscUp);
  }

  // Закрыть модальное окно по кнопке Esc
  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  };

  render(data?: Partial<IModalData>): HTMLElement {
    Object.assign(this, data);
    return this.container
}

}
