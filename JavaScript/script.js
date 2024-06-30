"use strict";

//Global Variables
const card = document.querySelectorAll(".card");
const cards = document.querySelector(".cards");
const overlay = document.querySelector(".overlay");
const header = document.querySelector(".header");
const btn1 = document.querySelector(".btn-1");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav__links");

//Functions
const overlayAdd = function (e) {
  if (!e.target.classList.contains("place")) return;
  const image = e.target;
  const textContainer = e.target.closest("div").children[1];
  textContainer.classList.add("overlay");
  image.style.filter = "blur(4px)";
};

const focus = function (e) {
  if (!e.target.classList.contains("nav__link")) return;
  const link = e.target;
  link.style.color = "#333";
};

//////////////////////////////////////////////////////////////
cards.addEventListener("mouseover", overlayAdd);
btn1.addEventListener("click", function () {
  section1.scrollIntoView({
    behavior: "smooth",
  });
});

nav.addEventListener("mouseover", (e) => (e.target.style.color = "#333"));
nav.addEventListener("mouseout", (e) => (e.target.style.color = "#fff"));
