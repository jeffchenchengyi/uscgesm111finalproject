var imageScale = 0.2;
var miniImageScale = 0.02;
var spotNumber = 0;
var spotRadius = 3;
var c = 3;
var amp;
var start = 0;
var masksArray = [];
var brightSpotArray = [];
var streams = [];
var fadeInterval = 1.6;
var symbolSize = 14;
var title, description;
var descriptionText = "Remember, remember! <br> The fifth of November, <br> The Gunpowder treason and plot; <br> I know of no reason <br> Why the Gunpowder treason <br> Should ever be forgot! <br><br> Popularized by the 2005 dystopian political thriller adaptation of <a href='https://en.wikipedia.org/wiki/V_for_Vendetta_(film)' target='_blank'>V for Vendetta</a>, both the Guy Fawkes mask and the <a href='https://en.wikipedia.org/wiki/1812_Overture' target='_blank'>1812 overture</a> (composed by Pyotr Ilyich Tchaikovsky as a way to commerate Russia's victory in the <a href='https://en.wikipedia.org/wiki/French_invasion_of_Russia' target='_blank'>Patriotic War</a> of 1812 against the French.) have become popular symbols of anarchy and protest against tyranny. In the following animation, I've used the Guy Fawkes mask as a backdrop and the 1812 overture along with the <a href='https://en.wikipedia.org/wiki/Cyrillic_alphabets' target='_blank'>Cyrillic</a> rain in the background to support Plato's theory of Art in that music and art are incredibly powerful at chanelling ones' emotions. I believe that art shouldn't be censored to only display the Good as the Good is not always the Truth. <br><br> <a href='https://en.wikipedia.org/wiki/Phyllotaxis' target='_blank'>The Phyllotactic patterns</a> surrounding the Guy Fawkes mask serve to echo the truth that <b><i>Mathematics</i></b> is fundamentally intertwined with <b><i>Art</i></b>, just as how <b><i>Politics</i></b> is naturally interwoven with <b><i>Music</i></b>.";

function preload() {
    img = loadImage("GuyFawkesMask.png");
    song = loadSound("1812Overture.mp3");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight); 
  pixelDensity(1);

  //Image Setup
  img.loadPixels();
  imageMode(CENTER);
  var newImgWidth = windowWidth * miniImageScale;
  var newImgHeight = windowWidth * miniImageScale * img.height / img.width;
  for(var x = 0; x < windowWidth; x = x + newImgWidth) {
    for(var y = 0; y < windowHeight; y = y + newImgHeight) {
      image(img, x, y, newImgWidth, newImgHeight);
    }
  } 
  //image(img, windowWidth / 2, windowHeight / 2, newImgWidth, newImgHeight);
  /*
  console.log(newImgWidth);
  console.log(windowWidth);
  for(var x = 0; x < newImgWidth; x++) {
    for(var y = 0; y < newImgHeight; y++) {
      var index = (x + y * newImgWidth) * 4;
      var red = img.pixels[index + 0];
      var green = img.pixels[index + 1];
      var blue = img.pixels[index + 2];
      var alpha = img.pixels[index + 3];
      //Storing pixel vectors that are black by taking center of image as origin
      if(red == 0) {
        var brightSpotVector = createVector(floor((newImgWidth / 2) - (newImgWidth - x)), floor((newImgHeight / 2) - y));
        brightSpotArray.push(brightSpotVector);
        console.log(String(brightSpotVector));
      }
    }
  }
  console.log(brightSpotArray.length);
  */
  //Sound Setup
  angleMode(DEGREES);
  colorMode(RGB);
  amp = new p5.Amplitude();
  title = createDiv('USC GESM111 Final Project (Fall 2017)<br> By: Chengyi (Jeff) Chen');
  title.position(20, 20);
  title.style("font-size", "30px");
  title.style("color", "white");
  description = createDiv(descriptionText);
  description.size(600, 1000);
  description.position(20, 150);
  description.style("font-size", "15px");
  description.style("color", "white");
  button = createButton("Play");
  button.position(525, 30);
  button.style("background-color", "white");
  button.style("color", "black");
  button.mousePressed(togglePlaying);

  //Matrix rain setup
  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream();
    stream.generateSymbols(x, random(-2000, 0));
    streams.push(stream);
    x += symbolSize
  }
  textFont('Consolas');
  textSize(symbolSize);
}

function togglePlaying() {
  if(!song.isPlaying()) {
    song.play();
    button.html("Pause");
    description.hide();
  } else {
    song.pause();
    button.html("Play");
    description.show();
  }
}

function draw() {
  background(0, 165);
  streams.forEach(function(stream) {
    stream.render();
  });
  translate(width / 2, height / 2);
  push();
  rotate(spotNumber);
  for (var i = 0; i < spotNumber; i++) {
    var theta = i * 137.5;
    var radius = c * sqrt(i);
    var x = radius * cos(theta);
    var y = radius * sin(theta);
    var spotVector = createVector(floor(x), floor(y));
    //console.log(String(spotVector));
    /*
    if(brightSpotArray.includes(spotVector)) {
      //var hu = log(start + i * 0.1);
      //hu = map(hu, -1, 1, 0, 255);
      //fill(255);
      //noStroke();
      console.log("yes");
    } else {
      //fill(0);
      //noStroke();
      console.log("no");
    }
    */
    //var hue = sin(spotNumber + i * 0.7);
    //fill(map(hue, -1, 1, 0, 255));
    noStroke();
    ellipse(x, y, map(amp.getLevel(), 0, 0.6, 0.1, 50), map(amp.getLevel(), 0, 0.6, 0.1, 50));
    //ellipse(x, y, (2 * spotRadius), (2 * spotRadius));
  }
  spotNumber += 10;
  pop();
  //start += 20;
  image(img, 0, 0, windowWidth * imageScale, windowWidth * imageScale * img.height / img.width);
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(2, 25));

  this.setToRandomSymbol = function() {
    var charType = round(random(0, 5));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        // set it to Cyrillic
        this.value = String.fromCharCode(
          0400 + round(random(0, 256))
        );
      } else {
        // set it to numeric
        this.value = round(random(0,9));
      }
    }
  }

  this.rain = function() {
    this.y = (this.y >= height) ? 0 : this.y += this.speed;
  }

}

function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(5, 35));
  this.speed = random(5, 22);

  this.generateSymbols = function(x, y) {
    var opacity = 255;
    var first = round(random(0, 3)) == 1;
    for (var i =0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity
      );
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first) {
        fill(140, 255, 170, symbol.opacity);
      } else {
        fill(0, 255, 70, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}