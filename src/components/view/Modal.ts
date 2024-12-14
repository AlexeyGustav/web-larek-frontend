import { IEvents } from "../base/events";
import { ensureElement, createElement } from "../../utils/utils";
import { Component } from "../../components/view/Card";
import { IModal } from "../../types";

export class Modal extends Component<IModal> {
  protected overlay: HTMLElement;
  protected _modalContent: HTMLElement;
  protected _modalCloseBtn: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container)

    this._modalCloseBtn = ensureElement(".modal__close", this.container) as HTMLButtonElement;
    this._modalContent = ensureElement(".modal__content", this.container);

    // Оверлей
    this.overlay = createElement<HTMLElement>("div")
    container.prepend(this.overlay);
    this.overlay.className = "overlay"
    this.overlay.style.height = "100%";
    this.overlay.style.width = "100%";
    this.overlay.style.position = "fixed";
    this.overlay.style.inset = "0";
    this.overlay.style.setProperty("z-index", "101");

    // Закрыть на оверлей
    this.overlay.addEventListener("click", () => this.closeModal());

    // Закрыть по кнопке
    this._modalCloseBtn.addEventListener("click", () => this.closeModal());

  }
  // Запоняем контентом
  set modalContent(content: HTMLElement) {
    this._modalContent.replaceChildren(content);
  }

  // Закрыть оверлей на кнопку ESC
  closeEscape = (evt: KeyboardEvent) => {
    if (evt.key === "Escape") {
      this.closeModal();
    }
  }

  // метод переключения модального окна
  toggleModal(state: boolean) {
    this.toggleClass(this.container, "modal_active", state);
  }

  // Открыть модальное окно
  openModal() {
    document.addEventListener("keydown", this.closeEscape);
    this.events.emit("modal:open");
    this.toggleModal(true)
  }

  // Закрыть модальное окно
  closeModal() {
    document.removeEventListener("keydown", this.closeEscape)
    this.events.emit("modal:close");
    this.toggleModal(false)
    this.modalContent = null;
  }

  render(data?: Partial<IModal>): HTMLElement {
    Object.assign(this, data);
    return this.container
  }
}