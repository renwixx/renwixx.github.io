const bioToggle = document.getElementById('bio-toggle');
const bioExtra = document.getElementById('bio-extra');
const chevronIcon = bioToggle?.querySelector('.chevron-icon');

if (bioToggle && bioExtra && chevronIcon) {
	bioExtra.classList.remove('hidden');

	bioToggle.addEventListener('click', function() {
		const isExpanded = bioExtra.classList.contains('expanded');

		if (isExpanded) {
			bioExtra.style.maxHeight = null;
			bioExtra.classList.remove('expanded');
			chevronIcon.classList.remove('rotated');
		} else {
			bioExtra.style.maxHeight = bioExtra.scrollHeight + 'px';
			bioExtra.classList.add('expanded');
			chevronIcon.classList.add('rotated');
		}
	});
}

const playlist = [{
	"title": "Выйди из комнаты",
	"artist": "ПОРНОФИЛЬМЫ",
	"url": "./KOMNATA.mp3"
}, {
	"title": "ДАНИЛА",
	"artist": "dekma",
	"url": "./DANILA.mp3"
}, {
	"title": "KILL YOUR FAMILY",
	"artist": "dekma",
	"url": "./KILL YOUR FAMILY.mp3"
}];
let currentSongIndex = 0;
let isPlaying = false;
let isMuted = false;
let currentVolume = 0.33;

const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const titleEl = document.getElementById('current-title');
const artistEl = document.getElementById('current-artist');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBtn = document.getElementById('volume-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeFill = document.getElementById('volume-fill');

if (audioPlayer && playlist.length > 0) {
	audioPlayer.volume = currentVolume;
	audioPlayer.src = playlist[0].url;

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return mins + ':' + (secs < 10 ? '0' : '') + secs;
	}

	function updateSongInfo() {
		if (titleEl) titleEl.textContent = playlist[currentSongIndex].title;
		if (artistEl) artistEl.textContent = playlist[currentSongIndex].artist;
	}

	function updateProgress() {
		if (audioPlayer.duration) {
			const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
			if (progressFill) progressFill.style.width = progress + '%';
			if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
		}
	}

	function updateVolume() {
		const volumePercent = currentVolume * 100;
		if (volumeFill) volumeFill.style.width = volumePercent + '%';
		audioPlayer.volume = currentVolume;
		if (volumeBtn) {
			if (isMuted || currentVolume === 0) {
				volumeBtn.innerHTML = '<svg class="icon-music" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1H6L2 5H0V11H2L6 15H8V1Z"/><path d="M9.29289 6.20711L11.0858 8L9.29289 9.79289L10.7071 11.2071L12.5 9.41421L14.2929 11.2071L15.7071 9.79289L13.9142 8L15.7071 6.20711L14.2929 4.79289L12.5 6.58579L10.7071 4.79289L9.29289 6.20711Z"/></svg>';
			} else if (currentVolume < 0.5) {
				volumeBtn.innerHTML = '<svg class="icon-music" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1H6L2 5H0V11H2L6 15H8V1Z"/><path d="M12 8C12 9.10457 11.1046 10 10 10V6C11.1046 6 12 6.89543 12 8Z"/></svg>';
			} else {
				volumeBtn.innerHTML = '<svg class="icon-music" viewBox="0 0 16 16" fill="currentColor"><path d="M6 1H8V15H6L2 11H0V5H2L6 1Z"/><path d="M14 8C14 5.79086 12.2091 4 10 4V2C13.3137 2 16 4.68629 16 8C16 11.3137 13.3137 14 10 14V12C12.2091 12 14 10.2091 14 8Z"/><path d="M12 8C12 9.10457 11.1046 10 10 10V6C11.1046 6 12 6.89543 12 8Z"/></svg>';
			}
		}
	}

	function playPause() {
		if (isPlaying) {
			audioPlayer.pause();
			playBtn.innerHTML = '<svg class="icon-music" viewBox="0 0 16 16" fill="currentColor"><path d="M5 16L7 16L15 8L7 -2.7818e-08L5 0L5 16Z"/></svg>';
			isPlaying = false;
		} else {
			audioPlayer.play().then(() => {
				playBtn.innerHTML = '<svg class="icon-music" viewBox="0 0 16 16" fill="currentColor"><path d="M7 1H2V15H7V1Z"/><path d="M14 1H9V15H14V1Z"/></svg>';
				isPlaying = true;
			}).catch(() => {
				console.error('Failed to play audio');
			});
		}
	}

	function previousSong() {
		currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : playlist.length - 1;
		audioPlayer.src = playlist[currentSongIndex].url;
		updateSongInfo();
		if (isPlaying) {
			audioPlayer.play();
		}
	}

	function nextSong() {
		currentSongIndex = currentSongIndex < playlist.length - 1 ? currentSongIndex + 1 : 0;
		audioPlayer.src = playlist[currentSongIndex].url;
		updateSongInfo();
		if (isPlaying) {
			audioPlayer.play();
		}
	}

	function toggleMute() {
		isMuted = !isMuted;
		audioPlayer.muted = isMuted;
		updateVolume();
	}

	function setupDraggableSlider(sliderElement, onDrag) {
		let isDragging = false;
		const updateValue = (event) => {
			const rect = sliderElement.getBoundingClientRect();
			const value = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
			onDrag(value);
		};
		sliderElement.addEventListener('mousedown', (event) => {
			isDragging = true;
			updateValue(event);
		});
		window.addEventListener('mousemove', (event) => {
			if (isDragging) {
				updateValue(event);
			}
		});
		window.addEventListener('mouseup', () => {
			isDragging = false;
		});
	}
	updateVolume();
	playBtn?.addEventListener('click', playPause);
	prevBtn?.addEventListener('click', previousSong);
	nextBtn?.addEventListener('click', nextSong);
	volumeBtn?.addEventListener('click', toggleMute);
	if (progressBar) {
		setupDraggableSlider(progressBar, (value) => {
			if (audioPlayer.duration) {
				audioPlayer.currentTime = value * audioPlayer.duration;
				updateProgress();
			}
		});
	}
	if (volumeSlider) {
		setupDraggableSlider(volumeSlider, (value) => {
			currentVolume = value;
			isMuted = false;
			audioPlayer.muted = false;
			updateVolume();
		});
	}
	audioPlayer.addEventListener('timeupdate', updateProgress);
	audioPlayer.addEventListener('loadedmetadata', function() {
		if (durationEl) durationEl.textContent = formatTime(audioPlayer.duration);
	});
	audioPlayer.addEventListener('ended', nextSong);
	audioPlayer.addEventListener('error', function() {
		playBtn.innerHTML = '<svg class="icon-music" viewBox="0 0 16 16" fill="currentColor"><path d="M5 16L7 16L15 8L7 -2.7818e-08L5 0L5 16Z"/></svg>';
		isPlaying = false;
		console.error('Audio playback error');
	});
}

