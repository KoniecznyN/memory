const header = document.getElementById("h1");
const win = document.getElementById("win");
const lost = document.getElementById("lost");
const winButton = document.getElementById("winButton");
const lostButton = document.getElementById("lostButton");
const main = document.getElementById("main");
const cards = document.getElementById("cards");
const timeBarOutline = document.getElementById("timeBarOutline");
const timeBarP = document.getElementById("timeBarP");
const timeBar = document.getElementById("timeBar");
const thirtyTable = document.getElementById("thirty");
const sixtyTable = document.getElementById("sixty");
const ninetyTable = document.getElementById("ninety");
const rightPanel = document.getElementById("rightPanel");
const scoreTable = document.getElementById("scoreTable");
const usernameBox = document.getElementById("usernameBox");
const usernameInput = document.getElementById("usernameInput");
let time = 0;
let arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
let defaultBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let selectedTiles = [];
let cookieArrayThirty = [];
let cookieArraySixty = [];
let cookieArrayNinety = [];
const userObject = {
  username: "username",
  score: "score",
};

function toggle() {
  let username = usernameInput.value;
  username = encodeURIComponent(username);
  userObject.username = username;
  usernameBox.style.display = "none";
  main.style.display = "none";
  cards.style.display = "flex";
  rightPanel.style.display = "none";
  header.innerText = `MEMORY (${time}[s])`;
  arr = shuffle(arr);
}

function reversedToggle() {
  main.style.display = "block";
  cards.style.display = "none";
  win.style.display = "none";
  lost.style.display = "none";
  header.innerText = "MEMORY GAME";
  timeBarOutline.style.display = "none";
  tileClicked = true;
  ifInterval = false;
  counter = 0;
  selectedTiles = [];
  rightPanel.style.display = "block";
  refresh(defaultBoard);
  thirtyTable.innerText = cookiesToArray("30");
  sixtyTable.innerText = cookiesToArray("60");
  ninetyTable.innerText = cookiesToArray("90");
  usernameInput.value = "";
}

function shuffle(arr) {
  let secondArr = [];
  while (arr.length > 0) {
    const randomElement = Math.floor(Math.random() * arr.length);
    const element = arr.splice(randomElement, 1);
    secondArr.push(element[0]);
  }
  return secondArr;
}

function refresh(arr) {
  let element = document.querySelectorAll("#memoryTile");
  for (let i = 0; i < element.length; ++i) {
    element[i].src = `images/${arr[i]}.jpg`;
  }
}

let tileClicked = true;
let ifInterval = false;
let counter = 0;

function tile(tileIndex, arr) {
  let tile = document.querySelectorAll("#memoryTile");

  if (!ifInterval) {
    startInterval(time);
  }

  if (!tileClicked || !tile[tileIndex - 1].src.includes("images/0.jpg")) {
    return;
  }

  let tileSource = (tile[tileIndex - 1].src = `images/${
    arr[tileIndex - 1]
  }.jpg`);

  if (
    (selectedTiles.length == 1 && selectedTiles[0][1] != tileIndex) ||
    selectedTiles.length == 0
  ) {
    selectedTiles.push([tileSource, tileIndex]);
  }

  if (selectedTiles.length < 2) {
    return;
  }

  if (selectedTiles[0][0] == selectedTiles[1][0]) {
    counter++;
    selectedTiles = [];
  } else {
    tileClicked = false;
    setTimeout(() => {
      tile[selectedTiles[0][1] - 1].src = `images/0.jpg`;
      tile[selectedTiles[1][1] - 1].src = `images/0.jpg`;
      selectedTiles = [];
      tileClicked = true;
    }, 500);
  }
}

function startInterval(time) {
  ifInterval = true;
  timeBarOutline.style.display = "block";

  const targetTime = new Date().getTime() + time * 1000;
  let timerId;

  function updateTimer() {
    const currentTime = new Date().getTime();
    const remainingTime = targetTime - currentTime;

    if (remainingTime <= 0) {
      timeBarP.innerText = "KONIEC CZASU";
      stopTimer();
      cards.style.display = "none";
      lost.style.display = "flex";
      return "Przegrana";
    } else {
      const minutes = Math.floor(remainingTime / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      const milliseconds = remainingTime % 1000;

      const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;

      timeBar.style.width = remainingTime / time / 10 + "%";
      timeBarP.innerText = formattedTime;
    }

    if (counter < 8) {
      timerId = setTimeout(updateTimer, 1);
    } else {
      stopTimer();
      const scoreTime = time * 1000 - remainingTime;
      const minutes = Math.floor(scoreTime / (1000 * 60));
      const seconds = Math.floor((scoreTime % (1000 * 60)) / 1000);
      const milliseconds = scoreTime % 1000;

      const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;

      cards.style.display = "none";
      win.style.display = "flex";
      userObject.score = formattedTime;
      addToCookie(time);
      return formattedTime;
    }
  }

  function stopTimer() {
    clearTimeout(timerId);
  }

  updateTimer();
}

function setPlaytime(playTime) {
  time = playTime;
  usernameBox.style.display = "flex";
  refresh(defaultBoard);
}

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + 1000 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  cvalue = JSON.stringify(cvalue);
  if (getCookie(cname) == "") {
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  } else {
    let cookie = getCookie(cname);
    cookie += "," + cvalue;
    document.cookie = cname + "=" + cookie + ";" + expires + ";path=/";
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = document.cookie;
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function addToCookie(time) {
  switch (time) {
    case 30:
      setCookie("30", userObject);
      break;
    case 60:
      setCookie("60", userObject);
      break;
    case 90:
      setCookie("90", userObject);
      break;
  }
  console.log(document.cookie);
}

function toNumber(string) {
  string = string.replaceAll(":", "");
  let number = parseInt(string);
  return number;
}

function cookiesToArray(cvalue) {
  let cookies = getCookie(cvalue);
  console.log(cookies);
  let score = "";
  if (cookies == "") {
    for (let i = 0; i < 10; ++i) {
      score += `${i + 1}. ---\n`;
    }
    return score;
  } else {
    cookies = cookies.replaceAll("},{", "};{");
    cookies = cookies.split(";");
    console.log(cookies);
    for (let i = 0; i < cookies.length; ++i) {
      cookies[i] = JSON.parse(cookies[i]);
    }
    cookies.sort((a, b) => (toNumber(a.score) > toNumber(b.score) ? 1 : -1));
    for (let i = 0; i < 10; ++i) {
      if (cookies[i] != undefined) {
        let cookie = cookies[i];
        score += `${i + 1}. ${decodeURIComponent(cookie.username)} - ${
          cookie.score
        } \n`;
      } else {
        score += `${i + 1}. ---\n`;
      }
    }
    return score;
  }
}

thirtyTable.innerText = cookiesToArray("30");
sixtyTable.innerText = cookiesToArray("60");
ninetyTable.innerText = cookiesToArray("90");
