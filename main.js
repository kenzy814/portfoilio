/**
 * Kenzy Mandour - Personal Portfolio Website
 * Vanilla JavaScript (Zero External Dependencies)
 * Features: Mobile drawer navigation, active link scroll spy, sticky navbar effect,
 *           copy-to-clipboard toast notifications, and interactive form feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. DOM Elements ---
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');
  const toastContainer = document.getElementById('toastContainer');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const currentYearSpan = document.getElementById('currentYear');

  // Set copyright year dynamically
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- 2. Mobile Menu Drawer Navigation ---
  function openMobileMenu() {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-active');
    mobileBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-active');
    mobileBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('is-active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-active')) {
        closeMobileMenu();
      }
    });
  });

  // Close mobile menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('is-active')) {
      closeMobileMenu();
    }
  });

  // --- 3. Navbar Sticky Effect on Scroll ---
  function handleNavbarScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  // --- 4. Scroll Spy (Active Navigation Link Highlighting) ---
  function highlightActiveNavLink() {
    // If scrolled to the bottom of the page, highlight the last section (Contact)
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
      navLinks.forEach(link => link.classList.remove('active'));
      const contactLink = document.querySelector('.nav-link[href="#contact"]');
      if (contactLink) contactLink.classList.add('active');
      return;
    }

    const scrollPosition = window.scrollY + 140; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
  highlightActiveNavLink(); // Initial check

  // --- 5. Back to Top Button ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 6. Toast Notification Helper ---
  function showToast(message, duration = 3200) {
    if (!toastContainer) return;

    // Check for existing toast and remove if needed
    const existingToast = toastContainer.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    // Force browser reflow to trigger transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode === toastContainer) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- 7. Copy-to-Clipboard Functionality ---
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Item';

      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for non-https or older browsers
          const tempInput = document.createElement('textarea');
          tempInput.value = textToCopy;
          tempInput.style.position = 'fixed';
          tempInput.style.left = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.focus();
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Visual feedback on button
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        showToast(`${label} copied to clipboard!`);

        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);

      } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy to clipboard.');
      }
    });
  });

  // --- 8. Contact Form Client-Side Validation & Feedback ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Simple validation
      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields (Name, Email, Message).', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Success feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        showFormMessage('Thank you, Kenzy has received your message! (Direct email option: kenzy.mandour@outlook.com)', 'success');
        showToast('Message sent successfully!');
        contactForm.reset();
      }, 1000);
    });
  }

  function showFormMessage(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `form-status-msg ${type}`;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