const slider = document.querySelector('.portfolio-grid');
const track = document.querySelector('.portfolio-track');

if (slider && track) {
	let isDown = false;
	let startX;
	let positionAtStart;
	let currentPosition = 0;
	let velocity = 0;
	let prevX = 0;
	let animationID;

	const setPosition = (x) => {
		currentPosition = x;
		track.style.transform = `translateX(${x}px)`;
	};

	const start = (e) => {
		isDown = true;
		slider.classList.add('active');
		const currentX = e.pageX || e.touches[0].pageX;
		startX = currentX;

		const transformMatrix = new WebKitCSSMatrix(window.getComputedStyle(track).transform);
		positionAtStart = transformMatrix.m41;

		prevX = currentX;
		velocity = 0;
		cancelAnimationFrame(animationID);

		window.addEventListener('mousemove', move);
		window.addEventListener('touchmove', move);
		window.addEventListener('mouseup', end);
		window.addEventListener('touchend', end);
	};

	const move = (e) => {
		if (!isDown) return;
		e.preventDefault();

		const currentX = e.pageX || e.touches[0].pageX;
		const walk = currentX - startX;
		const newPosition = positionAtStart + walk;

		const deltaX = currentX - prevX;
		velocity = 0.8 * deltaX + 0.2 * velocity;
		prevX = currentX;

		const minPosition = -(track.scrollWidth - slider.clientWidth);

		if (newPosition > 0) {
			const overscroll = newPosition;
			setPosition(overscroll * 0.5);
		} else if (newPosition < minPosition) {
			const overscroll = newPosition - minPosition;
			setPosition(minPosition + overscroll * 0.5);
		} else {
			setPosition(newPosition);
		}
	};

	const end = () => {
		if (!isDown) return;
		isDown = false;
		slider.classList.remove('active');

		const minPosition = -(track.scrollWidth - slider.clientWidth);

		if (currentPosition > 0) {
			springBack(0);
		} else if (currentPosition < minPosition) {
			springBack(minPosition);
		} else {
			momentumScroll();
		}

		window.removeEventListener('mousemove', move);
		window.removeEventListener('touchmove', move);
		window.removeEventListener('mouseup', end);
		window.removeEventListener('touchend', end);
	};

	const momentumScroll = () => {
		const minPosition = -(track.scrollWidth - slider.clientWidth);
		const newPosition = currentPosition + velocity;

		if (newPosition > 0 || newPosition < minPosition) {
			velocity = 0;
			end();
			return;
		}

		if (Math.abs(velocity) < 0.5) return;

		setPosition(newPosition);
		velocity *= 0.8;
		animationID = requestAnimationFrame(momentumScroll);
	};

	const springBack = (target) => {
		const distance = target - currentPosition;
		if (Math.abs(distance) < 1) {
			setPosition(target);
			return;
		}
		setPosition(currentPosition + distance * 0.3);
		animationID = requestAnimationFrame(() => springBack(target));
	};

	slider.addEventListener('mousedown', start);
	slider.addEventListener('touchstart', start, {
		passive: true
	});
}

const cursor = document.getElementById('custom-cursor');

if (cursor) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const smoothing = 0.3; 

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const animate = () => {
    currentX += (targetX - currentX) * smoothing;
    currentY += (targetY - currentY) * smoothing;
    
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    
    requestAnimationFrame(animate);
  };
  animate();
  
  window.addEventListener('mousedown', () => {
    cursor.classList.add('clicked');
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('clicked');
  });
}
