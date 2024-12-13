import { IEvents } from "../../components/base/events";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { ICard } from "../../types/index";
import { CDN_URL } from "../../utils/constants";

/**
 * Базовый компонент
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
      // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
  }

  // Инструментарий для работы с DOM в дочерних компонентах

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean) {
      element.classList.toggle(className, force);
  }

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: unknown) {
      if (element) {
          element.textContent = String(value);
      }
  }

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean) {
      if (element) {
          if (state) element.setAttribute('disabled', 'disabled');
          else element.removeAttribute('disabled');
      }
  }

  // Скрыть
  protected setHidden(element: HTMLElement) {
      element.style.display = 'none';
  }

  // Показать
  protected setVisible(element: HTMLElement) {
      element.style.removeProperty('display');
  }

  // Установить изображение с алтернативным текстом
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
      if (element) {
          element.src = src;
          if (alt) {
              element.alt = alt;
          }
      }
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}


export class Card extends Component<ICard> {

    protected itemElement: HTMLElement;
    protected _description?: HTMLElement;
    protected _title: HTMLElement;
    protected _id: string;
    protected _index: HTMLElement;
    protected _image: HTMLImageElement;
    protected button: HTMLButtonElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;


    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        super(template);

        this.itemElement = cloneTemplate(template);

        this._price = ensureElement(".card__price", this.itemElement);
        this._title = ensureElement(".card__title", this.itemElement);
        this._category = this.itemElement.querySelector(".card__category");
        this._image = this.itemElement.querySelector(".card__image");
        this._description = this.itemElement.querySelector(".card__text");
        this._index = this.itemElement.querySelector(".basket__item-index");
        this.button = this.itemElement.querySelector(".card__button");

        if (this.button) {
            this.button.addEventListener("click", () => {
                if (this.button && this._description) {
                    this.events.emit("modalView:submit", { cardId: this._id });
                } else if (this.button && !this._description) {
                    this.events.emit("card: delete", { cardId: this._id });
                }
            })
        }

        if (this.itemElement.classList.contains("gallery__item")) {
            this.itemElement.addEventListener("click", () => {
                this.events.emit("modalView:open", { cardId: this._id });
            })
        }
    }

    set id(id: string) {
        this._id = id;
    }

    set description(description: string) {
        if (this._description) {
            this.setText( this._description, description);
        }
    }

    set title(title: string) {
        this.setText( this._title, title);
    }

    set category(name: string) {
        this.setText( this._category, name);
        this.setCategory(name);
    }

    set price(price: number) {
        if (price === null) {
            this.setText(this._price, "Бесценно");
            if (this.button) {
                this.setDisabled( this.button, true);
            }
        } else {
            this.setText(this._price, `${price.toString()} синапсов`);
        }
    }

    // Цвет категории
    protected setCategory(name: string): void {
        const colorsCategory: { [key: string]: string } = {
            "софт-скил": "soft",
            "другое": "other",
            "кнопка": "button",
            "дополнительное": "additional",
            "хард-скил": "hard"
        }

        const items = (Object.keys(colorsCategory))
        items.forEach((key) => {
            if (key === name) {
                this.toggleClass(this._category, `card__category_${colorsCategory[key]}`, true);
            }
        })
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    set image(link: string) {
        this.setImage(this._image, `${CDN_URL}${link}`, `${link}`);
    }

    // Смена текста кнопки
    replaceTextBtn(value: boolean) {
        if (value) {
            this.setText(this.button, "Удалить из корзины");
        } else {
            this.setText(this.button, "В корзину");
        }
    }

    // возвращает полностью заполненную карточку с установленными слушателями
    render(cardData: Partial<ICard>): HTMLElement {
        const { 
            ...obj 
        } = cardData;
        Object.assign(this, obj);
        return this.itemElement
    }
}