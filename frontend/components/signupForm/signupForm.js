"use strict";
import axios from "axios";
import { errorHandler } from "../../libs/errorHandler";

const form = document.getElementById("signupForm");
const errorAlert = document.getElementById("signupFormError");

const data = {};

form.addEventListener("input", function (ev) {
  console.log(ev.target.name , ev.target.value);
  data[ev.target.name] = ev.target.value;
  console.log(data);
  errorAlert.classList.add("hidden");
});

form.addEventListener("submit", async function (ev) {
  ev.preventDefault();
  // if (data.repeatPassword !== data.password) {
  //   errorAlert.classList.remove("hidden");
  //   return;
  // }
  // delete data["repeatPassword"];
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:3000/auth/signup",
      data,
    });
    window.sessionStorage.setItem("token", response.data.token);
    window.location.href = "/home";
  } catch (error) {
    const html = errorHandler(error);
    errorAlert.classList.remove("hidden");
    errorAlert.innerHTML = html;
  }
});


const showPasswordButton = document.querySelector("#show-password");

showPasswordButton.addEventListener("click",togglePasswordVisibility)

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }
