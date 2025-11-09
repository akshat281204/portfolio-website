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

  // Custom tilt
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;  // tilt range
      const rotateX = ((y / rect.height) - 0.5) * -10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  });

  // Custom tilt for project cards
  const tiltTargets = document.querySelectorAll(".card, .project-card");

    tiltTargets.forEach(card => {
      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      });
    });

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

// 3D model initialization (portrait-taller setup)
// 3D model initialization (portrait-taller setup)
const canvas = document.getElementById("aboutModel");
if (!canvas) return;

const scene = new THREE.Scene();

// Transparent renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setClearColor(0x000000, 0); // transparent
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Camera (taller + thinner framing)
const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.4, 3);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(3, 10, 10);
scene.add(dirLight);

// Load model
const loader = new THREE.GLTFLoader();
loader.load(
  "/static/models/mymodel.glb",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(1.6, 1.6, 1.6);
    model.position.set(0, -1, 0); 
    scene.add(model);
    
    // --- REVISED TRIANGLE SETUP: Mint Green Color ---
    
    const MINT_GREEN_HEX = 0x43c59e; // Your --primary color

    const triangleGeometry = new THREE.ConeGeometry(0.08, 0.18, 3); 
    
    // Set material to Mint Green
    const triangleMaterial = new THREE.MeshStandardMaterial({ 
        color: MINT_GREEN_HEX, 
        emissive: MINT_GREEN_HEX, 
        emissiveIntensity: 3.0 // Keep brightness high
    }); 
    const floatingTriangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
    floatingTriangle.rotation.x = Math.PI; 
    
    const triangleGroup = new THREE.Group();
    triangleGroup.position.set(0, 0, 0.5); 
    scene.add(triangleGroup); 

    const TRIANGLE_BASE_Y = 2.09; 
    floatingTriangle.position.set(0, TRIANGLE_BASE_Y, 0); 
    triangleGroup.add(floatingTriangle); 
    
    // Set light to Mint Green
    const triangleLight = new THREE.PointLight(MINT_GREEN_HEX, 1.5, 4); 
    triangleLight.position.set(0, TRIANGLE_BASE_Y + 0.1, 0);
    triangleGroup.add(triangleLight); 

    const mixer = new THREE.AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) {
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }

    // Back-and-forth rotation setup
    let rotationSpeed = 0.007;
    let direction = 1;
    const maxRotation = Math.PI / 2;
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixer.update(delta);

      // Model sway
      model.rotation.y += rotationSpeed * direction;
      if (model.rotation.y > maxRotation || model.rotation.y < -maxRotation) {
        direction *= -1;
      }

      // Triangle bounce & rotation
      const elapsed = clock.getElapsedTime();
      
      // CHANGE 4: Decrease bounce amplitude from 0.08 to 0.05
      floatingTriangle.position.y = TRIANGLE_BASE_Y + Math.sin(elapsed * 3) * 0.05; 
      
      triangleGroup.rotation.y += 0.015;

      // Light follows
      triangleLight.position.set(floatingTriangle.position.x, floatingTriangle.position.y + 0.05, floatingTriangle.position.z);

      renderer.render(scene, camera);
    }

    animate();

    // Adjust on resize
    window.addEventListener("resize", () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
  },
  xhr => {
    console.log(`Model loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
  },
  error => {
    console.error("Failed to load model:", error);
  }
);

// ====================== TYPING EFFECT FOR NAME ==========================
const nameElement = document.getElementById("typed-name");

if (nameElement) {
  const text = "Akshat Agarwal";
  const typingSpeed = 120;
  let index = 0;

  function typeLetter() {
    if (index < text.length) {
      nameElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeLetter, typingSpeed);
    } else {
      // cursor stays, no extra actions needed
    }
  }

  setTimeout(typeLetter, 500);
} else {
  console.error("typed-name element not found!");
}

// ====================== 3D GitHub Computer ==========================
const githubCanvas = document.getElementById("githubModel");
if (githubCanvas) {
  const githubScene = new THREE.Scene();

  const githubRenderer = new THREE.WebGLRenderer({ canvas: githubCanvas, alpha: true, antialias: true });
  githubRenderer.setSize(githubCanvas.clientWidth, githubCanvas.clientHeight);
  githubRenderer.setPixelRatio(window.devicePixelRatio);
  githubRenderer.setClearColor(0x000000, 0); // transparent

  const githubCamera = new THREE.PerspectiveCamera(45, githubCanvas.clientWidth / githubCanvas.clientHeight, 0.1, 100);
  githubCamera.position.set(0, 0.8, 2.8);
  githubCamera.lookAt(0, 0, 0);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 1.2);
  hemiLight.position.set(0, 10, 0);
  githubScene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(5, 10, 5);
  githubScene.add(dirLight);

  const loader = new THREE.GLTFLoader();
  loader.load(
    "/static/models/Computer.glb",
    function (gltf) {
      const githubModel = gltf.scene;

      // --- Float and scale the model ---
      githubModel.scale.set(2.2, 2, 2.2);
      githubModel.position.set(0, -0.2, 0);
      githubModel.rotation.set(-0.05, Math.PI / 2, 0);

      // --- Add GitHub texture to screen ---
      githubModel.traverse((child) => {
        if (child.isMesh && child.name === "Computer1_Screen001_0") {
          const githubTexture = new THREE.TextureLoader().load("/static/images/github-screen.png");
          child.material = new THREE.MeshBasicMaterial({ map: githubTexture });
        }
      });

      githubScene.add(githubModel);

      // --- Back-and-forth sway ---
      let rotationSpeed = 0.007;
      let direction = 1;
      const maxRotation = Math.PI / 8;
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        githubModel.rotation.y += rotationSpeed * direction;
        if (githubModel.rotation.y > Math.PI / 2 + maxRotation || githubModel.rotation.y < Math.PI / 2 - maxRotation) {
          direction *= -1;
        }
        githubRenderer.render(githubScene, githubCamera);
      }
      animate();

      // --- Click opens GitHub ---
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      githubCanvas.addEventListener("click", (event) => {
        const rect = githubCanvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, githubCamera);
        const intersects = raycaster.intersectObject(githubModel, true);
        if (intersects.length > 0) {
          window.open("https://github.com/akshat281204", "_blank");
        }
      });

      // --- Responsive ---
      window.addEventListener("resize", () => {
        const width = githubCanvas.clientWidth;
        const height = githubCanvas.clientHeight;
        githubRenderer.setSize(width, height);
        githubCamera.aspect = width / height;
        githubCamera.updateProjectionMatrix();
      });
    },
    xhr => console.log(`GitHub model loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`),
    error => console.error("Failed to load GitHub model:", error)
  );
}
});