"use strict";
import axios from "axios";
import { errorHandler } from "../../libs/errorHandler";

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

//---------------------------------------------------
let sneaker = [];
let totalSneaker = 0;

const resultSearch = document.getElementById("result-search");
const searchInput = document.querySelector("#search-input");
const noValueSearch = document.querySelector("#no-value-search");
const pageNumber = document.getElementById("pagination-buttons");
const textValueInput = document.getElementById("text-value-input");
const totalResultFound = document.getElementById("total-result-found");

function checker(data) {
  if (data !== 0) {
    noValueSearch.classList.add("hidden");
    noValueSearch.classList.remove("flex");
  } else {
    noValueSearch.classList.remove("hidden");
    noValueSearch.classList.add("flex");
  }
}

searchInput.addEventListener("input", () => {
  textValueInput.innerText = searchInput.value;
  searchQueryBrands(1, encodeURIComponent(searchInput.value));
});

function searchQueryBrands(page = 1, search = "") {
  const token = window.sessionStorage.getItem("token");
  const url = `http://localhost:3000/sneaker?page=${page}&limit=10&search=${search}`;

  async function myDebounce() {
    try {
      const response = await axios({
        method: "get",
        url,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      checker(response.data.total);
      totalSneaker = response.data.total;
      totalResultFound.innerText = totalSneaker;
      sneaker = response.data.data;
      console.log(sneaker);
      paginationButton(response.data.totalPages, searchInput.value);
      listRenderer(sneaker);
    } catch (error) {
      errorHandler(error);
    }
  }
  const debounce = _.debounce(myDebounce, 4000);
  debounce();
}

//----------------------------------------------paginationButton
function paginationButton(total, search) {
  pageNumber.innerHTML = "";
  for (let j = 1; j <= total; j++) {
    const btn = document.createElement("button");
    btn.className =
      "inline-flex items-center border-t-2 border-gray-500 px-4 pt-2 text-sm font-medium text-gray-600";

    btn.textContent = j;
    btn.addEventListener("click", () => {
      document.querySelectorAll("button").forEach((button) => {
        button.classList.remove("bg-blue-500", "text-white");
      });

      btn.classList.add("bg-blue-500", "text-white");

      searchQueryBrands(j, search);
    });
    pageNumber.append(btn);
  }
}

//--------------------------------------------------------------card
function Card(id = "", imageURL = "", name = "", price = "") {
  return `
    <div
    id="productCard"
    class="bg-transparent p-1 w-[182px] h-[244px]"
    data-set="${id}"
  >
    <div class="flex items-center justify-center">
      <img
        id="productImage"
        class="w-40 h-40 rounded-2xl"
        src="${imageURL}"
      />
    </div>
    <div class="card-text-wrapper">
      <p id="productName" class="text-lg font-medium m-2 overflow-hidden truncate cursor-pointer hover:underline card-profile">${name}</p>
    </div>
    <p id="productPrice" class="text-gray-700 mx-2">$${price}</p>
  </div>
  </div>
      `;
}

function listRenderer(sneaker) {
  let html = "";
  for (const product of sneaker) {
    html += Card(product.id, product.imageURL, product.name, product.price);
  }
  resultSearch.innerHTML = html;
}

//------------------------------------------go to page sneakers
resultSearch.addEventListener("click", eventHandler);

function eventHandler(e) {
  if (e.target.classList.contains("card-profile")) {
    const idsneaker = e.target.parentElement.parentElement.dataset.set;
    console.log(idsneaker);
    onClickCard(idsneaker);
  }
}

function onClickCard(id) {
  const splittedPathname = window.location.pathname.split("/");
  window.location.href =
    splittedPathname.slice(0, splittedPathname.length - 1).join("/") +
    `/sneaker?id=${id}`;
}
