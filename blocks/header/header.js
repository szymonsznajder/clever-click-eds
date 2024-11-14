/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const HEADER_CONFIG = {
  BREAKPOINTS: {
    DESKTOP: '(min-width: 900px)',
  },
  CLASSES: {
    SCROLL_UP: 'scroll-up',
    SCROLL_DOWN: 'scroll-down',
    NAV_DROP: 'nav-drop',
    ACTIVE: 'active',
  },
  SELECTORS: {
    NAV: '#nav',
    NAV_SECTIONS: '.nav-sections',
    BUTTON_CONTAINER: '.button-container',
  },
  ASSETS: {
    LOGO: '/prompt-master/images/fasCmsLogo.svg',
    LOGO_ALT: 'FAS CMS Logo',
  },
  ARIA_LABELS: {
    OPEN_NAV: 'Open navigation',
    CLOSE_NAV: 'Close navigation',
  },
};

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia(HEADER_CONFIG.BREAKPOINTS.DESKTOP);

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');

  if (!expanded) {
    document.body.style.overflow = 'hidden';
    nav.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Close navigation');
  } else {
    document.body.style.overflow = '';
    nav.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
  }

  if (expanded) {
    toggleAllNavSections(navSections, false);
  }

  if (!expanded) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Handle escape key navigation
 * @param {KeyboardEvent} e - Keyboard event
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector(HEADER_CONFIG.SELECTORS.NAV_SECTIONS);
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');

    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector(HEADER_CONFIG.SELECTORS.NAV_SECTIONS);
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function initHeaderScroll() {
  let lastScroll = 0;
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.classList.remove('scroll-up');
      return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
      header.classList.remove('scroll-up');
      header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
      header.classList.remove('scroll-down');
      header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
  });
}

/**
 * Decorate the header block
 * @param {HTMLElement} block - The header block element
 */
export default async function decorate(block) {
  try {
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    const fragment = await loadFragment(navPath);

    block.textContent = '';
    const nav = document.createElement('nav');
    nav.id = 'nav';
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const navBrand = nav.querySelector('.nav-brand');
    if (navBrand) {
      const brandLink = navBrand.querySelector('.button');
      if (brandLink) {
        const logoImg = document.createElement('img');
        logoImg.src = HEADER_CONFIG.ASSETS.LOGO;
        logoImg.alt = HEADER_CONFIG.ASSETS.LOGO_ALT;

        const textSpan = document.createElement('span');
        textSpan.textContent = brandLink.textContent;

        brandLink.textContent = '';
        brandLink.appendChild(logoImg);
        brandLink.appendChild(textSpan);

        brandLink.className = '';
        brandLink.closest(HEADER_CONFIG.SELECTORS.BUTTON_CONTAINER).className = '';
      }
    }

    const navSections = nav.querySelector(HEADER_CONFIG.SELECTORS.NAV_SECTIONS);
    if (navSections) {
      navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add(HEADER_CONFIG.CLASSES.NAV_DROP);
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
    }

    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');

    toggleMenu(nav, navSections, false);

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    initHeaderScroll();

    const currentPath = window.location.pathname;
    navSections.querySelectorAll('a').forEach((link) => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add(HEADER_CONFIG.CLASSES.ACTIVE);
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error decorating header:', error);
  }
}
