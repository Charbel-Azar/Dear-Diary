document.addEventListener('DOMContentLoaded', () => {
    const videoGrid = document.querySelector('.video-grid');
    const gridSize = 3; // 3x3 grid
    let currentPlayingVideo = null; // keep track of which video is playing
  
    // 1. Generate 3x3 cells
    for (let row = 1; row <= gridSize; row++) {
      for (let col = 1; col <= gridSize; col++) {
        const cell = document.createElement('div');
        cell.classList.add('video-cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Create video
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
  
        const source = document.createElement('source');
        source.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
        source.type = 'video/mp4';
        video.appendChild(source);
        
        // Overlay & play button
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        `;
        overlay.appendChild(playButton);
        
        cell.appendChild(video);
        cell.appendChild(overlay);
        videoGrid.appendChild(cell);
      }
    }
    
    // 2. Expand hovered row/column
    const BIG = 1.5;
    const SMALL = 0.75;
    function expandGrid(hoveredRow, hoveredCol) {
      for (let r = 1; r <= 3; r++) {
        const rowValue = (r === hoveredRow) ? BIG : SMALL;
        document.documentElement.style.setProperty(`--row${r}`, `${rowValue}fr`);
      }
      for (let c = 1; c <= 3; c++) {
        const colValue = (c === hoveredCol) ? BIG : SMALL;
        document.documentElement.style.setProperty(`--col${c}`, `${colValue}fr`);
      }
    }
    function resetGrid() {
      for (let r = 1; r <= 3; r++) {
        document.documentElement.style.setProperty(`--row${r}`, `1fr`);
      }
      for (let c = 1; c <= 3; c++) {
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
  
    // 3. Fade-in (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    cells.forEach(cell => observer.observe(cell));
  
    // 4. Video play/pause – only one at a time; hide play button on play
    const videos = document.querySelectorAll('.video-cell video');
    videos.forEach(video => {
      // ensure each video is paused & grayscale
      video.pause();
      video.style.filter = 'grayscale(100%)';
  
      const playBtn = video.parentElement.querySelector('.play-button');
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
  
        // pause any currently playing video
        if (currentPlayingVideo && currentPlayingVideo !== video) {
          currentPlayingVideo.pause();
          currentPlayingVideo.style.filter = 'grayscale(100%)';
          // show that other video's play button again
          const otherBtn = currentPlayingVideo.parentElement.querySelector('.play-button');
          if (otherBtn) otherBtn.style.display = 'block';
        }
  
        // toggle this video
        if (!video.paused) {
          // pause
          video.pause();
          video.style.filter = 'grayscale(100%)';
          // show play button
          playBtn.style.display = 'block';
          currentPlayingVideo = null;
        } else {
          // play
          video.play();
          video.style.filter = 'grayscale(0%)';
          // hide play button
          playBtn.style.display = 'none';
          currentPlayingVideo = video;
        }
      });
    });
  });
  