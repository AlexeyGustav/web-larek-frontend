import { IEvents } from "../base/events";

export class Modal<T> {
  protected modal: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {

    this.events = events;
    this.modal = container;
    const closeButtonElement = this.modal.querySelector(".modal__close");
    closeButtonElement.addEventListener("click", this.close.bind(this));
    this.modal.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  open() {
    this.modal.classList.add("modal_active");
    document.addEventListener("keyup", this.handleEscUp);
  }

  close() {
    this.modal.classList.remove("modal_active");
    document.removeEventListener("keyup", this.handleEscUp);
  }

  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  };
}
