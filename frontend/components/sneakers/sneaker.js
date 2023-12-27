"use strict";
import axios from "axios";
import { errorHandler } from "../../libs/errorHandler";

const root = document.getElementById("root");
const urlParams = new URLSearchParams(window.location.search);
const sneakerId = urlParams.get("id");
console.log(urlParams);
//--------------------------------------------------------------get time
function updateTime() {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  let ampm = hours >= 12 ? "PM" : "AM";

  let formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  let formattedTime = formattedHours + ":" + minutes;

  document.getElementById("time").innerHTML = formattedTime;
  currentTime.setSeconds(currentTime.getSeconds() + 1);

  if (currentTime.getSeconds() === 0) {
    currentTime.setMinutes(currentTime.getMinutes() + 1);

    if (currentTime.getMinutes() === 0) {
      currentTime.setHours(currentTime.getHours() + 1);
    }
  }
}

setInterval(updateTime, 1000);
updateTime();

//----------------------------------------getSingleSneaker
export async function getSingleSneaker(id) {
  const token = window.sessionStorage.getItem("token");
  console.log(token);

  try {
    const response = await axios({
      method: "get",
      url: `http://localhost:3000/sneaker/item/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);

    render(response.data);
  } catch (error) {
    errorHandler(error);
  }
}

getSingleSneaker(sneakerId);

function sneakerInformation(sneaker) {
  const sizes = sneaker.sizes.split("|");
  const colors = sneaker.colors.split("|");

  const colorTag = colors
    .map((color) => {
      return `
    <div class="rounded-full border border-gray-200 h-8 w-8 flex justify-center items-center cursor-pointer" style="background-color:${color};"></div>`;
    })
    .join("");

  const sizeTag = sizes
    .map((size) => {
      return `
    <p class="rounded-full h-8 w-8 border border-black flex justify-center items-center cursor-pointer active:bg-black active:text-white" id"active-bottun" >${size}</p>`;
    })
    .join("");

  return `
  <div class="w-full">
  <img src="${sneaker.imageURL}" class="w-full" alt="..." />
  <div class="p-4 grid gap-4">
    <div class="flex justify-between items-start font-semibold text-xl">
      <h1 class="">${sneaker.name}</h1>
      <i class="bi bi-heart hover:text-red-700 cursor-pointer"></i>
    </div>

    <div class="flex gap-10 justify-start items-center">
      <div
        class="bg-gray-200 flex gap-2 justify-center items-center rounded-lg p-1"
      >
        <span id="sold">5.371</span>
        <p>sold</p>
      </div>
      <div class="flex gap-1">
        <span><i class="bi bi-star-half"></i></span>
        <p id="rate">4.3</p>
        <p>(5.389 reviews)</p>
      </div>
    </div>
    <div>
      <h2 class="font-semibold text-base">Decription</h2>
      <p id="dic" class="text-[13px]">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. sed do eiusmod
        tempor incididunt ut labore et
        <span class="font-semibold">view more...</span>
      </p>
    </div>

    <div class="flex justify-start gap-16">
      <div class="grid gap-2">
        <p class="font-semibold">Size</p>
        <div class="flex gap-2">${sizeTag}</div>
      </div>
      <div class="grid gap-2">
        <p class="font-semibold">Color</p>
        <div class="flex gap-2">${colorTag}</div>
      </div>
    </div>
    <div class="flex gap-6 font-semibold justify-start items-center">
      <p>Quantity</p>
      <div
        class="bg-gray-200 rounded-full px-4 py-2 flex justify-center items-center gap-5"
      >
        <button class="btn" id="low-off"> - </button>
        <span id="qua">1</span>
        <button class="btn" id="Increase">+</button>
      </div>
    </div>

    <hr />
    <div class="flex justify-between items-center">
      <div class="grid gap-1">
        <p class="text-gray-500">Total price</p>
        <div class="flex font-semibold">
          <i class="bi bi-currency-dollar"></i>
          <span id="total">${sneaker.price}</span>.00
        </div>
      </div>
      <button
        id="subtoCart"
        class="rounded-full flex justify-center items-center text-white gap-2 bg-black py-4 px-16"
      >
        <i class="bi bi-bag-fill"></i>add to cart
      </button>
    </div>
  </div>
</div>
  `;
}

function render(sneaker) {
  root.innerHTML = sneakerInformation(sneaker);
}


const activeButton=document.getElementById("active-bottun").addEventListener("click",()=>{
  activeButton.classList.add("my-active")
})