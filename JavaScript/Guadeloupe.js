// const initiateImageGeneration = require("./db.js");
// // console.log(initiateImageGeneration);
// // initiateImageGeneration();
const tripDescription = document.querySelector(".text-handling");
const upLeftside = document.querySelector(".up");
const downLeftside = document.querySelector(".down");
const tripChoose = document.querySelector(".form__input--type1");
const placeChoose = document.querySelector(".form__input--type2");
const startingPoint = ["Viard"];
const descriptionArray = [
  "Jordin Public is a dynamic district nestled within the vibrant landscape of Guadeloupe, an overseas region of France located in the Caribbean. This bustling area pulsates with energy, offering a blend of cultural richness and modern amenities.",
  "Viard is a charming commune located in the region of Guadeloupe, an overseas department and region of France in the Caribbean. Nestled between lush greenery and azure waters.",
];
const endPoint = ["Jordin Public Park", "Viard City"];
const tripTypes = ["Car", "Walk", "Cycling", "noType"];
const trip1_car = [
  [16.31721, -61.68478], // Viard
  [16.3321, -61.69606], // Jordin Public
];
let getCoord;
let markerArray = [];
let control = 0;
let trackPolyline = 0;
var map;
var marker;
let lat;
let lng;

//-------Helper functionality------------
const imagePlace = document.querySelector(".up");
const image = document.createElement("img");
image.width = 250;
image.height = 250;
imagePlace.appendChild(image);
//--------------------------------------

//--------------Functions-------------------

//Set the map to view Guadeloupe
function loadMap(track) {
  map = L.map("map").setView(trip1_car[0], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

//Putting trip Marker (Finish trip places)
function tripMarker(coords, type, place, isStart) {
  marker = L.marker(coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 300,
        minWidth: 50,
        autoClose: false,
        closeOnClick: false,
        className: `${type}-popup`,
      })
    )
    .setPopupContent(
      `${isStart ? "" : "Finish,"}  ${place}${
        type === "noType" ? "" : `, ${type} TRIP!`
      } `
    )
    .openPopup();

  markerArray.push(marker);
}

//Setting up cords for the start position
function getCoords(event) {
  if (markerArray.length > 2) map.removeLayer(markerArray[2]);
  markerArray[2] = markerArray[3];
  markerArray.length = 2;

  lat = event.latlng.lat;
  lng = event.latlng.lng;
  getCoord = [lat, lng];

  tripMarker(getCoord, tripTypes[3], "Your Position", true);

  getTrack(event);
}

//Handling visual look of the trip
async function getTrack(event) {
  if (trackPolyline !== 0) map.removeLayer(trackPolyline);

  if (tripChoose.value === "Option" || placeChoose.value === "Option") {
    return;
  }

  let place = placeChoose.value;
  let count;

  place === "Viard City" ? (count = 0) : (count = 1);

  count === 0
    ? (image.src = "/img/loading2.png")
    : (image.src = "/img/loading2.png");

  imagePlace.appendChild(image);
  upLeftside.classList.remove("opc");

  //Setting trip walk and cycling variable - not doing anything yet.
  trackPolyline = L.polyline([getCoord, trip1_car[count]], {
    color: "blue",
    dashArray: "5, 10",
  });

  if (tripChoose.value === "Car") {
    loadTrack(getCoord, trip1_car[count]);
  } else {
    //Add trip dashed line.
    if (control !== 0) control.spliceWaypoints(0, 1, control.latlng);
    trackPolyline.addTo(map);
  }

  updatePopup(count);

  placeText(endPoint[count]);

  console.log("heeeeerrrreeeeee =======> ");

  try {
    const response = await fetch("http://localhost:8080/img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ finishLine: placeChoose.value }),
    });

    if (!response.ok) {
      return;
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    image.src = imageUrl;
  } catch (error) {
    console.error("Error fetching and displaying image:", error);
  }
}

//--------------Add event listeners-------------------
tripChoose.addEventListener("change", (e) => {
  getTrack(e);
});

placeChoose.addEventListener("change", (e) => {
  getTrack(e);
});

//-----------------Helper Functions---------------------

//Loading car trip
function loadTrack(cord1, cord2) {
  if (control !== 0) control.spliceWaypoints(0, 1, control.latlng);
  control = L.Routing.control({
    waypoints: [L.latLng(cord1), L.latLng(cord2)],
  }).addTo(map);
}

//Place Description
function placeText(value) {
  if (value == endPoint[1]) {
    tripDescription.innerHTML = descriptionArray[0];
  } else if (value == endPoint[0]) {
    tripDescription.innerHTML = descriptionArray[1];
  } else return;
}

//Update finish trips popup
function updatePopup(count) {
  const popup = markerArray[count].getPopup();

  markerArray[count].closePopup();

  const updatedPopup = L.popup({
    maxWidth: 300,
    minWidth: 50,
    autoClose: false,
    closeOnClick: false,
    className: `${tripChoose.value}-popup`,
  }).setContent(
    `Finish, ${placeChoose.value}${
      tripChoose.value === "noType" ? "" : `, ${tripChoose.value} TRIP!`
    }`
  );

  //Bind the updated popup to the marker
  markerArray[count].bindPopup(updatedPopup).openPopup();

  count === 0 ? markerArray[1].closePopup() : markerArray[0].closePopup();
}

//----------------Main--------------
loadMap(trip1_car);
tripMarker(trip1_car[0], tripTypes[3], endPoint[1], false);
tripMarker(trip1_car[1], tripTypes[3], endPoint[0], false);

map.on("click", (event) => {
  downLeftside.classList.remove("opc");

  getCoords(event);
});
