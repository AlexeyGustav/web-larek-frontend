import './scss/styles.scss';


import { CardData } from "./components/model/CardData";
import { ApiListResponse, ApiPostMethods, Api } from "./components/base/api";
import { EventEmitter, IEvents } from "./components/base/events";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { CoursesAPI } from "./components/model/ActionApi";
import { Card, ModalCardPreview, ModalCardBasket } from "./components/view/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { ICard, IBasketData } from "./types/index";
import { CardsContainer } from "./components/view/CardsContainer";
import { Modal } from "./components/view/Modal";
import { Page } from "./components/view/Page";
import { BasketData } from "./components/model/BasketData";
import { Basket } from "./components/view/Basket";
import { OrderData, TFormErrors, IOrderDataAll } from "./components/model/OrderData";

import { OrderPay } from "./components/view/OrderPay";
import { Contacts } from "./components/view/Contacts";


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

// Контейнер
const pageContainer = ensureElement<HTMLElement>('.page');

// Все экзампляры
const api = new CoursesAPI(CDN_URL, API_URL)
// const events: IEvents = new EventEmitter();
const events = new EventEmitter();
const cardContainer = new CardsContainer(document.querySelector(".gallery"));
const cardData = new CardData(events);

const basketData = new BasketData(events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);

const orderPay = new OrderPay(cloneTemplate(orderTemplate), events, { onClick: () => events.emit('order:contacts') })



const modal = new Modal(modalContainer, events);
const page = new Page(pageContainer, events)


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

  page.render({
    counter: basketData.getBasketLength()
  })
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});












// // Оформление заказа
// const orderData = new OrderData(events);

// // Изменился метод оплаты
// events.on('paymend:change', ({ value }: { value: string }) => {
//   orderData.updatePaymentMethod(value);


//   // const paymend = orderData.validateOrder();
//   // const address = orderData.validateOrder();

//   // orderPay.valid = !paymend && !address;

//   // const errorAddress = orderData.formErrors.address
//   // const errorPaymend = orderData.formErrors.paymend

//   // const q = Object.values({errorAddress, errorPaymend}).filter(i => !!i)
//   // console.log('q: ', q);

//   //   orderPay.render({
//   //     address: orderData.getOrder().address,
//   //     paymend: orderData.getOrder().paymend,
//   //     valid: orderPay.valid,
//   //     errors: q,
//   // })
// });




// // Изменилось поле
// events.on(/^order\..*:change/, (data: { field: keyof IOrderDataAll, value: string }) => {
//   orderData.setOrderFirst(data.field, data.value);
//   console.log('orderData:ready ', orderData);
// });







// // Открыть модальное окно оплаты
// events.on('order:open', () => {
//   // const {paymend, address} = orderData.validateOrder();
//   // // const address = orderData.validateOrder();
//   // orderPay.valid = !paymend && !address;
//   // const errorAddress = orderData.formErrors.address
//   // const errorPaymend = orderData.formErrors.paymend
//   // // orderPay.errors = Object.values({paymend, address}).filter(i => !!i).join('; ');
//   // // orderPay.errors = [errorAddress, errorPaymend].filter(i => !!i).join('; ');
//   // const q = Object.values({errorAddress, errorPaymend}).filter(i => !!i)
//   // console.log('q: ', q);
//   modal.render({
//     content: orderPay.render({
//       address: "",
//       paymend: "",
//       valid: false,
//       errors: q,
//   })
//   })
// });

// Оформление заказа
const orderData = new OrderData(events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events, { onClick: () => events.emit('order:total') });




events.on('order:changed', (errors: Partial<IOrderDataAll>) => {
  const {paymend, address} = errors;
  console.log('paymend: ', errors);

  orderPay.valid = !paymend && !address;
  console.log('orderPay.valid: ', orderPay.valid);
  orderPay.errors = Object.values({paymend, address}).filter(i => !!i).join(' и ');


});


// Изменился метод оплаты
events.on('paymend:change', ({ value }: { value: string }) => {
  orderData.updatePaymentMethod(value);
});

// Изменилось поле
events.on(/^order\..*:change/, (data: { field: keyof IOrderDataAll, value: string }) => {
  orderData.setOrderFirst(data.field, data.value);

  // Сборка заказа
  const all = {
    payment: orderData.order.paymend, // Изменил 'paymend' на 'payment'
    address: orderData.order.address, // Исправил 'adress' на 'address'
    total: basketData.total,
    items: basketData.cards
  };
  console.log('all: ', all);
});



// Открыть модальное окно оплаты
events.on('order:open', () => {
  // const errorAddress = orderData.formErrors.address
  // console.log('errorAddress: ', errorAddress);
  //   const errorPaymend = orderData.formErrors
  //   console.log('errorPaymend: ', errorPaymend);
  // const q = Object.values({errorAddress, errorPaymend}).filter(i => !!i)
  // console.log('q: ', q);
  modal.render({
    content: orderPay.render({
      paymend: '',
      adress: '',
      valid: false,
      errors: []
    }),
  })
  console.log('!!!!!!!!!!!!', orderData);
});
 

function errorsOrder(orderValue: {}){
  Object.values(orderValue).filter(i => !!i).join(' и ');
} 









// events.on('order:contacts', () => {

//   modal.render({
//     content: contacts.render({
//       email: '',
//       telephone: '',
//       valid: false,
//       errors: ["Необходимо указать email и Необходимо указать телефон"]
//     }),
//   })
// });