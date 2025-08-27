document.addEventListener("DOMContentLoaded", () => {
  let theme = "light";
  let activeSection = "home";

  // Default theme is now 'dark'
  const savedTheme = localStorage.getItem("theme") || "dark";
  
  theme = savedTheme;
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
  updateThemeIcon();

  // Custom cursor
  const cursor = document.createElement("div");
  const cursorFollower = document.createElement("div");
  cursor.className = "cursor";
  cursorFollower.className = "cursor-follower";
  document.body.appendChild(cursor);
  document.body.appendChild(cursorFollower);

  let mouseX = 0,
    mouseY = 0;
  let followerX = 0,
    followerY = 0;

  const updateCursor = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  };

  const updateFollower = () => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX - 20 + "px";
    cursorFollower.style.top = followerY - 20 + "px";
    requestAnimationFrame(updateFollower);
  };

  document.addEventListener("mousemove", updateCursor);
  updateFollower();

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", toggleTheme);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    theme = newTheme;
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const themeIcon = document.getElementById("theme-icon");
    themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
  }
  
  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right").forEach((el) => {
    observer.observe(el);
  });

  // Navigation scroll spy
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const updateActiveSection = () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    activeSection = current;
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveSection);
  updateActiveSection();

  // Navigation click handlers
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.getAttribute("data-section");
      scrollToSection(sectionId);
    });
  });

  // Create particles
  createParticles();

  function createParticles() {
    const particlesContainer = document.querySelector(".particles");
    if (!particlesContainer) return;
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.width = Math.random() * 4 + 2 + "px";
      particle.style.height = particle.style.width;
      particle.style.animationDelay = Math.random() * 20 + "s";
      particle.style.animationDuration = Math.random() * 15 + 10 + "s";
      particlesContainer.appendChild(particle);
    }
  }

    // Lightbox logic
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox .close");
  const images = document.querySelectorAll(".gallery-image");

  images.forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "block";
      lightboxImg.src = img.src;
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
  
  // Form submission
  const contactForm = document.querySelector(".contact-form");
  const submitButton = contactForm.querySelector("button[type='submit']");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending...';

      const formData = new FormData(contactForm);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      };
      
      fetch('/api/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error) });
        }
        return response.json();
      })
      .then(result => {
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification(`Failed to send message: ${error.message}`, 'error');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
    });
  }

  // Scroller Logic
  const scrollers = document.querySelectorAll(".scroller");

  function addAnimation() {
      scrollers.forEach((scroller) => {
          scroller.setAttribute("data-animated", true);
          const scrollerInner = scroller.querySelector(".scroller__inner");
          const scrollerContent = Array.from(scrollerInner.children);
          scrollerContent.forEach((item) => {
              const duplicatedItem = item.cloneNode(true);
              duplicatedItem.setAttribute("aria-hidden", true);
              scrollerInner.appendChild(duplicatedItem);
          });
      });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.fonts.ready.then(() => {
          addAnimation();
      });
  }
  
  // Mobile cursor/nav handling
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      cursor.style.display = "none";
      cursorFollower.style.display = "none";
    } else {
      cursor.style.display = "block";
      cursorFollower.style.display = "block";
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  // Custom Notification Function
  function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
      console.error('Notification container not found!');
      return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <p>${message}</p>
      <button class="close-btn">&times;</button>
    `;

    notificationContainer.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('hide');
      notification.addEventListener('transitionend', () => {
        notification.remove();
      });
    }, 5000);

    // Close button functionality
    notification.querySelector('.close-btn').addEventListener('click', () => {
      notification.classList.add('hide');
      notification.addEventListener('transitionend', () => {
        notification.remove();
      });
    });
  }
});
