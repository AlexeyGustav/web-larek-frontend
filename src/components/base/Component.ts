export abstract class Component<T> {
  constructor(protected readonly container: HTMLElement) {

  }

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: unknown) {
      if (element) {
          element.textContent = String(value);
      }
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

  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}
