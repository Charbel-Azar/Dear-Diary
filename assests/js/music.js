class MusicController {
    constructor() {
        // List of songs to choose from (update with your actual file paths)
        this.songs = [
            './assests/music/ES_Always by Your Side - House Of Say.mp3',
            './assests/music/ES_Blessed - DonVayei.mp3',
            './assests/music/ES_Breeze - Basixx.mp3',
            './assests/music/ES_Come My Way - HATAMITSUNAMI.mp3',
            './assests/music/ES_Full Tank - Timothy Infinite.mp3',
            './assests/music/ES_Hip Hop Rock Song - Def Lev.mp3',
            './assests/music/ES_Honey - Maybe.mp3',
            './assests/music/ES_I\'m Sweet - Adelyn Paik.mp3',
            './assests/music/ES_Im Never Giving Up - Frook.mp3',
            './assests/music/ES_Ladies First - John Runefelt.mp3',
            './assests/music/ES_Long Way Home - Aiyo.mp3',
            './assests/music/ES_Magic - Torii Wolf.mp3',
            './assests/music/ES_Nights Off - Mimmi Bangoura.mp3',
            './assests/music/ES_Otto\'s First Flight - Beyza.mp3',
            './assests/music/ES_Radiance - Mizlo.mp3',
            './assests/music/ES_Smell of Morning Coffee - Franz Gordon.mp3',
            './assests/music/ES_The End of the Line - Rachel Collier.mp3',
            './assests/music/ES_Two Steppin\' - Nbhd Nick.mp3',
            './assests/music/ES_White Light - The Foundling.mp3',
            './assests/music/ES_Ur Face - LeDorean.mp3',
            './assests/music/ES_You - SRA.mp3'
          ];
          
         
          this.isMuted = false;  // Start with music enabled
          this.controller = document.getElementById('musicController');
          this.volumeHalf = this.controller.querySelector('.volume-half');
          this.nextHalf = this.controller.querySelector('.next-half');
          this.volumeIcon = this.volumeHalf.querySelector('i');
          
          // Set up current song index and select a random song to start
          this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
          this.selectedSong = this.songs[this.currentSongIndex];
          
          // Create audio element
          this.audio = new Audio(this.selectedSong);
          this.audio.loop = true;
          this.audio.volume = 0; // Start with volume at 0 for fade-in
          
          // Fade settings
          this.fadeTime = 500; // Fade duration in ms
          this.fadeInterval = 50; // How often to update volume during fade (ms)
          this.targetVolume = 1.0; // Default target volume
          this.isFading = false; // Flag to track if we're currently in a fade
          this.fadeTimer = null; // Timer for fade effects
          
          // Make the controller visible immediately
          this.controller.classList.add('visible');
          
          this.init();
      }
      
      init() {
        // Temporarily mute the audio so autoplay is allowed
        this.audio.muted = true;
        this.audio.play().then(() => {
            // Unmute the audio and update the icon
            this.audio.muted = false;
            this.updateVolumeIcon();
            // Start fade in from 0 volume to the target volume
            this.fadeIn();
        }).catch(error => {
            console.warn('Auto-play prevented by browser:', error);
            // If autoplay fails, set as muted and update icon
            this.isMuted = true;
            this.updateVolumeIcon();
        });
        
        // Handle volume toggle
        this.volumeHalf.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMusic();
        });
        
        // Handle next track
        this.nextHalf.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextSong();
        });
        
        // Listen to video events
        this.observeVideos();
        
        // Audio ended event (in case loop doesn't work)
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });
    }
    
      
      // Fade the audio in from silence to full volume
      fadeIn() {
          if (this.isFading) {
              clearInterval(this.fadeTimer);
          }
          
          this.isFading = true;
          const startVolume = this.audio.volume;
          const volumeStep = (this.targetVolume - startVolume) / (this.fadeTime / this.fadeInterval);
          let currentTime = 0;
          
          this.fadeTimer = setInterval(() => {
              currentTime += this.fadeInterval;
              if (currentTime >= this.fadeTime) {
                  // Fade complete
                  this.audio.volume = this.targetVolume;
                  clearInterval(this.fadeTimer);
                  this.isFading = false;
              } else {
                  // Calculate new volume based on time elapsed
                  this.audio.volume = Math.min(startVolume + (volumeStep * currentTime / this.fadeInterval), this.targetVolume);
              }
          }, this.fadeInterval);
      }
      
      // Fade the audio out from current volume to silence
      fadeOut(callback) {
          if (this.isFading) {
              clearInterval(this.fadeTimer);
          }
          
          this.isFading = true;
          const startVolume = this.audio.volume;
          const volumeStep = startVolume / (this.fadeTime / this.fadeInterval);
          let currentTime = 0;
          
          this.fadeTimer = setInterval(() => {
              currentTime += this.fadeInterval;
              if (currentTime >= this.fadeTime) {
                  // Fade complete
                  this.audio.volume = 0;
                  clearInterval(this.fadeTimer);
                  this.isFading = false;
                  if (callback) callback();
              } else {
                  // Calculate new volume based on time elapsed
                  this.audio.volume = Math.max(startVolume - (volumeStep * currentTime / this.fadeInterval), 0);
              }
          }, this.fadeInterval);
      }
      
      toggleMusic() {
          if (this.isMuted) {
              // User is unmuting - fade in
              this.isMuted = false;
              this.updateVolumeIcon();
              
              // Check if any unmuted video is playing
              if (!this.isAnyUnmutedVideoPlaying()) {
                  this.audio.volume = 0; // Start with zero volume
                  this.audio.play().then(() => {
                      this.fadeIn();
                  });
              }
          } else {
              // User is muting - fade out then pause
              this.isMuted = true;
              this.updateVolumeIcon();
              this.fadeOut(() => {
                  this.audio.pause();
              });
          }
      }
      
      updateVolumeIcon() {
          if (this.isMuted) {
              this.volumeIcon.classList.remove('fa-volume-up');
              this.volumeIcon.classList.add('fa-volume-mute');
          } else {
              this.volumeIcon.classList.remove('fa-volume-mute');
              this.volumeIcon.classList.add('fa-volume-up');
          }
      }
      
      nextSong() {
          // Save current mute state
          const wasMuted = this.isMuted;
          
          // Fade out current song, then change to next song
          this.fadeOut(() => {
              this.audio.pause();
              
              // Select next song
              this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
              this.selectedSong = this.songs[this.currentSongIndex];
              
              // Create new audio element with next song
              this.audio = new Audio(this.selectedSong);
              this.audio.loop = true;
              this.audio.volume = 0; // Start at volume 0 for fade-in
              
              // Restore play state with fade-in
              if (!wasMuted && !this.isAnyUnmutedVideoPlaying()) {
                  this.audio.play().then(() => {
                      this.fadeIn();
                  });
              }
              
              // Restore mute state
              this.isMuted = wasMuted;
              
              // Make sure to update the ended event listener for the new audio element
              this.audio.addEventListener('ended', () => {
                  this.nextSong();
              });
          });
      }
  
      // -----------------------------
      // VIDEO OBSERVATION / EVENTS
      // -----------------------------
      observeVideos() {
          // Check for existing videos on the page
          const videos = document.querySelectorAll('video');
          
          videos.forEach(video => {
              this.attachVideoListeners(video);
          });
          
          // Set up observer for dynamically added videos
          const bodyObserver = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                  if (mutation.addedNodes) {
                      mutation.addedNodes.forEach((node) => {
                          // Check if the added node is a video or contains videos
                          if (node.nodeName === 'VIDEO') {
                              this.attachVideoListeners(node);
                          } else if (node.querySelectorAll) {
                              const newVideos = node.querySelectorAll('video');
                              newVideos.forEach(video => this.attachVideoListeners(video));
                          }
                      });
                  }
              });
          });
          
          bodyObserver.observe(document.body, {
              childList: true,
              subtree: true
          });
      }
      
      attachVideoListeners(video) {
          // We attach event listeners to handle any playback or mute changes
          video.addEventListener('play', () => this.updateAudioState());
          video.addEventListener('pause', () => this.updateAudioState());
          video.addEventListener('ended', () => this.updateAudioState());
          video.addEventListener('volumechange', () => this.updateAudioState());
      }
      
      updateAudioState() {
          // If any video is unmuted *and* playing, fade out and pause background music
          if (this.isAnyUnmutedVideoPlaying()) {
              // Only fade if currently playing
              if (!this.audio.paused) {
                  this.fadeOut(() => {
                      this.audio.pause();
                  });
              }
          } else {
              // If no unmuted video is playing, resume background music only if user hasn't globally muted it
              if (!this.isMuted && this.audio.paused) {
                  this.audio.volume = 0; // Start with volume at 0
                  this.audio.play().then(() => {
                      this.fadeIn();
                  });
              }
          }
      }
      
      // Returns true if there's *any* video playing & unmuted
      isAnyUnmutedVideoPlaying() {
          const videos = document.querySelectorAll('video');
          return Array.from(videos).some(video => {
              const isPlaying = !video.paused && !video.ended;
              const isUnmuted = video.muted === false;
              return isPlaying && isUnmuted;
          });
      }
  }
  
  // Initialize when page loads (not waiting for DOMContentLoaded)
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
          new MusicController();
      });
  } else {
      // DOM already loaded, initialize immediately
      new MusicController();
}