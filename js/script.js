// Variables globales
let menuVisible = false;
let darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) { }


// DOM Ready - Inicializar todas las funcionalidades cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar tema
    initTheme();

    // Inicializar animaciones
    initAnimations();

    // Inicializar efectos de texto
    initTextEffects();

    // Inicializar filtros de portfolio
    initPortfolioFilters();

    // Inicializar timeline
    initTimelineFilters();

    // Inicializar particles.js si existe el elemento
    if (document.getElementById('particles-js')) {
        initParticles();
    }

    // Inicializar formulario de contacto
    initContactForm();

    // Inicializar smooth scroll
    initSmoothScroll();

    // Inicializa cerrar modal
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('cerrar-mensaje')) {
            cerrarModal();
        }
    });
});



// Función para manejar el menú en dispositivos móviles
function mostrarOcultarMenu() {
    const nav = document.getElementById("nav");
    menuVisible = !menuVisible;

    if (menuVisible) {
        nav.classList.add("responsive");
        // Desactivar scroll cuando el menú está abierto
        document.body.style.overflow = 'hidden';
    } else {
        nav.classList.remove("responsive");
        // Reactivar scroll
        document.body.style.overflow = '';
    }
}

// Función para seleccionar item del menú y cerrar el menú móvil
function seleccionar() {
    const nav = document.getElementById("nav");
    nav.classList.remove("responsive");
    menuVisible = false;
    document.body.style.overflow = '';
}

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', function (event) {
    const nav = document.getElementById("nav");
    const navResponsive = document.querySelector(".nav-responsive");

    if (menuVisible && !nav.contains(event.target) && !navResponsive.contains(event.target)) {
        seleccionar();
    }
});

// Cerrar menú al redimensionar la ventana
window.addEventListener('resize', function () {
    if (window.innerWidth > 650 && menuVisible) {
        seleccionar();
    }
});

// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('.contenedor-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll para los enlaces
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

// Inicializar tema oscuro/claro
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Aplicar tema guardado
    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Manejar cambio de tema
    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        darkMode = !darkMode;

        // Actualizar icono
        if (darkMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }

        // Guardar preferencia
        localStorage.setItem('darkMode', darkMode);
    });
}


// Función para animaciones con ScrollTrigger
function initAnimations() {
    // Configurar GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animar secciones al hacer scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.fromTo(section.querySelector('.section-title'),
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });



    // Animación de habilidades técnicas
    const techSkills = document.querySelectorAll('.technical-skill .skill');
    techSkills.forEach(skill => {
        gsap.fromTo(skill,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                scrollTrigger: {
                    trigger: '.technical-skill',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Detectar scroll para aplicar efectos en habilidades profesionales
    window.addEventListener('scroll', function () {
        efectoHabilidades();
    });
}

// Función para efecto de habilidades profesionales
function efectoHabilidades() {
    const skills = document.getElementById("skills");
    if (!skills) return;

    const distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;

    if (distancia_skills >= 300) {
        // Para habilidades profesionales (con clase progreso)
        const habilidadesPro = document.querySelectorAll(".barra-skill .progreso");

        habilidadesPro.forEach((habilidad, index) => {
            setTimeout(() => {
                const porcentaje = habilidad.getAttribute("data-progress") + "%";
                habilidad.style.width = porcentaje;
                habilidad.classList.add("animada");

                // Hacer visible y animar el span del porcentaje
                const spanPorcentaje = habilidad.querySelector("span");
                if (spanPorcentaje) {
                    spanPorcentaje.classList.add("visible");
                }
            }, index * 200);
        });

        // Para habilidades técnicas (con clase skill-level)
        const habilidadesTech = document.querySelectorAll(".skill .skill-level");

        habilidadesTech.forEach((habilidad, index) => {
            setTimeout(() => {
                const porcentaje = habilidad.textContent;
                // Agregar clase para animar la aparición
                habilidad.parentElement.style.setProperty('--skill-level', porcentaje);
                habilidad.classList.add("visible");
            }, index * 150);
        });
    }
}

// Ejecutar cuando se hace scroll y al cargar la página
window.addEventListener("scroll", efectoHabilidades);
window.addEventListener("load", efectoHabilidades);

// Inicializar efectos de texto animado
function initTextEffects() {
    // Efecto de typing para la profesión
    const TxtRotate = function (el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtRotate.prototype.tick = function () {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        const that = this;
        let delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function () {
            that.tick();
        }, delta);
    };

    // Iniciar todos los elementos con efecto de typing
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    // Efecto glitch para logo
    const glitchEffect = document.querySelector('.glitch-effect');
    if (glitchEffect) {
        glitchEffect.addEventListener('mouseover', function () {
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 1000);
        });
    }
}

// Inicializar filtros de portfolio
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const proyectos = document.querySelectorAll('.proyecto');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Quitar clase activa de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Añadir clase activa al botón clickeado
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filtrar proyectos
            proyectos.forEach(proyecto => {
                if (filterValue === 'all' || proyecto.getAttribute('data-category') === filterValue) {
                    gsap.to(proyecto, { opacity: 1, scale: 1, duration: 0.3, display: 'block' });
                } else {
                    gsap.to(proyecto, { opacity: 0, scale: 0.8, duration: 0.3, display: 'none' });
                }
            });
        });
    });
}

