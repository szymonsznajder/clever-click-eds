const CONFIG = {
  SLIDE_INTERVAL: 9000,
  SELECTORS: {
    SLIDE: '.hero-slide',
    CONTENT: '.hero-content',
    NAVIGATION: '.hero-navigation',
    PREV: '.hero-prev',
    NEXT: '.hero-next',
    DOTS: '.hero-dots',
    DOT: '.hero-dot',
    ACTIVE: 'active'
  },
  CLASSES: {
    SLIDE: 'hero-slide',
    CONTENT: 'hero-content',
    NAVIGATION: 'hero-navigation',
    PREV: 'hero-prev',
    NEXT: 'hero-next',
    DOTS: 'hero-dots',
    DOT: 'hero-dot',
    ACTIVE: 'active'
  }
};

class HeroCarousel {
  constructor(element) {
    this.element = element;
    this.slides = [...element.querySelectorAll(CONFIG.SELECTORS.SLIDE)];
    this.currentIndex = 0;
    this.interval = null;
    
    this.init();
  }

  init() {
    this.createNavigation();
    this.startAutoPlay();
    this.addEventListeners();
    this.updateSlides();
  }

  createNavigation() {
    const nav = document.createElement('div');
    nav.className = CONFIG.CLASSES.NAVIGATION;

    // Create dots
    const dots = document.createElement('div');
    dots.className = CONFIG.CLASSES.DOTS;
    
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = CONFIG.CLASSES.DOT;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      dots.appendChild(dot);
    });

    nav.appendChild(dots);
    this.element.appendChild(nav);
  }

  updateSlides() {
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.currentIndex);
      slide.style.zIndex = index === this.currentIndex ? '1' : '0';
    });

    // Update dots
    const dots = this.element.querySelectorAll(CONFIG.SELECTORS.DOT);
    dots.forEach((dot, index) => {
      dot.classList.toggle(CONFIG.CLASSES.ACTIVE, index === this.currentIndex);
    });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlides();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlides();
  }

  startAutoPlay() {
    this.interval = setInterval(() => this.nextSlide(), CONFIG.SLIDE_INTERVAL);
  }

  stopAutoPlay() {
    clearInterval(this.interval);
  }

  addEventListeners() {
    this.element.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.element.addEventListener('mouseleave', () => this.startAutoPlay());
  }
}

export default function decorate(block) {
  // Create wrapper for slides
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';

  // Process each row as a slide
  [...block.children].forEach((row) => {
    const slide = document.createElement('div');
    slide.className = CONFIG.CLASSES.SLIDE;

    // Get image and content from columns
    const [imageCol, contentCol] = row.children;
    
    if (imageCol) {
      const picture = imageCol.querySelector('picture');
      if (picture) {
        picture.className = 'hero-background';
        slide.appendChild(picture);
      }
    }

    if (contentCol) {
      const content = document.createElement('div');
      content.className = CONFIG.CLASSES.CONTENT;
      content.innerHTML = contentCol.innerHTML;
      slide.appendChild(content);
    }

    wrapper.appendChild(slide);
  });

  // Clear and update block content
  block.textContent = '';
  block.appendChild(wrapper);

  // Initialize carousel
  new HeroCarousel(wrapper);
}
  