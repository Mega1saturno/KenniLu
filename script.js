// ============ CONFIGURACIÓN GLOBAL ============
const config = {
  autoCarousel: true,
  carouselInterval: 5000,
  animationDuration: 300,
  enableDarkMode: true,
  enableCursorEffects: true
};

// ============ CURSOR PERSONALIZADO ============
if (config.enableCursorEffects) {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    // Suavizar movimiento del punto
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    
    // Suavizar movimiento del contorno
    outlineX += (mouseX - outlineX) * 0.1;
    outlineY += (mouseY - outlineY) * 0.1;
    
    // Aplicar transformaciones
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    cursorOutline.style.transform = `translate(${outlineX}px, ${dotY}px)`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Efectos de hover
  const hoverElements = document.querySelectorAll('a, button, .product-card, .gallery-item');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform += ' scale(1.5)';
      cursorOutline.style.transform += ' scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = cursorDot.style.transform.replace(' scale(1.5)', '');
      cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', '');
    });
  });
}

// ============ HEADER SCROLL EFFECT ============
const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Header sticky con efecto
  if (scrollTop > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Efecto de ocultar/mostrar header al hacer scroll
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    // Scroll hacia abajo
    header.style.transform = 'translateY(-100%)';
  } else {
    // Scroll hacia arriba
    header.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = scrollTop;
});

// ============ TOGGLE DARK MODE ============
if (config.enableDarkMode) {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Verificar preferencia del sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });
}

