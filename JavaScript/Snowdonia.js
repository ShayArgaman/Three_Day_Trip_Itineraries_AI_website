const tripDescription = document.querySelector(".text-handling");
const upLeftside = document.querySelector(".up");
const downLeftside = document.querySelector(".down");
const tripChoose = document.querySelector(".form__input--type1");
const placeChoose = document.querySelector(".form__input--type2");
const startingPoint = ["Lake District"];
const descriptionArray = [
  "The Lake District, also known as the Lakes, is a mountainous region in North West England. It is famous for its lakes, forests, and mountains, making it a popular destination for hiking, climbing, and outdoor activities.",
  "Conwy is a walled market town and community in Conwy County Borough on the north coast of Wales. It is a UNESCO World Heritage Site and is known for its medieval castle and town walls.",
];
const endPoint = ["Lake District", "Conwy"];
const tripTypes = ["Car", "Walk", "Cycling", "noType"];
const trip1_car = [
  [53.11848, -3.92957], // Lake District
  [53.28181, -3.82629], // Conwy
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

//Set the map to view Snowdonia
function loadMap(track) {
  map = L.map("map").setView(trip1_car[0], 10);
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
function getTrack(event) {
  if (trackPolyline !== 0) map.removeLayer(trackPolyline);

  if (tripChoose.value === "Option" || placeChoose.value === "Option") {
    return;
  }

  let place = placeChoose.value;
  let count;

  place === "Lake District" ? (count = 0) : (count = 1);

  //Setting up image for the trip choice
  count === 0
    ? (image.src = "https://via.placeholder.com/300/009688/FFFFFF?text=Lake+District")
    : (image.src = "/img/jordin public.jpg");

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
    tripDescription.innerHTML = descriptionArray[1];
  } else if (value == endPoint[0]) {
    tripDescription.innerHTML = descriptionArray[0];
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

  // // Bind the updated popup to the marker
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
