class MusicController {
    constructor() {
        // List of songs to choose from (update with your actual file paths)
        this.songs = [
            './assests/music/music (1).mpeg'
        ];
        
        this.isMuted = true;  // Whether the *background music* is muted
        this.button = document.getElementById('volumeButton');
        this.icon = this.button.querySelector('i');
        
        // Random song choice
        this.selectedSong = this.songs[Math.floor(Math.random() * this.songs.length)];
        
        // Create audio element
        this.audio = new Audio(this.selectedSong);
        this.audio.loop = true;
        
        this.init();
    }
    
    init() {
        // Show the button after loading screen finishes
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('hide')) {
                        setTimeout(() => {
                            this.button.classList.add('visible');
                        }, 500); // show with a small delay
                    }
                });
            });
            
            observer.observe(loadingScreen, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
        
        // Handle global music mute/unmute
        this.button.addEventListener('click', () => this.toggleMusic());
        
        // Listen to video events
        this.observeVideos();
    }
    
    toggleMusic() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            // User just muted the background music
            this.audio.pause();
            this.icon.classList.remove('fa-volume-up');
            this.icon.classList.add('fa-volume-mute');
        } else {
            // User just unmuted background music
            // Check if any unmuted video is playing
            if (!this.isAnyUnmutedVideoPlaying()) {
                // If none is unmuted & playing, play music
                this.audio.play();
            }
            this.icon.classList.remove('fa-volume-mute');
            this.icon.classList.add('fa-volume-up');
        }
    }

    // -----------------------------
    // VIDEO OBSERVATION / EVENTS
    // -----------------------------
    observeVideos() {
        // Check for new or existing videos on the page
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // We attach event listeners to handle any playback or mute changes
            video.addEventListener('play', () => this.updateAudioState());
            video.addEventListener('pause', () => this.updateAudioState());
            video.addEventListener('ended', () => this.updateAudioState());
            video.addEventListener('volumechange', () => this.updateAudioState());
        });
    }
    
    updateAudioState() {
        // If any video is unmuted *and* playing, pause background music
        if (this.isAnyUnmutedVideoPlaying()) {
            this.audio.pause();
        } else {
            // If no unmuted video is playing, resume background music only if user hasn't globally muted it
            if (!this.isMuted) {
                this.audio.play();
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicController();
});