// Inicializar filtros de timeline
function initTimelineFilters() {
    const timelineButtons = document.querySelectorAll('.timeline-btn');
    const timelineBlocks = document.querySelectorAll('.timeline-block');

    timelineButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Quitar clase activa de todos los botones
            timelineButtons.forEach(b => b.classList.remove('active'));
            // Añadir clase activa al botón clickeado
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filtrar timeline
            timelineBlocks.forEach(block => {
                if (filterValue === 'all' || block.classList.contains(filterValue)) {
                    gsap.to(block, { opacity: 1, height: 'auto', duration: 0.5, display: 'block' });
                } else {
                    gsap.to(block, { opacity: 0, height: 0, duration: 0.5, display: 'none' });
                }
            });
        });
    });
}

// Inicializar particles.js
function initParticles() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#3498db"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#3498db",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

// Inicializar formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Deshabilitar botón de envío para prevenir múltiples envíos
        const btnSend = document.getElementById("btnSend");
        btnSend.disabled = true;
        btnSend.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';

        // Obtener valores del formulario
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("body").value.trim();

        // Validar todos los campos
        if (name === "" || email === "" || subject === "" || message === "") {
            mostrarMensajeError("Todos los campos son obligatorios. Por favor, complétalos antes de enviar.");
            resetSubmitButton(btnSend);
            return;
        }

        // Validar formato de email
        if (!validateEmail(email)) {
            mostrarMensajeError("Por favor ingresa un correo electrónico válido.");
            resetSubmitButton(btnSend);
            return;
        }

        // Parámetros del formulario para EmailJS
        const templateParams = { name, email, subject, message };

        // Enviar el correo usando EmailJS
        emailjs.send("service_4c7iwjg", "template_2j1g0ll", templateParams, "4MPN96F_QEHwXHkNZ")
            .then(function (response) {
                console.log("Correo enviado con éxito", response);
                mostrarMensajeExito();
                contactForm.reset(); // Limpia el formulario tras envío exitoso
                resetSubmitButton(btnSend);
            })
            .catch(function (error) {
                console.error("Error al enviar el correo", error);
                mostrarMensajeError("Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo más tarde.");
                resetSubmitButton(btnSend);
            });
    });
}

// Función para restablecer el botón de envío
function resetSubmitButton(button) {
    button.disabled = false;
    button.innerHTML = 'Enviar Mensaje <i class="fa-solid fa-paper-plane"></i><span class="overlay"></span>';
}

// Validar formato de email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito() {
    const mensajeContainer = document.getElementById("mensaje-container");
    mensajeContainer.innerHTML = `
        <div class="mensaje-modal">
            <div class="mensaje-header">
                <i class="fas fa-check-circle"></i>
                <h3>Mensaje enviado</h3>
            </div>
            <div class="mensaje-body">
                <p>Gracias por contactarme. Me pondré en contacto contigo lo antes posible.</p>
            </div>
            <div class="mensaje-footer">
                <button class="cerrar-mensaje">Cerrar</button>
            </div>
        </div>
    `;

    // Mostrar el modal con animación
    setTimeout(() => {
        mensajeContainer.className = "mensaje-container mensaje-success active";
    }, 10);

    // Agregar evento de clic al botón cerrar que acabamos de crear
    const cerrarBtn = mensajeContainer.querySelector('.cerrar-mensaje');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', cerrarModal);
    }

    // Auto cerrar después de 5 segundos
    setTimeout(cerrarModal, 5000);
}

// Función para mostrar mensaje de error
function mostrarMensajeError(mensaje) {
    const mensajeContainer = document.getElementById("mensaje-container");
    mensajeContainer.innerHTML = `
        <div class="mensaje-modal">
            <div class="mensaje-header">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error</h3>
            </div>
            <div class="mensaje-body">
                <p>${mensaje}</p>
            </div>
            <div class="mensaje-footer">
                <button class="cerrar-mensaje">Cerrar</button>
            </div>
        </div>
    `;

    // Mostrar el modal con animación
    setTimeout(() => {
        mensajeContainer.className = "mensaje-container mensaje-error active";
    }, 10);

    // Agregar evento de clic al botón cerrar que acabamos de crear
    const cerrarBtn = mensajeContainer.querySelector('.cerrar-mensaje');
    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', cerrarModal);
    }
}

// Función para cerrar el modal
function cerrarModal() {
    const mensajeContainer = document.getElementById("mensaje-container");
    if (mensajeContainer) {
        mensajeContainer.classList.remove("active");

        // Esperar a que termine la animación antes de limpiar el contenido
        setTimeout(() => {
            if (mensajeContainer) {
                mensajeContainer.className = "mensaje-container";
                mensajeContainer.innerHTML = "";
            }
        }, 300);
    }
}

// Opcional: Cerrar el modal al hacer clic fuera del mensaje
document.addEventListener('click', function (e) {
    const mensajeContainer = document.getElementById("mensaje-container");
    if (!mensajeContainer) return;

    const mensajeModal = document.querySelector(".mensaje-modal");

    if (mensajeContainer.classList.contains("active")) {
        // Si el clic fue en el contenedor (fondo oscuro) pero no en el modal
        if (e.target === mensajeContainer && (!mensajeModal || !mensajeModal.contains(e.target))) {
            cerrarModal();
        }
    }
});

let currentLang = localStorage.getItem('lang') || 'es';
const langBtn = document.getElementById('btn-language');
let translations = {};

document.addEventListener('DOMContentLoaded', () => {
    fetch('lang.json')
        .then(res => res.json())
        .then(data => {
            translations = data;
            applyTranslations();
        });

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            localStorage.setItem('lang', currentLang);
            applyTranslations();
        });
    }
});

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Actualiza el texto del botón de idioma
    if (langBtn) langBtn.textContent = currentLang === 'es' ? 'EN' : 'ES';
}