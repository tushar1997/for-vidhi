/* Background song via the official YouTube video (no audio file is hosted here).
   - From the first page: loops 0:34 → 0:44.
   - When she says yes: jumps to the "dilkashi" stanza at 1:48 and plays to the end
     (then repeats that stanza).
   It first tries to play with sound. Most browsers only allow sound after one tap, so if
   that's blocked it plays muted and turns the sound on at the first tap (the envelope).
   YouTube's rules require the player to stay visible, so it sits in a small card. */
(function () {
  const SONG = { id: 'gurNn33xDF0', loopFrom: 34, loopTo: 44, stanza: 108 };
  let player, ready = false, mode = 'loop', unlocked = false, muted = false, wantStanza = false;

  // the little "now playing" card
  const card = document.createElement('div');
  card.id = 'music';
  card.innerHTML = `
    <div class="m-video"><div id="yt"></div></div>
    <div class="m-bar">
      <span class="m-disc" aria-hidden="true"></span>
      <span class="m-title">♪ achchi lagti ho</span>
      <button class="m-btn" id="mBtn" aria-label="Mute or unmute music">🔇</button>
    </div>
    <div class="m-hint" id="mHint">tap anywhere for music 🎵</div>`;
  document.body.appendChild(card);
  const btn = card.querySelector('#mBtn'), hint = card.querySelector('#mHint');

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('yt', {
      videoId: SONG.id,
      playerVars: { start: SONG.loopFrom, autoplay: 1, mute: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, fs: 0, iv_load_policy: 3 },
      events: {
        onReady: () => {
          ready = true;
          if (wantStanza) goStanza();
          if (unlocked) { unmute(); return; }
          // try playing WITH sound straight away; if the browser blocks it, fall back to
          // muted playback and turn the sound on at the first tap (the envelope)
          player.unMute(); player.setVolume(100); player.playVideo();
          setTimeout(() => {
            if (unlocked) return;
            if (player.getPlayerState() === YT.PlayerState.PLAYING && !player.isMuted()) {
              unlocked = true; btn.textContent = '🔊'; hint.style.display = 'none';
            } else { player.mute(); player.playVideo(); }
          }, 1200);
        },
        onStateChange: e => {
          card.classList.toggle('playing', e.data === YT.PlayerState.PLAYING);
          if (e.data === YT.PlayerState.ENDED) { player.seekTo(mode === 'stanza' ? SONG.stanza : SONG.loopFrom, true); player.playVideo(); }
        },
        onError: () => card.classList.add('error'),
      },
    });
  };

  // keep the opening tune looping between 0:34 and 0:44.
  // Checking every 100ms and jumping a hair early keeps the loop tight; seeking back inside
  // the part that's already loaded doesn't need the internet again, so it doesn't stall.
  setInterval(() => {
    if (!ready || mode !== 'loop') return;
    const t = player.getCurrentTime();
    if (t >= SONG.loopTo - .12 || t < SONG.loopFrom - 1) player.seekTo(SONG.loopFrom, true);
  }, 100);

  function fadeIn() {
    let v = 0; player.setVolume(0);
    const iv = setInterval(() => { v += 8; player.setVolume(Math.min(v, 100)); if (v >= 100) clearInterval(iv); }, 80);
  }
  function unmute() {
    if (!ready || muted) return;
    player.unMute(); fadeIn(); player.playVideo();
    btn.textContent = '🔊'; hint.style.display = 'none';
  }
  function goStanza() {
    mode = 'stanza';
    if (!ready) { wantStanza = true; return; }
    player.seekTo(SONG.stanza, true); player.playVideo();
    if (unlocked && !muted) unmute();
  }

  // the first tap/click/key anywhere unlocks sound
  const unlock = e => {
    if (unlocked || (e.target.closest && e.target.closest('#music'))) return;
    unlocked = true;
    unmute();
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev => removeEventListener(ev, unlock, true));
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, unlock, { capture: true, passive: true }));

  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (!ready) return;
    if (player.isMuted()) { muted = false; unlocked = true; unmute(); }
    else { muted = true; player.mute(); btn.textContent = '🔇'; }
  });

  window.Music = { dilkashi: goStanza, get player() { return player; }, get mode() { return mode; } };
})();
