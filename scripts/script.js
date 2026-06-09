const currentDate = document.getElementById('current-date');
const audioElement = document.getElementById('audio-player-element');
const audioToggle = document.getElementById('audio-toggle');
const audioNext = document.getElementById('audio-next');
const trackTitle = document.getElementById('track-title');
const trackStatus = document.getElementById('track-status');
const trackList = document.getElementById('track-list');
const cdSpinner = document.querySelector('.cd-spinner');

const playlist = [
  { title: 'Aklımda Biri Var', src: 'scripts/songs/song1.mp3' },
  { title: 'Earth Angel (Will You Be Mine)', src: 'scripts/songs/song2.mp3' },
  { title: 'Her Majesty', src: 'scripts/songs/song3.mp3' },
  { title: 'Hula Girl', src: 'scripts/songs/song4.mp3' },
  { title: 'O Pani!', src: 'scripts/songs/song5.mp3' },
  { title: 'Little Darlin\' (We\'ll Be Kissing)', src: 'scripts/songs/song6.mp3' },
  { title: 'Talkabout', src: 'scripts/songs/song7.mp3' },
  { title: 'Perfect Defect', src: 'scripts/songs/song8.mp3' }

];

let currentTrackIndex = 0;
let isPlaying = true;

function formatTrackTitle(track) {
  return track?.title || 'no track loaded';
}

function updatePlaylistDisplay() {
  if (!trackList) return;
  trackList.innerHTML = '';
  playlist.forEach((track, index) => {
    const item = document.createElement('li');
    item.textContent = track.title;
    item.dataset.index = index;
    if (index === currentTrackIndex) {
      item.classList.add('active');
    }
    item.addEventListener('click', () => {
      loadTrack(index, true);
    });
    trackList.appendChild(item);
  });
}

function updateTrackInfo() {
  trackTitle.textContent = formatTrackTitle(playlist[currentTrackIndex]);
  trackStatus.textContent = isPlaying ? 'playing' : 'paused';
  audioToggle.textContent = isPlaying ? 'Pause' : 'Play';
}

function loadTrack(index, autoplay = false) {
  if (!playlist[index]) return;
  currentTrackIndex = index;
  audioElement.src = playlist[index].src;
  audioElement.load();
  updatePlaylistDisplay();
  updateTrackInfo();
  if (autoplay) {
    audioElement.play().catch(() => {
      isPlaying = false;
      updateTrackInfo();
    });
  }
}

function chooseNextTrack() {
  if (playlist.length <= 1) {
    return;
  }
  const options = playlist.map((_, index) => index).filter(index => index !== currentTrackIndex);
  const nextIndex = options[Math.floor(Math.random() * options.length)];
  loadTrack(nextIndex, true);
}

function toggleAudio() {
  if (audioElement.paused || audioElement.ended) {
    audioElement.play().catch(() => {
      isPlaying = false;
      updateTrackInfo();
    });
  } else {
    audioElement.pause();
  }
}

if (currentDate) {
  const date = new Date();
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  currentDate.textContent = date.toLocaleDateString(undefined, options);
}

if (audioElement && audioToggle && audioNext && trackTitle && trackStatus && trackList) {
  audioElement.loop = false;
  loadTrack(currentTrackIndex);
  updatePlaylistDisplay();
  updateTrackInfo();

  audioToggle.addEventListener('click', toggleAudio);
  audioNext.addEventListener('click', chooseNextTrack);

  audioElement.addEventListener('play', () => {
    isPlaying = true;
    cdSpinner?.classList.add('spin');
    updateTrackInfo();
  });

  audioElement.addEventListener('pause', () => {
    isPlaying = false;
    cdSpinner?.classList.remove('spin');
    updateTrackInfo();
  });

  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    cdSpinner?.classList.remove('spin');
    updateTrackInfo();
    chooseNextTrack();
  });
}
