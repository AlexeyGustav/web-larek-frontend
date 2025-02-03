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


import { mokData } from "./tempMokData";


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
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



const modal = new Modal(modalContainer, events);
const modalCardPreview = new ModalCardPreview(cloneTemplate(cardPreviewTemplate), events); 

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
  const modalCardPreview = new ModalCardPreview(cloneTemplate(cardPreviewTemplate), events, { onClick: () => events.emit('modalCard:changed', item) });

  modal.render({
    content: modalCardPreview.render(
      item
    )
  });

  modalCardPreview.getDisabled(item)

});

events.on('modalCard:changed', (item: ICard) => {
  const selectCard = cardData.getCard(item.id);
  const cardBasket = basketData.contains(item.id)

  if (!cardBasket) {
    basketData.addCard(selectCard)
    modalCardPreview.replaceTextBtn(false);
    console.log("00000", basketData);
  } 

  modal.render({
    content: modalCardPreview.render(
      item
    )
  });

});



// events.on('modalCard:changed', (cards: { cardId: string }) => {
//   const basketCard = basketData.contains(cards.cardId);
//   const card = new Card(cloneTemplate(cardCatalogTemplate), events,);
//   const selectCard = cardData.getCard(cards.cardId);
//   cardData.setSelected(selectCard.id);
//   console.log('cardBasket!!!!!!!!!!: ', cards);











// basketData.addCard(mokData[0])
// basketData.addCard(mokData[1])
// basketData.addCard(mokData[3])
// console.log('getIdBasketList: ', basketData.getIdBasketList());


const basketCard = new ModalCardBasket(cloneTemplate(cardBasketTemplate), events)


// Корзина
// Изменения в корзине
events.on('basket:changed', () => {
  // const itemsContent = basketData.getIdBasketList().map((card, index) => {
  //   console.log(`Rendering card ${index}:`, card);
  //   return basketCard.render(card); // Передаем индекс карточки
  // });
  // basketView.items = itemsContent
  // console.log("Items Content:", itemsContent);

  // modal.render({
  //   content: basketView.render({
  //     items: itemsContent,
  //     totalPrice: basketData.getTotal()
  //   })
  // });

  // console.log(basketView.render({
  //   items: itemsContent,
  //   totalPrice: basketData.getTotal()
  // }));

})



events.on('basket:open', () => {
  modal.render({
    content: basketView.render()
  })
});














events.on('delete:card', (id: { card: string }) => {
  // basketData.deleteCard(id.card)
  // console.log('basketData: ', basketData);
  // console.log("DELETE", basketData.getIdBasketList());


});




// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});