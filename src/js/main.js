const valid = require("card-validator");
const {v4: uuid} = require('uuid');

const cardForm = document.querySelector('.card-form');
const cardInput = document.querySelector('.card-input');
const cardInputValue = document.querySelector('.card-input-comment');
const cardItemsList = document.querySelector('.card-items');
const modal = document.querySelector('.modal');
const body = document.querySelector('body');
const error = document.querySelector('.error');

let cardsList = [];

const maskInputCardNumber = (event) => {
  if (!cardInput.value.replace(/[^\d]/g, '')) {
    cardInput.value = '';
  }
  if (event.keyCode !== 8) {
    if (cardInput.value.length === 4 || cardInput.value.length === 9 || cardInput.value.length === 14) {
      cardInput.value = cardInput.value += '-';
    }
  }
};
const cleanError = () => {
  error.innerHTML = ""
}

const addNewCard = (event) => {
  event.preventDefault();
  if (cardInput.value.length <= 19 && cardInputValue.value.length <= 1024) {
    const numberValidation = valid.number(cardInput.value);
    if (numberValidation.card !== null) {
      const cardType = numberValidation.card.type
      const cardNumber = cardInput.value;
      const cardComment = cardInputValue.value;
      addCard({cardNumber, cardComment, cardType});
    } else {
      error.innerHTML = "your card is not a visa or mastercard card"
    }
  }
}

const addCard = ({cardNumber, cardComment, cardType}) => {
  const regEx = /^[0-9]/
  if (cardNumber.match(regEx) && cardType === "visa" || cardType === "mastercard") {
    const card = {
      id: uuid(),
      cardNumber,
      cardComment,
      cardType,
    };
    cardsList.push(card);
    addToLocalStorage(cardsList);
    cardInput.value = '';
    cardInputValue.value = '';
  }

}

const renderCards = () => {
  cardItemsList.innerHTML = '';

  cardsList.forEach((card) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('id', card.id);
    li.innerHTML =
      `<p>Card number - ${card.cardNumber}</p>
       <p class="card_comment">Comment - ${card.cardComment}</p>
       <p>Card type - ${card.cardType} </p>
       <button class="delete-button">X</button>`;
    cardItemsList.append(li);
  });
}

const addToLocalStorage = () => {
  localStorage.setItem('cards', JSON.stringify(cardsList));
  renderCards(cardsList);
}

const getFromLocalStorage = () => {
  const reference = localStorage.getItem('cards');
  if (reference) {
    cardsList = JSON.parse(reference);
    renderCards(cardsList);
  }
}

const deleteCard = (id) => {
  cardsList = cardsList.filter((card) => card.id !== id);
  addToLocalStorage(cardsList);
}

getFromLocalStorage();

const confirmationDeleteCard = (event) => {
  modal.classList.add('active')
  body.classList.add('scroll-hidden')
  const id = event.target.parentElement.getAttribute('id')
  modal.addEventListener("click", (event) => {
    if (event.target.className === "confirmation_delete_btn") {
      deleteCard(id)
      modal.classList.remove('active');
      body.classList.remove('scroll-hidden')
    } else {
      modal.classList.remove('active');
      body.classList.remove('scroll-hidden')
    }
  })
}

cardInput.addEventListener('keydown', maskInputCardNumber);
cardInput.addEventListener("focus", cleanError)
cardForm.addEventListener('submit', addNewCard);
cardItemsList.addEventListener('click', confirmationDeleteCard);








