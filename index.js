import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-prjct-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messageListInDB = ref(database, "messages");

const inputFieldEL = document.getElementById("input-field");
const publishBtnEL = document.getElementById("publish-btn");
const messageListEL = document.getElementById("messages");
const fromInputFieldEL = document.getElementById("from-input");
const toInputFieldEL = document.getElementById("to-input");

const itemStates = {};

publishBtnEL.addEventListener("click", function () {
  let inputValue = inputFieldEL.value;
  let fromInputValue = fromInputFieldEL.value;
  let toInputValue = toInputFieldEL.value;

  inputValue &&
    push(messageListInDB, {
      from: fromInputValue,
      to: toInputValue,
      message: inputValue,
      likes: 0,
    });
  console.log(inputValue);
  clearInputFieldEl();
});

onValue(messageListInDB, function (snapshot) {
  if (snapshot.exists) {
    let itemsArray = Object.entries(snapshot.val());
    itemsArray = itemsArray.reverse();
    console.log(itemsArray);

    clearMessageListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToMessageListEl(currentItem);
    }
  } else {
    messageListEL.innerHTML = "No messages here... yet";
  }
});

function clearInputFieldEl() {
  inputFieldEL.value = "";
  fromInputFieldEL.value = "";
  toInputFieldEL.value = "";
}

function clearMessageListEl() {
  messageListEL.innerHTML = "";
}

function appendItemToMessageListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  if (!itemStates[itemID]) {
    let likes = JSON.parse(localStorage.getItem(itemID)) || 0;
    itemStates.itemID = {
      isLiked: false,
      itemID,
      likes,
    };
  }

  let itemState = itemStates.itemID;
  console.log(itemState);

  let newEl = document.createElement("div");
  newEl.classList.add("message-container");

  newEl.innerHTML = `
	<p class="message-to">To ${itemValue.to}</p>
	<p class="message-item">${itemValue.message}</p>
	<div class="message-from">
	<p>From ${itemValue.from}</p>
	<div>
	<i class="fa-regular fa-heart" id="heart-icon"></i>
	<span>${itemState.likes}</span>
	</div>
	</div>
`;

  let likeEl = newEl.querySelector("span");
  newEl.addEventListener("click", function (event) {
    if (event.target.tagName === "I") {
      event.target.classList.toggle("fa-solid");
      itemState.isLiked = !itemState.isLiked;

      if (itemState.isLiked) {
        itemState.likes++;
      } else {
        itemState.likes--;
      }

      localStorage.setItem(itemState.itemID, JSON.stringify(itemState.likes));

      likeEl.textContent = itemState.likes;
    }
  });

  messageListEL.append(newEl);
}
