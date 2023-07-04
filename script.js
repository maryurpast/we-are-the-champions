import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  databaseURL:
    "https://champions-prjct-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messageListInDB = ref(database, "messages");

const inputFieldEL = document.getElementById("input-field");
const publishBtnEL = document.getElementById("publish-btn");
const messageListEL = document.getAnimations("messages");

publishBtnEL.addEventListener("click", function () {
  let inputValue = inputFieldEL.value;

  inputValue && push(messageListInDB, inputValue);
  console.log(inputValue);
  clearInputFieldEl();
});

function clearInputFieldEl() {
  textareaFieldEL.value = "";
}
