document.addEventListener('DOMContentLoaded', () => {
  const videoGrid = document.querySelector('.video-grid');
  const gridSize = 3; // 3x3 grid
  let currentPlayingVideo = null; // Track the currently playing video

  // 1. Generate 3x3 cells with video, overlay, PLAY button, and PAUSE button.
  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('video-cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Create video element
      const video = document.createElement('video');
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      const source = document.createElement('source');
      source.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
      source.type = 'video/mp4';
      video.appendChild(source);

      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'video-overlay';

      // Create PLAY button
      const playButton = document.createElement('button');
      playButton.className = 'play-button';
      playButton.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;

      // Create PAUSE button
      const pauseButton = document.createElement('button');
      pauseButton.className = 'pause-button';
      pauseButton.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/>
        </svg>
      `;
      // Hide pause button by default
      pauseButton.style.display = 'none';

      // Append buttons to overlay
      overlay.appendChild(playButton);
      overlay.appendChild(pauseButton);

      // Append video & overlay to cell
      cell.appendChild(video);
      cell.appendChild(overlay);
      videoGrid.appendChild(cell);
    }
  }

  // 2. Expand hovered row/column (grid expansion)
  const BIG = 1.5;
  const SMALL = 0.75;
  function expandGrid(hoveredRow, hoveredCol) {
    for (let r = 1; r <= gridSize; r++) {
      const rowValue = (r === hoveredRow) ? BIG : SMALL;
      document.documentElement.style.setProperty(`--row${r}`, `${rowValue}fr`);
    }
    for (let c = 1; c <= gridSize; c++) {
      const colValue = (c === hoveredCol) ? BIG : SMALL;
      document.documentElement.style.setProperty(`--col${c}`, `${colValue}fr`);
    }
  }

  function resetGrid() {
    for (let r = 1; r <= gridSize; r++) {
      document.documentElement.style.setProperty(`--row${r}`, `1fr`);
    }
    for (let c = 1; c <= gridSize; c++) {
      document.documentElement.style.setProperty(`--col${c}`, `1fr`);
    }
  }

  const cells = document.querySelectorAll('.video-cell');
  cells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      expandGrid(r, c);
    });
    cell.addEventListener('mouseleave', resetGrid);
  });

  // 3. Fade-in effect using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  cells.forEach(cell => observer.observe(cell));

  // 4. Video logic:
  //    - Start all videos paused (with grayscale).
  //    - Use separate PLAY/PAUSE buttons.

  const videos = document.querySelectorAll('.video-cell video');
  videos.forEach(video => {
    video.pause();
    video.style.filter = 'grayscale(100%)';

    // Grab corresponding play/pause buttons
    const cell = video.parentElement;
    const playBtn = cell.querySelector('.play-button');
    const pauseBtn = cell.querySelector('.pause-button');

    // Ensure initial state: show play, hide pause
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';

    // Play button click
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // If another video is playing, pause it
      if (currentPlayingVideo && currentPlayingVideo !== video) {
        currentPlayingVideo.pause();
        currentPlayingVideo.style.filter = 'grayscale(100%)';

        // Show the other video's play button, hide its pause button
        const otherCell = currentPlayingVideo.parentElement;
        const otherPlayBtn = otherCell.querySelector('.play-button');
        const otherPauseBtn = otherCell.querySelector('.pause-button');
        if (otherPlayBtn) otherPlayBtn.style.display = 'block';
        if (otherPauseBtn) otherPauseBtn.style.display = 'none';

        currentPlayingVideo = null;
      }

      // Play current video
      video.play();
      video.style.filter = 'grayscale(0%)';
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';

      // Track as currently playing
      currentPlayingVideo = video;
    });

    // Pause button click
    pauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Pause this video
      video.pause();
      video.style.filter = 'grayscale(100%)';
      playBtn.style.display = 'block';
      pauseBtn.style.display = 'none';

      // If this was the currently playing video, unset it
      if (currentPlayingVideo === video) {
        currentPlayingVideo = null;
      }
    });
  });
});
