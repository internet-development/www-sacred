/*
    Adel Faure Website, lightweight vernacular ASCII art composed webiste.
    Copyright (C) 2021 Adel Faure

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

function a_input(el,add,remove){
  for (var i = 0; i < add.length; i++){
    document.body.classList.add(add[i]);
  }
  for (var i = 0; i < remove.length; i++){
    document.body.classList.remove(remove[i]);
    uncheck(input_list[remove[i]]);
  }
  el.getElementsByTagName('span')[0].textContent = 'X';
}
function uncheck(el){
  el.getElementsByTagName('span')[0].textContent = ' ';
}

// FAMILY
const jgs5 = document.getElementById("jgs5");
jgs5.addEventListener("click",function(){
  a_input(jgs5,['jgs5'],['jgs9','jgs7']);
});
const jgs7 = document.getElementById("jgs7");
jgs7.addEventListener("click",function(){
  a_input(jgs7,['jgs7'],['jgs5','jgs9']);
});
const jgs9 = document.getElementById("jgs9");
jgs9.addEventListener("click",function(){
  a_input(jgs9,['jgs9'],['jgs5','jgs7']);
});

// SIZE
const x1 = document.getElementById("x1");
x1.addEventListener("click",function(){
  a_input(x1,['x1'],['x2','x3']);
});
const x2 = document.getElementById("x2");
x2.addEventListener("click",function(){
  a_input(x2,['x2'],['x1','x3']);
});
const x3 = document.getElementById("x3");
x3.addEventListener("click",function(){
  a_input(x3,['x3'],['x1','x2']);
});

// MODE
const day = document.getElementById("day");
day.addEventListener("click",function(){
  a_input(day,['day'],['night']);
});
const night = document.getElementById("night");
night.addEventListener("click",function(){
  a_input(night,['night'],['day']);
});

// LIST
input_list = {
  "jgs5": jgs5,
  "jgs7": jgs7,
  "jgs9": jgs9,
  "x1": x1,
  "x2": x2,
  "x3": x3,
  "day": day,
  "night": night
}

// RESPONSIVE


function responsive_font() {
  let width = window.innerWidth;
  let height = window.innerHeight;
/*if (height > width) {*/
    if (height < 400
    || width < 560) {
      jgs5.click();
      x1.click();
    } else if (height >= 400 && height < 560
    || width >= 560 && width < 720) {
      jgs7.click();
      x1.click();
    } else if (height >= 560 && height < 720
    || width >= 720 && width < 800 ) {
      jgs9.click();
      x1.click();
    } else if (height >= 720 && height < 800
    || width >= 800 && width < 1120) {
      jgs5.click();
      x2.click();
    } else if (height >= 800 && height < 1120
    || width >= 1120 && width < 1200) {
      jgs7.click();
      x2.click();
    } else if (height >= 1120 && height < 1200
    || width >= 1200 && width < 1440) {
      jgs5.click();
      x3.click();
    } else if (height >= 1200 && height < 1440
    || width >= 1440 && width < 1680) {
      jgs9.click();
      x2.click();
    } else if (height >= 1440 && height < 1680
    || width >= 1680 && width < 2160) {
      jgs7.click();
      x3.click();
    } else {
      jgs9.click();
      x3.click();
    }
/*} else {
    if (width < 560) {
      jgs5.click();
      x1.click();
    } else if (width >= 560 && width < 720) {
      jgs7.click();
      x1.click();
    } else if (width >= 720 && width < 800 ) {
      jgs9.click();
      x1.click();
    } else if (width >= 800 && width < 1120) {
      jgs5.click();
      x2.click();
    } else if (width >= 1120 && width < 1200) {
      jgs7.click();
      x2.click();
    } else if (width >= 1200 && width < 1440) {
      jgs5.click();
      x3.click();
    } else if (width >= 1440 && width < 1680) {
      jgs9.click();
      x2.click();
    } else if (width >= 1680 && width < 2160) {
      jgs7.click();
      x3.click();
    } else {
      jgs9.click();
      x3.click();
    }
  }*/
}

responsive_font();

//window.addEventListener("resize",responsive_font);

const hours = new Date().getHours();
const isDayTime = hours > 6 && hours < 20;

document.body.style.display = 'initial';

if (isDayTime) {
  day.click();
} else {
  night.click();
}

// SETUP

// ASCII

function include_ascii(holder){
  fetch('./ascii/'+holder.id+'.txt').then(response => {
    return response.text();
  }).then(ascii => {
    holder.textContent += (holder.textContent? '\n': '')+ascii;
  });
}

let ascii_holders = document.getElementsByClassName("ascii");

for (var i = 0; i < ascii_holders.length; i++) {
  include_ascii(ascii_holders[i]);
};

