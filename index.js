// Import stylesheets
import "./style.css";
const aeiPosition = [50.288723351251576, 18.678006485185346];
const aeiBuildingPosition = [50.288566, 18.677461];
const initialZoom = 500;

const appDiv = document.getElementById("app");
appDiv.innerHTML = `<h1>JS Starter</h1>`;

var mymap = L.map("mapid").setView(aeiBuildingPosition, initialZoom);
var searchButton = document.getElementById("searchButton");
var searchInput = document.getElementById("searchInput");

var httpClient = function() {
  this.get = function(aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    };

    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send(null);
  };
};

var client = new httpClient();

var circle = L.circle(aeiPosition, {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 20
}).addTo(mymap);

var polygon = L.polygon([
  [50.288682, 18.676414],
  [50.287692, 18.677064],
  [50.288524, 18.678313],
  [50.289049, 18.677225]
]).addTo(mymap);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1
  }
).addTo(mymap);

L.marker(aeiBuildingPosition).addTo(mymap);

mymap.on("click", onMapClick);
searchButton.onclick = onSearchClicked;

function onMapClick(e) {
  L.marker(e.latlng)
    .on("click", onMarkerClicked)
    .addTo(mymap);
}

function onMarkerClicked(e) {
  mymap.removeLayer(this);
}

function onSearchClicked() {
  client.get(
    "https://api.openaq.org/v1/measurements?city=" + searchInput.value,
    function(response) {
      var parsedResponseFirstResult = JSON.parse(response).results[0];
      var coordinates = new L.LatLng(
        parsedResponseFirstResult.coordinates.latitude,
        parsedResponseFirstResult.coordinates.longitude
      );
      mymap.panTo(coordinates);
      L.marker(coordinates)
        .bindPopup(
          "Zanieczyszczenie: " +
            parsedResponseFirstResult.value +
            parsedResponseFirstResult.unit
        )
        .addTo(mymap);
    }
  );
  return false;
}
