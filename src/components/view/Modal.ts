import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import {ensureElement} from "../../utils/utils";

interface IModalData {
  content: HTMLElement;
}

// export class Modal<T> extends Component<T> {
//   protected modal: HTMLElement;
//   protected events: IEvents;

//   constructor(container: HTMLElement, events: IEvents) {
//     super(container);
//     this.events = events;
//     const closeButtonElement = this.container.querySelector(".modal__close");
//     closeButtonElement.addEventListener("click", this.close.bind(this));
//     this.container.addEventListener("mousedown", (evt) => {
//       if (evt.target === evt.currentTarget) {
//         this.close();
//       }
//     });
//     this.handleEscUp = this.handleEscUp.bind(this);
//   }

//   // Запоняем контентом
//   set content(content: HTMLElement) {
//     this.modal.replaceChildren(content);
//   }

//   // Открыть модальное окно
//   open() {
//     this.container.classList.add("modal_active");
//     document.addEventListener("keyup", this.handleEscUp);
//       }

//   // Закрыть модальное окно
//   close() {
//     this.container.classList.remove("modal_active");
//     document.removeEventListener("keyup", this.handleEscUp);
//   }

//   // Закрыть модальное окно по кнопке Esc
//   handleEscUp(evt: KeyboardEvent) {
//     if (evt.key === "Escape") {
//       this.close();
//     }
//   };

//   render(data?: Partial<IModalData>): HTMLElement {
//     Object.assign(this, data);
//     return this.container
// }

// }





export class Modal<T> extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
      this._content = ensureElement<HTMLElement>('.modal__content', container);

      this._closeButton.addEventListener('click', this.close.bind(this));
      this.container.addEventListener('click', this.close.bind(this));
      this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
      this._content.replaceChildren(value);
  }

  open() {
      this.container.classList.add('modal_active');
      this.events.emit('modal:open');
  }

  close() {
      this.container.classList.remove('modal_active');
      this.content = null;
      this.events.emit('modal:close');
  }

  // Закрыть модальное окно по кнопке Esc
  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  };

  render(data: IModalData): HTMLElement {
      super.render(data);
      this.open();
      return this.container;
  }
}