// ============ CARRUSEL MEJORADO ============
class Carousel {
  constructor() {
    this.track = document.getElementById('carousel-track');
    this.dotsContainer = document.getElementById('carousel-dots');
    this.prevBtn = document.querySelector('.carousel-btn-prev');
    this.nextBtn = document.querySelector('.carousel-btn-next');
    this.slides = [];
    this.dots = [];
    this.currentIndex = 0;
    this.interval = null;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    // Crear slides con datos
    this.createSlides();
    
    // Crear dots
    this.createDots();
    
    // Event listeners
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    
    // Auto-play
    if (config.autoCarousel) {
      this.startAutoPlay();
      
      // Pausar al hacer hover
      this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.track.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    // Touch events para móviles
    this.addTouchEvents();

    // Ajustar carrusel al redimensionar o rotar pantalla
    window.addEventListener('resize', () => {
      this.updateTrackWidth();
      this.goToSlide(this.currentIndex);
    });
  }
  
  createSlides() {
    const products = [
      {
        id: 1,
        name: 'Taza Premium Cerámica',
        description: 'Alta calidad con diseño a todo color',
        price: 'Q50',
        image: 'img/taza.jpg',
       
        category: 'tazas',
        badge: 'Más Vendido'
      },
      {
        id: 2,
        name: 'Termo Acero Inoxidable',
        description: 'Mantiene temperatura por 12 horas',
        price: 'Q75',
        image: 'img/termo.jpg',
        category: 'termos',
        badge: 'Nuevo'
      },
      {
        id: 3,
        name: 'Playera Algodón Premium',
        description: '100% algodón, impresión duradera',
        price: 'Q100',
        image: 'img/playera.jpg',
        category: 'textiles',
        badge: 'Oferta'
      },
      {
        id: 4,
        name: 'Gorra Deportiva',
        description: 'Ajustable, diseño frontal y lateral',
        price: 'Q65',
        image: 'img/gorra.jpg',
        category: 'otros',
        badge: 'Popular'
      },
      {
        id: 5,
        name: 'Pachón Térmico',
        description: 'Doble pared, diseño mate premium',
        price: 'Q100',
        image: 'img/termo.jpg',
        category: 'termos',
        badge: 'Exclusivo'
      },
      {
        id: 6,
        name: 'Set de 4 Tazas',
        description: 'Perfecto para regalos corporativos o personales',
        price: 'Q180',
        image: 'img/tazas.jpg',
        category: 'tazas',
        badge: 'Combo'
      }
    ];
    
    // Generar slides HTML
    products.forEach((product, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.dataset.index = index;
      slide.dataset.category = product.category;
      
      slide.innerHTML = `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>` : ''}
            <button class="product-quick-view" data-id="${product.id}">
              <i class="fas fa-eye"></i>
            </button>
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">${product.price}</span>
              <button class="btn-action whatsapp-btn"
  data-name="${product.name}"
  data-price="${product.price}"
  data-category="${product.category}">
  <i class="fab fa-whatsapp"></i>
  Comprar por WhatsApp
</button>

            </div>
          </div>
        </div>
      `;
      
      this.track.appendChild(slide);
      this.slides.push(slide);
    });
    
    // Actualizar ancho del track
    this.updateTrackWidth();
  }
  
  createDots() {
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    });
  }
  
  updateTrackWidth() {
    // Calcular ancho basado en el contenedor padre, no en el slide mismo
    const containerWidth = this.track.parentElement.offsetWidth;
    
    // Determinar cuántos items mostrar según el ancho de pantalla
    let itemsPerView = 3;
    if (window.innerWidth < 992) itemsPerView = 2;
    if (window.innerWidth < 576) itemsPerView = 1;
    
    const slideWidth = containerWidth / itemsPerView;
    
    // Aplicar ancho explícito a cada slide y al track
    this.slides.forEach(slide => slide.style.width = `${slideWidth}px`);
    this.track.style.width = `${slideWidth * this.slides.length}px`;
  }
  
  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    
    this.isAnimating = true;
    const slideWidth = this.slides[0].offsetWidth;
    
    // Actualizar índice
    this.currentIndex = index;
    
    // Mover track
    this.track.style.transform = `translateX(-${slideWidth * index}px)`;
    
    // Actualizar dots
    this.dots.forEach(dot => dot.classList.remove('active'));
    this.dots[index].classList.add('active');
    
    // Reset animación
    setTimeout(() => {
      this.isAnimating = false;
    }, config.animationDuration);
  }
  
  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.interval = setInterval(() => this.next(), config.carouselInterval);
  }
  
  stopAutoPlay() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  addTouchEvents() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoPlay();
    });
    
    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      // Mover track durante el drag
      if (Math.abs(diff) > 10) {
        const slideWidth = this.slides[0].offsetWidth;
        const offset = (slideWidth * this.currentIndex) + diff;
        this.track.style.transform = `translateX(-${offset}px)`;
      }
    });
    
    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diff = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      } else {
        // Volver a posición original
        this.goToSlide(this.currentIndex);
      }
      
      if (config.autoCarousel) {
        setTimeout(() => this.startAutoPlay(), 3000);
      }
    });
  }
}

// ============ FILTROS DE PRODUCTOS ============
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remover clase active de todos los botones
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Agregar clase active al botón clickeado
    button.classList.add('active');
    
    const filter = button.dataset.filter;
    
    // Filtrar productos
    productCards.forEach(card => {
      const productCategory = card.closest('.carousel-slide').dataset.category;
      
      if (filter === 'all' || productCategory === filter) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// ============ ANIMACIÓN DE NÚMEROS ============
function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const duration = 2000; // 2 segundos
  const increment = target / (duration / 16); // 60fps
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

// Observador de intersección para animaciones
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animar números
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(number => animateCounter(number));
      
      // Animar elementos con clase animate-on-scroll
      const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach(el => {
        el.classList.add('animated');
      });
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar secciones
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// ============ FORMULARIO DE CONTACTO ============
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const submitBtn = contactForm.querySelector('.btn-submit');
  const submitText = document.getElementById('submit-text');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validación básica
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--danger)';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (!isValid) {
      // Efecto de shake
      contactForm.classList.add('shake');
      setTimeout(() => contactForm.classList.remove('shake'), 500);
      return;
    }
    
    // Cambiar estado del botón
    submitBtn.disabled = true;
    submitText.textContent = 'Enviando...';
    
    // Busca esta parte en tu script.js y asegúrate que use "contactForm"
try {
  const response = await fetch('https://formspree.io/f/mvzkkkkz', {
    method: 'POST',
    body: new FormData(contactForm), // <--- CAMBIADO: Antes decía newsletterForm
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    showNotification('¡Solicitud enviada con éxito! Te contactaremos pronto.', 'success');
    contactForm.reset();
  } else {
    showNotification('Ocurrió un error. Inténtalo de nuevo.', 'error');
  }
} catch (error) {
  showNotification('Error de conexión. Revisa tu internet.', 'error');
} finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Enviar Solicitud';
    }
  });
}

// ============ NOTIFICACIONES ============
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    <span>${message}</span>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;
  
  document.body.appendChild(notification);
  
  // Animación de entrada
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Cerrar notificación
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto cerrar después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ============ MENÚ MÓVIL ============
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// ============ WHATSAPP FLOAT ============
const whatsappFloat = document.querySelector('.whatsapp-float');

if (whatsappFloat) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      whatsappFloat.classList.add('visible');
    } else {
      whatsappFloat.classList.remove('visible');
    }
  });
}

// ============ PRELOADER ============
window.addEventListener('load', () => {
  // Simular carga de recursos
  setTimeout(() => {
    document.body.classList.add('loaded');
    
    // Inicializar carrusel
    if (document.getElementById('carousel-track')) {
      new Carousel();
    }
    
    // Mostrar animación de bienvenida
    showNotification('¡Bienvenido a KennyLu!', 'info');
  }, 1000);
});

// ============ ANIMACIONES CSS ADICIONALES ============
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: rotate(45deg) translateY(0); }
    50% { transform: rotate(45deg) translateY(-20px); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  .shake {
    animation: shake 0.5s ease-in-out;
  }
  
  .cursor-dot {
    width: 8px;
    height: 8px;
    background-color: var(--primary);
    border-radius: 50%;
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s;
  }
  
  .cursor-outline {
    width: 30px;
    height: 30px;
    border: 2px solid var(--primary);
    border-radius: 50%;
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.2s;
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(150%);
    transition: transform 0.3s ease;
    z-index: 9999;
    max-width: 350px;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification-success {
    border-left: 4px solid var(--success);
  }
  
  .notification-info {
    border-left: 4px solid var(--info);
  }
  
  .notification-close {
    background: none;
    border: none;
    color: var(--medium-gray);
    cursor: pointer;
    margin-left: auto;
  }
  
  .whatsapp-float {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #25D366;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: var(--shadow-lg);
    text-decoration: none;
    transform: translateY(100px);
    transition: all 0.3s ease;
    z-index: 999;
  }
  
  .whatsapp-float.visible {
    transform: translateY(0);
  }
  
  .whatsapp-float:hover {
    background-color: #128C7E;
    transform: scale(1.1) translateY(0);
  }
  
  .product-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: var(--secondary);
    color: white;
    padding: 5px 10px;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .product-badge.más-vendido { background: var(--danger); }
  .product-badge.nuevo { background: var(--success); }
  .product-badge.oferta { background: var(--warning); }
  .product-badge.exclusivo { background: var(--primary); }
  .product-badge.combo { background: linear-gradient(45deg, var(--primary), var(--secondary)); }
  
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .nav-menu {
      position: fixed;
      top: 80px;
      left: 0;
      width: 100%;
      background: white;
      flex-direction: column;
      padding: var(--space-lg);
      box-shadow: var(--shadow-lg);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .nav-menu.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .nav-list {
      flex-direction: column;
      width: 100%;
    }
    
    .btn-menu {
      display: flex;
    }
    
    .hero-container {
      grid-template-columns: 1fr;
      text-align: center;
    }
    
    .hero-image-container {
      transform: none;
    }
    
    .hero-stats {
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .cursor-dot,
    .cursor-outline {
      display: none;
    }
  }
`;

document.head.appendChild(style);

// ============ SCROLL SUAVE MEJORADO ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const headerHeight = header.offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Actualizar enlace activo
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    this.classList.add('active');
  });
});

