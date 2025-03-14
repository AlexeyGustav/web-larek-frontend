import './scss/styles.scss';
import { CardData } from "./components/model/CardData";
import { EventEmitter } from "./components/base/events";
import { API_URL, CDN_URL } from "./utils/constants";
import { CoursesAPI } from "./components/model/ActionApi";
import { Card, ModalCardPreview, ModalCardBasket } from "./components/view/Card";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { ICard, IOrderDataAll } from "./types/index";
import { CardsContainer } from "./components/view/CardsContainer";
import { Modal } from "./components/view/Modal";
import { Page } from "./components/view/Page";
import { BasketData } from "./components/model/BasketData";
import { Basket } from "./components/view/Basket";
import { OrderData } from "./components/model/OrderData";
import { OrderPay } from "./components/view/OrderPay";
import { Contacts } from "./components/view/Contacts";
import { Total } from "./components/view/Total";
import { mokData } from "./tempMokData";


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');
const modalContent = ensureElement<HTMLDivElement>('.modal__content');

// EventImter
const events = new EventEmitter();

// Контейнеры
const pageContainer = ensureElement<HTMLElement>('.page');
const modal = new Modal(modalContainer, events);
const page = new Page(pageContainer, events);

// Все экзампляры
const api = new CoursesAPI(CDN_URL, API_URL)
const cardContainer = new CardsContainer(document.querySelector(".gallery"));
const cardData = new CardData(events);

const basketData = new BasketData(events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);

const orderData = new OrderData(events);
const orderPay = new OrderPay(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Прослушать все события
events.onAll((event) => {
  console.log(event.eventName, event.data)
})

// Получаем лоты с сервера
api.getLotList()
  .then((data) => {
    cardData.cards = data;

    const renderCards = cardData.cards.map((item) => {
      const card = new Card(cloneTemplate(cardCatalogTemplate), events,
      { onClick: () => events.emit('card:select', item) }
    );
  
      return card.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price
      });
  
    });

    cardContainer.render({ catalog: renderCards });
  })
  .catch(err => {
    console.error(err);
});


// Открыть модальное окно с карточкой товара
events.on('card:select', (item: ICard) => {

  const modalCardPreview = new ModalCardPreview(cloneTemplate(cardPreviewTemplate), events, { onClick: () => {
    const selectCard = cardData.getCard(item.id);
    const cardBasket = basketData.contains(item.id)
  
    console.log('cardBasket: ', cardBasket);
    if (!cardBasket) {
      basketData.addCard(selectCard)
      modalCardPreview.replaceTextBtn(false);
    } else {
      basketData.deleteCard(item.id)
      modalCardPreview.replaceTextBtn(true);
    }
  }});

  const cardBasket = basketData.contains(item.id)
  if (!cardBasket) {
    modalCardPreview.replaceTextBtn(true);
  } else {
    modalCardPreview.replaceTextBtn(false);
  }

  modal.render({
    content: modalCardPreview.render(
      item
    )
  });

  modalCardPreview.getDisabled(item)

});

// Корзина
// Изменения в корзине
events.on('basket:changed', () => {
  const itemsContent = basketData.cards.map((card, index) => {
    const cardBasket = new ModalCardBasket(cloneTemplate(cardBasketTemplate), events, { onClick: () => events.emit('delete:card', card) });

    cardBasket.basketIndex = index

    return cardBasket.render({
      id: card.id,
      title: card.title,
      price: card.price,
    });
  })

  basketView.render({
    items: itemsContent,
    totalPrice: basketData.total,
  })

  page.render({
    counter: basketData.getBasketLength()
  })

})

// Открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: basketView.render()
  })
});

// Удалить товар из корзины
events.on('delete:card', (item: ICard) => {
  basketData.deleteCard(item.id)

});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});


// Оформление заказа

events.on('order:changed', (errors: Partial<IOrderDataAll>) => {

  const {paymend, address} = errors;
  orderPay.disabled = !paymend && !address;
  orderPay.errors = Object.values({paymend, address}).filter(i => !!i).join(' и ');
  
  const {email, phone} = errors;
  contacts.disabled = !email && !phone;
  contacts.errors = Object.values({email, phone}).filter(i => !!i).join(' и ');
});

// Изменился метод оплаты
events.on('paymend:change', ({ value }: { value: string }) => {
  orderData.updatePaymentMethod(value);
});

// Изменилось поле
events.on(/^order\..*:change/, (data: { field: keyof IOrderDataAll, value: string }) => {
  orderData.setOrder(data.field, data.value);
});

// Открыть модальное окно оплаты
events.on('order:open', () => {
  modal.render({
    content: orderPay.render({
      paymend: orderData.order.paymend,
      adress:  orderData.order.address,
      disabled: false,
      errors: []
    }),
  })
});

// Открыть модальное окно контакты
events.on('order:submit', () => {
  modal.render({
    content: contacts.render({
      email: orderData.order.email,
      phone: orderData.order.phone,
      disabled: false,
      errors: [],
    }),
  })
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderDataAll, value: string }) => {
  orderData.setOrder(data.field, data.value);
});


// Отправка заказа и финальное окно подтверждение заказа
events.on('contacts:submit', () => {
  // Сборка заказа
  const all = {
    payment: orderData.order.paymend,
    address: orderData.order.address,
    email: orderData.order.email,
    phone: orderData.order.phone,
    total: basketData.total,
    items: basketData.getListInBasket(),
  };

  
  api.postTotalOrder(all)
  
  .then((result) => {
      const total = new Total(cloneTemplate(successTemplate), events, {
        onClick: () => {
          modal.close();
        }
      });
    
      modal.render({
        content: total.render({
          totalSum: basketData.total
        })
      })
      // Отчистка корзины и данных пользователя
      basketData.clear();
      orderData.clear();
      orderPay.form.reset();
      contacts.form.reset();
      orderPay.resetPaymentMethod();
    })
    .catch(err => {
      console.error(err);
    });
});