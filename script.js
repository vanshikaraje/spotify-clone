let currentSong = new Audio();
let songs = [];
let currentIndex = 0;
let isPlaying = false;

async function getSongs() {
  let res = await fetch("http://127.0.0.1:3000/songs/");
  let html = await res.text();
  let div = document.createElement("div");
  div.innerHTML = html;
  let links = div.getElementsByTagName("a");

  let songList = [];
  for (let link of links) {
    if (link.href.endsWith(".mp3")) {
      songList.push(link.href.split("/songs/")[1]);
    }
  }
  return songList;
}

function playMusic(song, index) {
  // If the same song is clicked again
  if (currentIndex === index && !currentSong.paused) {
    currentSong.pause();
    document.querySelector("#play").src = "icons/play.svg";
    isPlaying = false;
    return;
  }

  currentSong.src = `/songs/${song}`;
  currentSong.play();
  document.querySelector("#play").src = "icons/pause.svg";
  document.querySelector(".songinfo").textContent = decodeURIComponent(song);
  document.querySelector(".songtime").textContent = "00:00 / 00:00";
  currentIndex = index;
  isPlaying = true;
}

function renderSongs(songArray) {
  let ul = document.querySelector(".songlist ul");
  ul.innerHTML = "";

  songArray.forEach((song, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <div class="info">
        <div>${decodeURIComponent(song)}</div>
        <div>VANSHIKA</div>
      </div>
      <div class="playnow">▶</div>
    `;

    li.addEventListener("click", () => playMusic(song, index));
    ul.appendChild(li);
  });
}

function setupControls() {
  const playBtn = document.querySelector("#play");
  const prevBtn = document.querySelector("#previous");
  const nextBtn = document.querySelector("#next");

  playBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playBtn.src = "icons/pause.svg";
      isPlaying = true;
    } else {
      currentSong.pause();
      playBtn.src = "icons/play.svg";
      isPlaying = false;
    }
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playMusic(songs[currentIndex], currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playMusic(songs[currentIndex], currentIndex);
  });
}

async function main() {
  songs = await getSongs();
  renderSongs(songs);
  setupControls();
}

main();
