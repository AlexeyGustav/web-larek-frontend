import './scss/styles.scss';

import { Api } from "./components/base/api";
import { EventEmitter } from "./components/base/events";
import { API_URL, settings } from "./utils/constants";
import { CoursesApi } from "./components/model/CoursesApi";
import { CardData } from "./components/model/cardData";
import { BasketData } from './components/model/BasketData';
import { OrderData } from './components/model/OrderData';
import { Component, Card } from "./components/view/Card";
import { Page } from './components/view/Page';
import { ICoursesApi, IInfoOrder } from "./types/index";
import { Modal } from "./components/view/Modal";
import { Basket } from './components/view/Basket';
import { Payment } from './components/view/Payment';
import { Contacts } from './components/view/Contacts';
import { Bingo } from './components/view/Bingo';
import { cloneTemplate, ensureElement } from "./utils/utils";
import { cardsData } from "./tempMokData";

// Контейнеры
const pageContainer = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLElement>('#modal-container');


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// брокер событий
const events = new EventEmitter();
// Экземпляры классов
const baseApi: ICoursesApi = new Api(API_URL, settings);
const api = new CoursesApi(baseApi);
const page = new Page(pageContainer, events);
const cardData = new CardData(events);
const modal = new Modal(modalContainer, events);
const basketData = new BasketData(events)
const basket = new Basket(basketTemplate, events);
const orderData = new OrderData(events);
const paymentOrder = new Payment(cloneTemplate(orderTemplate), events);
const success = new Bingo(cloneTemplate(successTemplate), events);
const contacts = new Contacts(cloneTemplate(templateContacts), events);


// Получаем карточки с сервера
// events.onAll((event) => {
//   console.log(event.eventName, event.data);
// });

// Получаем карточки с сервера и загружаем в галерею
api.getListCards()
  .then((items) => {
      cardData.cards = items

      page.render({
          gallery: cardData.cards.map(item => {
              const card = new Card(cardCatalogTemplate, events);
              return card.render({
                  ...item
              })
          })
      })
  }).catch(
    console.error
  )

  // Модальное окно Preview
events.on('modalView:open', (data: { cardId: string }) => {
  const cardBasket = basketData.contains(data.cardId);
  const selectCard = cardData.getCard(data.cardId);
  const cardPreview = new Card(cardPreviewTemplate, events);

  cardData.setSelected(data.cardId);

  if (!cardBasket) {
      cardPreview.replaceTextBtn(false);
  } else {
      cardPreview.replaceTextBtn(true);
  }

  modal.render({
      modalContent: cardPreview.render({
          ...selectCard
      })
  });

  modal.openModal()
});

events.on('modalView:submit', (data: { cardId: string }) => {
  const previewCard = new Card(cardPreviewTemplate, events);
  const cardBasket = basketData.contains(data.cardId);
  const selectCard = cardData.getCard(data.cardId);

  if (!cardBasket) {
      previewCard.replaceTextBtn(true);
      basketData.add(selectCard);
  } else {
      previewCard.replaceTextBtn(false);
      basketData.remove(data.cardId);
  }

  modal.render({
      modalContent: previewCard.render({
          ...selectCard
      })
  });
});

// Корзина
events.on('basket:open', () => {
  modal.render({
      modalContent: basket.render({
          total: basketData.getTotal(),
          items: basketData.getBasketList().map((item) => {
              const cardBasket = new Card(cardBasketTemplate, events);

              return cardBasket.render({
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  index: item.index
              })
          })
      })
  });

  modal.openModal();
});

events.on('basket:changed', () => {
  basket.render({
      total: basketData.getTotal(),
      items: basketData.getBasketList().map((item) => {
          const cardBasket = new Card(cardBasketTemplate, events)

          return cardBasket.render({
              id: item.id,
              title: item.title,
              price: item.price,
              index: item.index
          })
      })
  })

  page.render({
      counterBasket: basketData.getBasketLength()
  });
});

events.on('card: delete', (data: { cardId: string }) => {
  basketData.remove(data.cardId)
});

// Модальное окно оплата
events.on('basket:submit', () => {
  const address = orderData.setErrors().address;
  const payment = orderData.setErrors().payment;

  modal.render({
      modalContent: paymentOrder.render({
          valid: !payment && !address,
          address: orderData.getOrder().address,
          payment: orderData.getOrder().payment,
          error: getErrorMessage({ payment, address })
      })
  });

  modal.openModal();
});

// Открыть модальное контакты
events.on('order:submit', () => {
  const phone = orderData.setErrors().phone;
  const email = orderData.setErrors().email;

  modal.render({
      modalContent: contacts.render({
          valid: !email && !phone,
          phone: orderData.getOrder().phone,
          email: orderData.getOrder().email,
          error: getErrorMessage({ email, phone })
      })
  });

  modal.openModal();
});

// Настройки полей формы
events.on('form:change', (data: { 
  field: keyof IInfoOrder, value: string;
}) => {
  orderData.setField(data.field, data.value);
});


// Сообщения об ошибках
function getErrorMessage(errors: Partial<IInfoOrder>): string {
  return Object.values(errors).filter(i => !!i).join(' и ');
};

// Обновление полей формы
events.on('order:changed', () => {
  const { 
      payment, 
      address, 
      email, 
      phone 
  } = orderData.setErrors()

  contacts.render({
      valid: !email && !phone,
      phone: orderData.getOrder().phone,
      email: orderData.getOrder().email,
      error: getErrorMessage({ email, phone })
  });
  paymentOrder.render({
      valid: !payment && !address,
      payment: orderData.getOrder().payment,
      address: orderData.getOrder().address,
      error: getErrorMessage({ payment, address })
  });
});

// Модальное окно завершение заказа - открыть
events.on('contacts:submit', () => {
  const orderAll = {
      ...orderData.getOrder(),
      total: basketData.getTotal(),
      items: basketData.getIdBasketList()
  };

  api.allOrder(orderAll)
      .then(data => {
          // console.log(data)
          modal.render({
              modalContent: success.render({
                  total: data.total
              })
          });
          basketData.clear();
          orderData.clear();
          modal.openModal();
      }).catch(
          console.error
      )
});

// Модальное окно завершение заказа - закрыть
events.on('success:close', () => {
  modal.closeModal()
})


// Фиксация модального окна
events.on('modal:open', () => {
  page.blockPageScroll(true)
});

events.on('modal:close', () => {
  page.blockPageScroll(false)
});

