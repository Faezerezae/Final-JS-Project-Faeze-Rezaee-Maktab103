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
//---------------------------------------------------
const button_container = document.querySelector(".brands-button");
const productList = document.querySelector(".product-list");
const pageNumber = document.getElementById("pagination-buttons");
const searchData = document.querySelector("#searchData");
let sneaker = [];
let sneakers = [];
let list = [];
let totalSneaker = 0;

//---------------------------------------------function render
function renderBrands(list) {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  button_container.innerHTML = "";
  const brandDivAll = document.createElement("div");
  brandDivAll.classList.add(
    "rounded-3xl",
    "border-solid",
    "border-black",
    "border-2",
    "self-center",
    "p-2",
    "w-auto",
    "px-6",
    "cursor-pointer"
  );
  brandDivAll.textContent = "All";
  brandDivAll.addEventListener("click", () => {
    allBrand();
    brandDivAll.classList.add("my-active");
    const previouslymyActive = document.querySelectorAll(".my-active");
    if (previouslymyActive) {
      previouslymyActive.forEach((item) => {
        console.log(item.textContent);
        if (item.textContent == "All") return;
        item.classList.remove("my-active");
      });
    }
  });
  button_container.appendChild(brandDivAll);

  list.forEach((item) => {
    const brandDiv = document.createElement("div");
    brandDiv.classList.add(
      "rounded-3xl",
      "border",
      "whitespace-nowrap",
      "self-center",
      "border-solid",
      "border-black",
      "border-2",
      "p-2",
      "w-auto",
      "px-6",
      "cursor-pointer"
    );
    brandDiv.textContent = capitalizeFirstLetter(item);
    brandDiv.addEventListener("click", () => {
      const previouslymyActive = document.querySelectorAll(".my-active");
      brandDivAll.classList.remove("my-active");

      if (previouslymyActive) {
        previouslymyActive.forEach((item) =>
          item.classList.remove("my-active")
        );
      }
      brandDiv.classList.add("my-active");

      getProductsByBrand(item);
      scroll = false;
    });
    button_container.appendChild(brandDiv);
  });
}
//---------------------------------------------getProductsByBrand
async function getProductsByBrand(brand, page = 1) {
  console.log("Brand:", brand);
  console.log("Page:", page);
  try {
    const token = window.sessionStorage.getItem("token");
    const response = await axios({
      method: "get",
      url: `http://localhost:3000/sneaker?page=${page}&limit=10&brands=${brand}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    sneakers = [...response.data.data];
    console.log(sneakers);
    listRenderer(sneakers);
    paginationButton(response.data.totalPages, brand);
  } catch (error) {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
    }
  }
}
//-----------------------------------------getAllNameBrands
async function getAllNameBrands() {
  const token = window.sessionStorage.getItem("token");
  try {
    const response = await axios({
      method: "get",
      url: "http://localhost:3000/sneaker/brands",
      headers: { Authorization: ` Bearer ${token}` },
    });
    list = response.data;
    console.log(list);
    renderBrands(list);
  } catch (error) {
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
    }
  }
}

getAllNameBrands();

//--------------------------------------------------------allBrands

async function allBrand(page = 1, brand = "") {
  const token = window.sessionStorage.getItem("token");
  const url = `http://localhost:3000/sneaker?page=${page}&limit=10`;

  try {
    const response = await axios({
      method: "get",
      url,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    totalSneaker = response.data.total;
    sneaker = [...response.data.data];
    listRenderer(sneaker);
    paginationButton(response.data.totalPages, brand);
  } catch (error) {
    errorHandler(error);
  }
}
allBrand();

//----------------------------------------------paginationButton
function paginationButton(total, brand) {
  console.log(total);
  pageNumber.innerHTML = "";
  for (let j = 1; j <= total; j++) {
    const btn = document.createElement("button");
    btn.className =
      "inline-flex items-center border-t-2 border-gray-500 px-4 pt-2 text-sm font-medium text-gray-600";

    btn.textContent = j;
    btn.addEventListener("click", (e) => {
      const clickedBtn = e.target;
      console.log(clickedBtn);
      clickedBtn.classList.add("bg-indigo-500");

      getProductsByBrand(brand, j);
    });
    pageNumber.append(btn);
  }
}

//------------------------------------- Infinite Scroll
let page = 1;
let loading = false;
let scroll = true;
productList.addEventListener("scrollend", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (!scroll) return;
  if (scrollTop + clientHeight >= scrollHeight && !loading) {
    page++;
    allBrand(page);
  }
});
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
