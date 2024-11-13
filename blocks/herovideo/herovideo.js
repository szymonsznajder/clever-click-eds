// Configuration object for the hero video block
const HEROVIDEO_CONFIG = {
  AUTOPLAY_CLASS: 'autoplay',
  MUTED_CLASS: 'muted',
  LOOP_CLASS: 'loop',
  CONTROLS_CLASS: 'controls',
  ERROR_MESSAGE: 'Error loading video content',
};

/**
 * Decorates the hero video block
 * @param {HTMLElement} block The hero video block element
 */
export default function decorate(block) {
  // Get the first row which contains video information
  const videoRow = block.children[0];
  if (!videoRow) return;

  // Create video wrapper
  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('herovideo-content');

  // Create video element
  const video = document.createElement('video');
  video.classList.add('herovideo-player');

  // Set default video attributes
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;

  // Check for block variations and apply corresponding settings
  if (block.classList.contains(HEROVIDEO_CONFIG.CONTROLS_CLASS)) {
    video.controls = true;
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.AUTOPLAY_CLASS)) {
    video.autoplay = false;
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.MUTED_CLASS)) {
    video.muted = false;
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.LOOP_CLASS)) {
    video.loop = false;
  }

  // Get video source from the first cell
  const videoSource = videoRow.querySelector('a');
  if (videoSource) {
    const source = document.createElement('source');
    source.src = videoSource.href;
    source.type = 'video/mp4';
    video.appendChild(source);
  }

  // Add overlay text if present in second cell
  const overlayText = videoRow.children[1];
  if (overlayText) {
    const overlay = document.createElement('div');
    overlay.classList.add('herovideo-overlay');
    overlay.innerHTML = overlayText.innerHTML;
    videoWrapper.appendChild(overlay);
  }

  // Add video to wrapper
  videoWrapper.appendChild(video);
  
  // Clear block and add new content
  block.textContent = '';
  block.appendChild(videoWrapper);
} 