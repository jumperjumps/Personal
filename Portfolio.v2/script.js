// Makes the moving band loop smoothly.
// It repeats the text a few times, then doubles everything
// so the animation can slide exactly halfway and start over unseen.

const track = document.querySelector('.ticker-track');
const item = track.querySelector('.ticker-item');

// Repeat the item so the band is wider than the screen
for (let i = 0; i < 5; i++) {
  track.appendChild(item.cloneNode(true));
}

// Double the whole set for the seamless loop
track.innerHTML = track.innerHTML + track.innerHTML;
