const CONFIG = {
  ROTATION_INTERVAL: 5000, // 5 seconds between rotations
  CLASSNAMES: {
    ACTIVE: 'active',
    IMAGE: 'imagecycle-image',
    DOTS: 'imagecycle-dots',
    DOT: 'imagecycle-dot',
  },
};

/**
 * Creates the image cycle structure
 * @param {Array} images - Array of image URLs
 * @returns {Object} - DOM elements for the image cycle
 */
function createImageCycle(images) {
  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.className = CONFIG.CLASSNAMES.IMAGE;

  // Create and append images
  const imageElements = images.map((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Slide ${index + 1}`;
    img.className = index === 0 ? CONFIG.CLASSNAMES.ACTIVE : '';
    imageContainer.appendChild(img);
    return img;
  });

  // Create navigation dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = CONFIG.CLASSNAMES.DOTS;

  const dots = images.map((_, index) => {
    const dot = document.createElement('button');
    dot.className = `${CONFIG.CLASSNAMES.DOT} ${index === 0 ? CONFIG.CLASSNAMES.ACTIVE : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dotsContainer.appendChild(dot);
    return dot;
  });

  return { imageContainer, dotsContainer, imageElements, dots };
}

/**
 * Handles the rotation of images
 * @param {Array} images - Array of image elements
 * @param {Array} dots - Array of dot elements
 * @param {number} currentIndex - Current active index
 * @returns {number} - Next index
 */
function rotateImages(images, dots, currentIndex) {
  const nextIndex = (currentIndex + 1) % images.length;
  
  // Update images
  images[currentIndex].classList.remove(CONFIG.CLASSNAMES.ACTIVE);
  images[nextIndex].classList.add(CONFIG.CLASSNAMES.ACTIVE);
  
  // Update dots
  dots[currentIndex].classList.remove(CONFIG.CLASSNAMES.ACTIVE);
  dots[nextIndex].classList.add(CONFIG.CLASSNAMES.ACTIVE);
  
  return nextIndex;
}

/**
 * Decorates the image cycle block
 * @param {Element} block - The block element to decorate
 */
export default async function decorate(block) {
  // Extract images from table rows
  const images = [...block.querySelectorAll('tr')].slice(1)
    .map((row) => {
      const img = row.querySelector('img');
      return img ? img.src : null;
    })
    .filter(Boolean);

  // Remove the original table
  block.textContent = '';

  // Create image cycle elements
  const { imageContainer, dotsContainer, imageElements, dots } = createImageCycle(images);
  
  // Append elements to block
  block.appendChild(imageContainer);
  block.appendChild(dotsContainer);

  let currentIndex = 0;
  let intervalId = null;

  // Start rotation
  const startRotation = () => {
    intervalId = setInterval(() => {
      currentIndex = rotateImages(imageElements, dots, currentIndex);
    }, CONFIG.ROTATION_INTERVAL);
  };

  // Stop rotation
  const stopRotation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // Event listeners
  imageContainer.addEventListener('mouseenter', stopRotation);
  imageContainer.addEventListener('mouseleave', () => {
    currentIndex = rotateImages(imageElements, dots, currentIndex);
    startRotation();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!block.contains(document.activeElement)) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      stopRotation();
      
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      } else {
        currentIndex = (currentIndex + 1) % images.length;
      }
      
      rotateImages(imageElements, dots, (currentIndex - 1 + images.length) % images.length);
      startRotation();
    }
  });

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopRotation();
      rotateImages(imageElements, dots, currentIndex);
      currentIndex = index;
      startRotation();
    });
  });

  // Initialize rotation
  startRotation();
} 