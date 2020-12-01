const image = document.querySelector("img");
const title = document.querySelector("#title");
const artist = document.querySelector("#artist");
const music = document.querySelector("audio");
const progressContainer = document.querySelector("#progress-container");
const progress = document.querySelector("#progress");
const currentTimeEle = document.querySelector(".current-time");
const durationEle = document.querySelector(".duration");
const prevBtn = document.querySelector("#prev");
const playBtn = document.querySelector("#play");
const nextBtn = document.querySelector("#next");
const toggleBtn = document.querySelector("#toggle-random");
const volumeBtn = document.querySelector("#volume-button");
const volumeContent = document.querySelector("#volume-content");
const volumeRange = document.querySelector("#volume-range");

let isPlayig = false;
let randomPlaying = false;
music.volume = 0.1;

//song list
const songs = [
  {
    name: "jacinto-1",
    displayName: "Electric Chill Machine",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-2",
    displayName: "digermusic",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-3",
    displayName: "Machine",
    artist: "Deneme Design",
  },
  {
    name: "metric-1",
    displayName: "Chill Machine",
    artist: "Mtirc Design",
  },
];

//local storage song index
let songIndex = localStorage.getItem("songIndex")
  ? localStorage.getItem("songIndex")
  : 0;

//local storage last song
let lastSongIndex = localStorage.getItem("lastSong")
  ? localStorage.getItem("lastSong")
  : songIndex == 0
  ? songs.length - 1
  : songIndex - 1;

//play song
function playSong() {
  isPlayig = true;
  playBtn.querySelector("i").classList.replace("fa-play", "fa-pause");
  playBtn.querySelector("i").setAttribute("title", "Pause");
  music.play();
}

//pause song
function pauseSong() {
  isPlayig = false;
  playBtn.querySelector("i").classList.replace("fa-pause", "fa-play");
  playBtn.querySelector("i").setAttribute("title", "Play");
  music.pause();
}

//play and pause event listener
playBtn.addEventListener("click", () => (isPlayig ? pauseSong() : playSong()));

//send song data to html
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
  localStorage.setItem("songIndex", songIndex);
}

//on page load
loadSong(songs[songIndex]);

function nextSong() {
  lastSongIndex = localStorage.setItem("lastSong", songIndex);
  //for random playin controller
  if (randomPlaying) {
    let random = Math.floor(Math.random() * songs.length);
    songIndex = random;
  } else {
    songIndex++;
  }
  // control if last song of list
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  lastSongIndex = localStorage.setItem("lastSong", songIndex);
  songIndex--;
  //control if first song of list
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgressBar(e) {
  if (isPlayig) {
    const { duration, currentTime } = e.srcElement;

    //progressbar width calculation
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    //duration time seconds to minute and seconds and write to durationEle
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);

    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    if (durationSeconds) {
      durationEle.textContent = `${durationMinutes}:${durationSeconds}`;
    }

    //current time seconds to minute and seconds and write to currentTimeEle
    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    currentTimeEle.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
  if (!isPlayig) {
    playSong();
  }
}

function toggleSong() {
  randomPlaying = !randomPlaying;
  if (randomPlaying) {
    toggleBtn.classList.add("active");
  } else {
    toggleBtn.classList.remove("active");
  }
}

//change volume and update
function updateVolume(e) {
  music.volume = e.srcElement.value / e.srcElement.max;
}

let volumeContentOpen = false;

//close volume rage bar div
function toggleVolumeContent() {
  if (!volumeContentOpen) {
    volumeContent.style.display = "flex";
  } else {
    volumeContent.style.display = "none";
  }
  volumeContentOpen = !volumeContentOpen;
}

//event listeners
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
music.addEventListener("timeupdate", updateProgressBar);
music.addEventListener("ended", nextSong);
progressContainer.addEventListener("click", setProgressBar);
toggleBtn.addEventListener("click", toggleSong);
volumeRange.addEventListener("change", updateVolume);
volumeBtn.addEventListener("click", toggleVolumeContent);
