// Navegación suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animaciones al hacer scroll
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.visibility = 'visible';
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.visibility = 'hidden';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease, visibility 0.6s ease';
    observer.observe(element);
});

// Datos de la galería de proyectos
const galleryData = {
    project1: {
        title: "The Game - Juego de Cartas Multijugador",
        images: [
            "img/projects/the-game/main.jpg",
            "img/projects/the-game/lobby.jpg",
            "img/projects/the-game/gameplay.jpg",
            "img/projects/the-game/mobile.jpg"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "Node.js", "WebSockets", "Render", "Neon"]
    },
    project2: {
        title: "Sistema de Gestión Hospitalaria",
        images: [
            "img/projects/hospital/dashboard.jpg",
            "img/projects/hospital/patients.jpg",
            "img/projects/hospital/reports.jpg"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "MySQL", "cPanel", "Node.js", "Composer"]
    },
    project3: {
        title: "Evaluaciones Psicológicas",
        images: [
            "img/projects/evaluations/test.jpg",
            "img/projects/evaluations/results.jpg",
            "img/projects/evaluations/admin.jpg"
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "MySQL", "PHP"]
    }
};

// Variables del modal
const modal = document.getElementById('galleryModal');
const modalTitle = document.getElementById('modal-title');
const galleryContainer = document.querySelector('.gallery-container');
const imageCounter = document.querySelector('.image-counter');
const closeModal = document.querySelector('.close-modal');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentProject = null;
let currentImageIndex = 0;

// Función para actualizar la galería
function updateGallery() {
    if (!currentProject || currentProject.images.length === 0) return;

    const img = document.createElement('img');
    img.src = currentProject.images[currentImageIndex];
    img.alt = `${currentProject.title} - Imagen ${currentImageIndex + 1}`;
    img.loading = 'eager';

    // Limpiar contenedor y añadir nueva imagen
    galleryContainer.innerHTML = '';
    galleryContainer.appendChild(img);

    // Actualizar contador
    imageCounter.textContent = `${currentImageIndex + 1}/${currentProject.images.length}`;

    // Actualizar estado de los botones
    prevBtn.style.opacity = currentImageIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentImageIndex === currentProject.images.length - 1 ? '0.5' : '1';
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === currentProject.images.length - 1;
}

// Abrir modal
document.querySelectorAll('.gallery-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const projectId = this.getAttribute('data-project');
        if (galleryData[projectId]) {
            currentProject = galleryData[projectId];
            currentImageIndex = 0;

            modalTitle.textContent = currentProject.title;
            updateGallery();

            // Mostrar modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;

            // Enfocar el modal para navegación por teclado
            modal.setAttribute('aria-hidden', 'false');
            modal.focus();
        }
    });
});

// Cerrar modal
function closeGallery() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
    modal.setAttribute('aria-hidden', 'true');
}

closeModal.addEventListener('click', closeGallery);

// Cerrar al hacer clic fuera del modal
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeGallery();
    }
});

// Navegación de imágenes
prevBtn.addEventListener('click', () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateGallery();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentImageIndex < currentProject.images.length - 1) {
        currentImageIndex++;
        updateGallery();
    }
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        switch (e.key) {
            case 'ArrowLeft':
                if (currentImageIndex > 0) {
                    currentImageIndex--;
                    updateGallery();
                }
                break;
            case 'ArrowRight':
                if (currentImageIndex < currentProject.images.length - 1) {
                    currentImageIndex++;
                    updateGallery();
                }
                break;
            case 'Escape':
                closeGallery();
                break;
        }
    }
});

// Precargar imágenes para mejor experiencia
function preloadImages() {
    Object.values(galleryData).forEach(project => {
        project.images.forEach(imgSrc => {
            const img = new Image();
            img.src = imgSrc;
        });
    });
}

// Mejorar hover de botones
function setupButtonHoverEffects() {
    document.querySelectorAll('.btn, .gallery-btn, .prev-btn, .next-btn').forEach(btn => {
        // Guardar el color original
        const originalBg = btn.style.backgroundColor;
        const originalTransform = btn.style.transform;

        btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '1';
            btn.style.transform = originalTransform || 'translateY(-3px)';
            btn.style.backgroundColor = originalBg;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.opacity = btn.disabled ? '0.5' : '1';
            btn.style.transform = originalTransform || 'translateY(0)';
            btn.style.backgroundColor = originalBg;
        });
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    setupButtonHoverEffects();

    // Forzar repintado en elementos animados para evitar bugs
    requestAnimationFrame(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.willChange = 'opacity, transform';
        });
    });
});

// Manejar cambios de tamaño para evitar desbordamientos
window.addEventListener('resize', () => {
    if (modal.style.display === 'block') {
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }
});