// Sample story data with mixed media types
const stories = [
    {
        id: 1,
        username: 'Beginning',
        mediaUrl: 'assests/images/logo/white_transparent_logo.png',
        profilePic: 'assests/images/logo/black_transparent_logo.png',
        type: 'image',
        duration: 10000, // 3 seconds for this image
        viewed: false
    },
    {
        id: 2,
        username: 'Growth',
        mediaUrl: 'assests/images/ourstory/introvideo.mp4',
        profilePic: 'assests/images/logo/black_transparent_logo.png',
        type: 'video',
        duration: 36000, // 15 seconds for this video
        viewed: false
    },
    {
        id: 3,
        username: 'Innovation',
        mediaUrl: 'assests/images/ourstory/load (3).jpg',
        profilePic: 'assests/images/ourstory/load (3).jpg',
        type: 'image',
        duration: 10000, // 4 seconds for this image
        viewed: false
    },
    {
        id: 4,
        username: 'Beginning',
        mediaUrl: 'assests/images/logo/white_transparent_logo.png',
        profilePic: 'assests/images/logo/black_transparent_logo.png',
        type: 'image',
        duration: 10000, // 3 seconds for this image
        viewed: false
    },
    {
        id: 5,
        username: 'Beginning',
        mediaUrl: 'assests/images/logo/white_transparent_logo.png',
        profilePic: 'assests/images/logo/black_transparent_logo.png',
        type: 'image',
        duration: 10000, // 3 seconds for this image
        viewed: false
    }
];

let currentStoryIndex = 0;
let progressInterval;
let videoElement = null;

// Create story elements
function createStories() {
    const container = document.getElementById('storiesContainer');
    stories.forEach((story, index) => {
        const storyElement = document.createElement('div');
        storyElement.className = `story ${story.viewed ? 'viewed' : ''}`;
        storyElement.innerHTML = `
            <div class="story-border">
                <div class="story-img-container">
                    <img class="story-img" src="${story.profilePic}" alt="${story.username}'s story">
                </div>
            </div>
            <div class="username">${story.username}</div>
        `;
        storyElement.addEventListener('click', (e) => {
            const rect = storyElement.getBoundingClientRect();
            const clickX = (rect.left + rect.right) / 2;
            const clickY = (rect.top + rect.bottom) / 2;
            openStory(index, clickX, clickY);
        });
        container.appendChild(storyElement);
    });
}

// Open story modal
function openStory(index, clickX, clickY) {
    currentStoryIndex = index;
    const modal = document.getElementById('storyModal');
    const mediaContainer = document.getElementById('mediaContainer');
    const story = stories[index];
    
    // Set the animation origin point
    modal.style.setProperty('--x', clickX + 'px');
    modal.style.setProperty('--y', clickY + 'px');
    
    modal.style.display = 'block';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('animate-in');
    
    mediaContainer.innerHTML = '';

    if (story.type === 'video') {
        const video = document.createElement('video');
        video.className = 'story-media';
        video.src = story.mediaUrl;
        video.controls = false;
        video.autoplay = true;
        videoElement = video;
        mediaContainer.appendChild(video);
        
        video.addEventListener('loadedmetadata', function() {
            const duration = Math.min(video.duration * 1000, story.duration);
            startProgress(duration);
        });
        
        video.addEventListener('ended', () => {
            nextStory();
        });

        video.addEventListener('error', () => {
            startProgress(story.duration);
        });
    } else {
        const img = document.createElement('img');
        img.className = 'story-media';
        img.src = story.mediaUrl;
        mediaContainer.appendChild(img);
        startProgress(story.duration);
    }

    markAsViewed(index);
}

// Start progress bar animation
function startProgress(duration) {
    const progress = document.getElementById('progress');
    clearInterval(progressInterval);
    
    progress.style.transition = 'none';
    progress.style.transform = 'scaleX(0)';
    
    // Force reflow
    progress.offsetHeight;
    
    progress.style.transition = `transform ${duration}ms linear`;
    progress.style.transform = 'scaleX(1)';

    progressInterval = setTimeout(() => {
        nextStory();
    }, duration);
}

function nextStory() {
    if (currentStoryIndex < stories.length - 1) {
        openStory(currentStoryIndex + 1);
    } else {
        closeModal();
    }
}

// Mark story as viewed
function markAsViewed(index) {
    stories[index].viewed = true;
    const storyElements = document.querySelectorAll('.story');
    storyElements[index].classList.add('viewed');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('storyModal');
    modal.classList.remove('animate-in');
    modal.classList.add('animate-out');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('animate-out');
        clearInterval(progressInterval);
        if (videoElement) {
            videoElement.pause();
            videoElement = null;
        }
    }, 300);
}

// Navigation
document.querySelector('.prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentStoryIndex > 0) {
        const storyElement = document.querySelectorAll('.story')[currentStoryIndex - 1];
        const rect = storyElement.getBoundingClientRect();
        openStory(currentStoryIndex - 1, (rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);
    }
});

document.querySelector('.next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentStoryIndex < stories.length - 1) {
        const storyElement = document.querySelectorAll('.story')[currentStoryIndex + 1];
        const rect = storyElement.getBoundingClientRect();
        openStory(currentStoryIndex + 1, (rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);
    } else {
        closeModal();
    }
});

// Close modal when clicking close button
document.querySelector('.close-btn').addEventListener('click', closeModal);

// Initialize stories
createStories();