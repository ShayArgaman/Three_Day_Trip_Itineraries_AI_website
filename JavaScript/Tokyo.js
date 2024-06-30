const tripDescription = document.querySelector(".text-handling");
const upLeftside = document.querySelector(".up");
const downLeftside = document.querySelector(".down");
const tripChoose = document.querySelector(".form__input--type1");
const placeChoose = document.querySelector(".form__input--type2");
const startingPoint = ["Tokyo Tower"];
const descriptionArray = [
  "Shibuya Crossing is one of Tokyo's most famous and busiest intersections. It's located in the Shibuya district, known for its vibrant atmosphere, shopping, and nightlife.",
  "Tokyo Tower is an iconic landmark in Tokyo, offering panoramic views of the city from its observation decks. It's a symbol of Japan's post-war rebirth as a major economic power.",
];
const endPoint = ["Shibuya Crossing", "Tokyo Tower"];
const tripTypes = ["Car", "Walk", "Cycling", "noType"];
const trip1_car = [
  [35.661777, 139.704051], // Tokyo Tower
  [35.659504, 139.700636], // Shibuya Crossing
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
image.width = 448;
image.height = 320;
imagePlace.appendChild(image);
//--------------------------------------

//--------------Functions-------------------
//Set the map to view Tokyo
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

//Putting trip Marker (Finish trip places)
function getTrack(event) {
  if (trackPolyline !== 0) map.removeLayer(trackPolyline);

  if (tripChoose.value === "Option" || placeChoose.value === "Option") {
    return;
  }

  let place = placeChoose.value;
  let count;

  place === "Tokyo Tower" ? (count = 0) : (count = 1);

//Setting up image for the trip choice
  count === 0
    ? (image.src = "/img/Kruger National Park.jpg")
    : (image.src = "/img/tokyo.jpg");

   imagePlace.appendChild(image);
   upLeftside.classList.remove("opc");

  trackPolyline = L.polyline([getCoord, trip1_car[count]], {
    color: "blue",
    dashArray: "5, 10",
  });

  if (tripChoose.value === "Car") {
    loadTrack(getCoord, trip1_car[count]);
  } else {
    if (control !== 0) control.spliceWaypoints(0, 1, control.latlng);
    trackPolyline.addTo(map);
  }

  updatePopup(count);

  placeText(endPoint[count]);
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
