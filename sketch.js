var canvas;
var position;
var fence;
var distance;
var miaMappa;
var diameter = 20;
var inOut = true;

function preload(){
  // get the position of the user
  position = getCurrentPosition();
}

function setup() {

  // create the map center on the current position
  var mappa = new Mappa("Leaflet");
  var options = {
    lat: position.latitude,
    lng: position.longitude,
    zoom: 15,
    style:"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
  };

  //just to be sure it works
  console.log(position.latitude);
  console.log(position.longitude);

  //create canvas inside a div element so it goes under the texts elements in html
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.parent('#canvas');

  miaMappa = mappa.tileMap(options);
  miaMappa.overlay(canvas);

  // create a fence for Bovisa
  fence = new geoFenceCircle(45.5049002,9.1638123, 1, insideTheFence, outsideTheFence, 'km');

  //calculate distance current position - politecnico bovisa
  distance = Math.round(calcGeoDistance(position.latitude, position.longitude, 45.4992673, 9.1642641, "km"));
// right geofence distance check (inside bovisa)
// distance = calcGeoDistance(position.latitude, position.longitude, 45.4992673, 9.1642641, "km");
  console.log(distance);
}

function draw(){
  // create the point that indicates the current position
  clear();
  var point = miaMappa.latLngToPixel(position.latitude, position.longitude);
  push();
  fill('red');
  noStroke();
  ellipse(point.x,point.y, diameter);
    // the point grows in size and decreases
    if(diameter > 40){
      inOut = false;
    }
    if(diameter < 20){
      inOut = true;
    }
    if(inOut){
      diameter++
    }
    if(!inOut){
      diameter--
    }
  pop();

  //create the indication of the fence in bovisa
  push();
  var bovisa = miaMappa.latLngToPixel(45.5049002,9.1638123);
  noStroke();
  fill(255, 0, 0, 50);
  ellipse(bovisa.x, bovisa.y, 200);
  pop();
}

// callback functions that display a message if you are or not in the fence
// i'm sorry if your're in bovisa
function insideTheFence(position) {
    createElement("h1", "Oh no you're in Bovisa, i'm sorry :( ").parent('#text');

}

//if you're not in bovisa i tell you the distance between you and the polimi
function outsideTheFence(position){
    createElement("h1","Yay, you're not in Bovisa!").parent('#text');
    createElement("h2", "You are" + " " + distance + "km away from Bovisa" ).parent('#text');

}
