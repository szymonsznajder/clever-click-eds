const HERO_CONFIG = {
  SLIDE_INTERVAL: 9000,
  SELECTORS: {
    SLIDE: '.hero-slide',
    CONTENT: '.hero-content',
    NAVIGATION: '.hero-navigation',
    PREV: '.hero-prev',
    NEXT: '.hero-next',
    DOTS: '.hero-dots',
    DOT: '.hero-dot',
    ACTIVE: 'active',
  },
  CLASSES: {
    SLIDE: 'hero-slide',
    CONTENT: 'hero-content',
    NAVIGATION: 'hero-navigation',
    PREV: 'hero-prev',
    NEXT: 'hero-next',
    DOTS: 'hero-dots',
    DOT: 'hero-dot',
    ACTIVE: 'active',
  },
  ARIA_LABELS: {
    SLIDE: 'Go to slide',
  },
};

class HeroCarousel {
  constructor(element) {
    this.element = element;
    this.slides = [...element.querySelectorAll(HERO_CONFIG.SELECTORS.SLIDE)];
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
    nav.className = HERO_CONFIG.CLASSES.NAVIGATION;

    const dots = document.createElement('div');
    dots.className = HERO_CONFIG.CLASSES.DOTS;

    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = HERO_CONFIG.CLASSES.DOT;
      dot.setAttribute('aria-label', `${HERO_CONFIG.ARIA_LABELS.SLIDE} ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      dots.appendChild(dot);
    });

    nav.appendChild(dots);
    this.element.appendChild(nav);
  }

  updateSlides() {
    this.slides.forEach((slide, index) => {
      const isActive = index === this.currentIndex;
      slide.setAttribute('aria-hidden', !isActive);
      slide.style.zIndex = isActive ? '1' : '0';
    });

    const dots = this.element.querySelectorAll(HERO_CONFIG.SELECTORS.DOT);
    dots.forEach((dot, index) => {
      dot.classList.toggle(HERO_CONFIG.CLASSES.ACTIVE, index === this.currentIndex);
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
    this.interval = setInterval(() => this.nextSlide(), HERO_CONFIG.SLIDE_INTERVAL);
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
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';

  [...block.children].forEach((row) => {
    const slide = document.createElement('div');
    slide.className = HERO_CONFIG.CLASSES.SLIDE;

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
      content.className = HERO_CONFIG.CLASSES.CONTENT;
      content.innerHTML = contentCol.innerHTML;
      slide.appendChild(content);
    }

    wrapper.appendChild(slide);
  });

  block.textContent = '';
  block.appendChild(wrapper);

  const carousel = new HeroCarousel(wrapper);
  return carousel;
}
