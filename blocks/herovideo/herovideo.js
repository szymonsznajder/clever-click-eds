const HEROVIDEO_CONFIG = {
  CLASSES: {
    CONTENT: 'herovideo-content',
    PLAYER: 'herovideo-player',
    OVERLAY: 'herovideo-overlay',
  },
  VARIATIONS: {
    AUTOPLAY: 'autoplay',
    MUTED: 'muted',
    LOOP: 'loop',
    CONTROLS: 'controls',
  },
  VIDEO: {
    TYPE: 'video/mp4',
  },
  ERROR_MESSAGE: 'Error loading video content',
};

/**
 * Creates a video element with specified attributes
 * @param {HTMLElement} block - The block element to check for variations
 * @returns {HTMLVideoElement} Configured video element
 */
function createVideoElement(block) {
  const video = document.createElement('video');
  video.classList.add(HEROVIDEO_CONFIG.CLASSES.PLAYER);

  // Set default attributes
  const attributes = {
    muted: true,
    autoplay: true,
    loop: true,
    playsInline: true,
    controls: block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.CONTROLS),
  };

  // Override defaults based on variations
  if (!block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.AUTOPLAY)) {
    attributes.autoplay = false;
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.MUTED)) {
    attributes.muted = false;
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.LOOP)) {
    attributes.loop = false;
  }

  // Apply attributes to video element
  Object.entries(attributes).forEach(([key, value]) => {
    video[key] = value;
  });

  return video;
}

/**
 * Decorates the hero video block
 * @param {HTMLElement} block - The hero video block element
 */
export default function decorate(block) {
  try {
    const videoRow = block.children[0];
    if (!videoRow) return;

    const videoWrapper = document.createElement('div');
    videoWrapper.classList.add(HEROVIDEO_CONFIG.CLASSES.CONTENT);

    const video = createVideoElement(block);

    // Add video source
    const videoSource = videoRow.querySelector('a');
    if (videoSource) {
      const source = document.createElement('source');
      source.src = videoSource.href;
      source.type = HEROVIDEO_CONFIG.VIDEO.TYPE;
      video.appendChild(source);
    }

    // Add overlay text if present
    const overlayText = videoRow.children[1];
    if (overlayText) {
      const overlay = document.createElement('div');
      overlay.classList.add(HEROVIDEO_CONFIG.CLASSES.OVERLAY);
      overlay.innerHTML = overlayText.innerHTML;
      videoWrapper.appendChild(overlay);
    }

    videoWrapper.appendChild(video);
    block.textContent = '';
    block.appendChild(videoWrapper);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(HEROVIDEO_CONFIG.ERROR_MESSAGE, error);
  }
}
