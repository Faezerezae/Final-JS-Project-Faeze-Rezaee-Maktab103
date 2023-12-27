"use strict";
import axios from "axios";
import { errorHandler } from "../../libs/errorHandler";
import { fetchUserInfo } from "../../libs/userInfo";

const usernamePara = document.getElementById("tasksHeaderUsername");

async function main() {
  const user = await fetchUserInfo();
  if (!user) return;
  usernamePara.innerHTML = `<a href="/profile">${user.username}</a>`;
  checkTimee();
}

main();

const whatDate = document.querySelector("#whatDate");

function checkTimee() {
  //date
  const now = new Date();
  const currentHour = now.getHours();
  const pElement = document.createElement("p");

  if (currentHour >= 5 && currentHour < 12) {
    pElement.textContent = "Good morning!🤚";
    whatDate.appendChild(pElement);
  } else if (currentHour >= 12 && currentHour < 18) {
    pElement.textContent = "Good afternoon!🤚";
    whatDate.appendChild(pElement);
  } else if (currentHour >= 18 || currentHour < 23) {
    pElement.textContent = "Good evening!🤚";
    whatDate.appendChild(pElement);
  }
}

//active buttun
const button_container = document.querySelectorAll(".brands-button button");
let tag = "All";
button_container.forEach((buttonEvent) => {
  buttonEvent.addEventListener("click", change);
});
function change() {
  button_container.forEach((tag) => (tag.classList = ""));
  this.classList.add("my-active");
  tag = this.innerHTML;
}

//nav popular
const mostAllpopular = document.querySelector("#all");
const nikePopular = document.querySelector("#nike");
const adidasPopular = document.querySelector("#adidas");
const pumaPopular = document.querySelector("#puma");
const asicsPopular = document.querySelector("#asics");
const reebokPopular = document.querySelector("#reebok");
const newbaBtnPopular = document.querySelector("#newba");
const conversBtnPopular = document.querySelector("#convers");
const hushpuppiesBtnPopular = document.querySelector("#hushpuppies");
const productList = document.querySelector(".product-list");
const pageNumber = document.getElementById("pagination-buttons");
const searchData = document.querySelector("#searchData");

let sneaker = [];
let totalSneaker = 0;

//get AllSneaker ------------------------------------------------------------------------

// document.addEventListener("DOMContentLoaded", () => {
//   fetchByBrand("")();
// });

//--------------------------------------------------------Brands

async function fetchDataAndRenderBrands(page = 1, brand = "") {
  const token = window.sessionStorage.getItem("token");
  const url = `http://localhost:3000/sneaker?page=${page}&limit=10&brands=${brand}`;

  try {
    const response = await axios({
      method: "get",
      url,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    totalSneaker = response.data.total;
    sneaker = response.data.data;
    paginationButton(response.data.totalPages, brand);
    listRenderer(sneaker);
  } catch (error) {
    errorHandler(error);
  }
}
//----------------------------------------------paginationButton
function paginationButton(total, brand) {
  console.log(total);
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

      fetchDataAndRenderBrands(j, brand);
    });
    pageNumber.append(btn);
  }
}

function fetchByBrands(brand) {
  return async function (page = 1) {
    await fetchDataAndRenderBrands(page, brand);
  };
}

mostAllpopular.addEventListener("click", () => {
  fetchByBrands("")();
  scroll=false;
});

nikePopular.addEventListener("click", () => {
  fetchByBrands("NIKE")();
  scroll=false;
});

adidasPopular.addEventListener("click", () => {
  fetchByBrands("ADIDAS")();
  scroll=false;
});

pumaPopular.addEventListener("click", () => {
  fetchByBrands("PUMA")();
  scroll=false;
});

hushpuppiesBtnPopular.addEventListener("click", () => {
  fetchByBrands("HUSHPUPPIES")();
  scroll=false;
});

asicsPopular.addEventListener("click", () => {
  fetchByBrands("ASICS")();
  scroll=false;
});

reebokPopular.addEventListener("click", () => {
  fetchByBrands("REEBOK")();
  scroll=false;
});

newbaBtnPopular.addEventListener("click", () => {
  fetchByBrands("NEW BALANCE")();
  scroll=false;
});

conversBtnPopular.addEventListener("click", () => {
  fetchByBrands("CONVERSE")();
  scroll=false;
});

//------------------------------------- Infinite Scroll
let page = 1;
let loading = false;
let scroll = true;

document.addEventListener("DOMContentLoaded", () => {
  fetchByBrand("")();
});

productList.addEventListener("scrollend", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (!scroll) return;
  if (scrollTop + clientHeight >= scrollHeight && !loading) {
    page++;
    fetchDataAndRender(page);
  }
});

async function fetchDataAndRender(page = 1, brand = "") {
  const token = window.sessionStorage.getItem("token");
  const url = `http://localhost:3000/sneaker?page=${page}&limit=10&brands=${brand}`;
  try {
    loading = true;
    const response = await axios({
      method: "get",
      url,
      headers: { Authorization: `Bearer ${token}` },
    });
    totalSneaker = response.data.total;
    sneaker = [...response.data.data];
    listRenderer(sneaker);
    loading = false;
  } catch (error) {
    errorHandler(error);
    loading = false;
  }
}
function fetchByBrand(brand) {
  return async function (page = 1) {
    await fetchDataAndRender(page, brand);
  };
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
    `;
}

function listRenderer(sneaker) {
  console.log(sneaker); // افزودن این خط
  let html = "";
  for (const product of sneaker) {
    html += Card(product.id, product.imageURL, product.name, product.price);
  }
  productList.innerHTML = html;
}

//------------------------------------------go to page sneakers
productList.addEventListener("click", eventHandler);

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

//------------------------------------------------------------search
searchData.addEventListener("click", () => {
  location.assign("./search");
});