// ============ GALERÍA CON LIGHTBOX ============
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <div class="lightbox-content">
    <button class="lightbox-close"><i class="fas fa-times"></i></button>
    <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
    <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
    <img src="" alt="" class="lightbox-image">
    <div class="lightbox-caption"></div>
  </div>
`;

document.body.appendChild(lightbox);

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('h3').textContent,
  caption: item.querySelector('p').textContent
}));

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    openLightbox(index);
  });
});

function openLightbox(index) {
  currentImageIndex = index;
  const imageData = galleryImages[index];
  
  lightbox.querySelector('.lightbox-image').src = imageData.src;
  lightbox.querySelector('.lightbox-image').alt = imageData.alt;
  lightbox.querySelector('.lightbox-caption').textContent = imageData.caption;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
  currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
  const imageData = galleryImages[currentImageIndex];
  
  lightbox.querySelector('.lightbox-image').src = imageData.src;
  lightbox.querySelector('.lightbox-image').alt = imageData.alt;
  lightbox.querySelector('.lightbox-caption').textContent = imageData.caption;
}

// Event listeners para lightbox
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

// Cerrar lightbox con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
    navigateLightbox(-1);
  } else if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
    navigateLightbox(1);
  }
});

// Cerrar lightbox al hacer clic fuera
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// ============ INICIALIZACIÓN FINAL ============
document.addEventListener('DOMContentLoaded', () => {
  console.log('SubliMaster Web - Cargada con éxito!');
  
  // Agregar clase loaded después de un breve retraso
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});


// ============ MANEJO DE FORMULARIOS (CONTACTO Y NEWSLETTER) ============

// ============ NEWSLETTER FORM ============
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const navBtn = this.querySelector('button');
        const originalBtnHTML = navBtn.innerHTML;
        navBtn.disabled = true;
        navBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch('https://formspree.io/f/mvzkkkkz', {
                method: 'POST',
                body: new FormData(newsletterForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showNotification('¡Gracias por suscribirte!', 'success');
                newsletterForm.reset();
            } else {
                showNotification('Error al enviar. Inténtalo de nuevo.', 'error');
            }
        } catch (error) {
            showNotification('Error de conexión.', 'error');
        } finally {
            navBtn.disabled = false;
            navBtn.innerHTML = originalBtnHTML;
        }
    });
}

// ============ COMPRA POR WHATSAPP ============
const WHATSAPP_NUMBER = "47408104"; // 👈 CAMBIA ESTE NÚMERO

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".whatsapp-btn");
  if (!btn) return;

  const name = btn.dataset.name;
  const price = btn.dataset.price;
  const category = btn.dataset.category;

  const message = `
Hola 👋, estoy interesado en este producto:

🛍️ Producto: ${name}
📦 Categoría: ${category}
💰 Precio: ${price}

¿Me podrías dar más información?
  `.trim();

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});


