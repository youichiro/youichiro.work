'use strict';

const timestep = 3 * 1000;  // ms

const imageNum = 10;

const zeroPadding = (num, len) => {
  return ('0000' + num).slice(-len)
}

const images = [...Array(imageNum).keys()].sort((a, b) => b - a).map(i => `/images/slider/image${zeroPadding(i+1, 2)}.jpg`);

let count = 0;
let sliderMode = false;
let sliderInterval;
const slideImgElm = document.getElementById('slide-img');
const startBtnElm = document.getElementById('start-btn');
const stopBtnElm = document.getElementById('stop-btn');
const imgCounterElm = document.getElementById('img-counter');
imgCounterElm.textContent = `${count+1}/${images.length}`;

const setSlideImage = () => {
  count = (count + 1) % images.length;
  slideImgElm.src = images[count % images.length];
  imgCounterElm.textContent = `${count+1}/${images.length}`;
}

const start = () => {
  if (!sliderMode) {
    sliderMode = true;
    startBtnElm.style.display = 'none';
    stopBtnElm.style.display = 'inline';
    setSlideImage();
    sliderInterval = setInterval(setSlideImage, timestep);
  }
}

const stop = () => {
  if (sliderMode) {
    sliderMode = false;
    stopBtnElm.style.display = 'none';
    startBtnElm.style.display = 'inline';
    clearInterval(sliderInterval);
  }
}

// set slider height
const sliderElm = document.getElementById('slider')
const sliderWidth = sliderElm.clientWidth;
const sliderHeight = Math.floor(sliderWidth * 0.7);
sliderElm.style.height = `${sliderHeight}px`;

// events
document.getElementById('start-btn').onclick = start;
document.getElementById('stop-btn').onclick = stop;
window.addEventListener("orientationchange", () => {
  location.reload();
})
