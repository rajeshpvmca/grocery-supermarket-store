document.addEventListener("DOMContentLoaded", () => {
    
    // Load Header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            
            // GSAP Header reveal
            if (typeof gsap !== 'undefined') {
                gsap.from("header .top-bar", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
                gsap.from("header .navbar", { y: -50, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
            }

            // Re-initialize any header scripts
            const mobileMenuBtn = document.querySelector(".navbar-toggler");
            const navbarCollapse = document.querySelector(".navbar-collapse");
            const closeMenuBtn = document.querySelector(".close-menu");

            if (mobileMenuBtn && navbarCollapse) {
                mobileMenuBtn.addEventListener("click", () => {
                    navbarCollapse.classList.add("show");
                });
            }

            if (closeMenuBtn && navbarCollapse) {
                closeMenuBtn.addEventListener("click", () => {
                    navbarCollapse.classList.remove("show");
                });
            }
            
            // Set active class based on current page
            const path = window.location.pathname;
            const page = path.split("/").pop();
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === page || (page === '' && link.getAttribute('href') === 'index.html')) {
                    link.classList.add('active');
                }
            });
        });

    // Load Footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
            
            // Scroll to Top Button Logic
            const scrollTopBtn = document.getElementById("scrollTopBtn");
            if (scrollTopBtn) {
                window.addEventListener("scroll", () => {
                    if (window.scrollY > 300) {
                        scrollTopBtn.style.display = "block";
                    } else {
                        scrollTopBtn.style.display = "none";
                    }
                });

                scrollTopBtn.addEventListener("click", () => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                });
            }
        });

    // Sticky Header
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (header) {
            if (window.scrollY > 150) {
                header.classList.add("fixed-top");
            } else {
                header.classList.remove("fixed-top");
            }
        }
    });

    // Swiper Slider Initialization
    window.heroSwiperInstance = null;
    if (document.querySelector(".heroSwiper")) {
        window.heroSwiperInstance = new Swiper('.heroSwiper', {
            loop: true,
            effect: 'fade',
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // Testimonial Swiper
    if (document.querySelector(".testimonialSwiper")) {
        new Swiper('.testimonialSwiper', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 30 }
            }
        });
    }

    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    if (counters.length > 0) {
        window.addEventListener('scroll', () => {
            const statsSection = document.querySelector('.stats-section');
            if (!statsSection) return;
            
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;

            if (sectionPos < screenPos - 100 && !hasCounted) {
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        
                        // Increment logic
                        const inc = target / 50;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 30);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                hasCounted = true;
            }
        });
    }

    // Deal of the Day Countdown
    const countdownElement = document.querySelector('.countdown');
    if (countdownElement) {
        // Set date to 3 days from now for demo
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            
            if (distance < 0) return;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById("days").innerText = String(days).padStart(2, '0');
            document.getElementById("hours").innerText = String(hours).padStart(2, '0');
            document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
            document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
        };
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // Dynamic AOS Attributes (to avoid cluttering HTML)
    const fadeUpElements = document.querySelectorAll('.product-card, .feature-box, .category-item, .blog-card, .testimonial-card, .contact-info-card, .branch-card, .mission-card, .team-card');
    fadeUpElements.forEach((el, index) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', (index % 4) * 100);
    });

    const fadeRightElements = document.querySelectorAll('.section-title, .about-story img');
    fadeRightElements.forEach(el => el.setAttribute('data-aos', 'fade-right'));
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }

    // GSAP Animation for Hero Slider
    if (typeof gsap !== 'undefined' && document.querySelector('.heroSwiper')) {
        const animateSlide = (activeSlide) => {
            const title = activeSlide.querySelector('.hero-title');
            const subtitle = activeSlide.querySelector('.hero-subtitle');
            const btn = activeSlide.querySelector('.hero-btn');

            if(title && subtitle && btn) {
                // Reset opacity & transform
                gsap.set([title, subtitle, btn], { opacity: 0, y: 50 });
                
                // Animate elements in sequence
                gsap.to(title, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
                gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
                gsap.to(btn, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "back.out(1.7)" });
            }
        };

        // Attach event to swiper if it exists globally
        if(window.heroSwiperInstance) {
            window.heroSwiperInstance.on('slideChangeTransitionStart', function () {
                const activeSlide = this.slides[this.activeIndex];
                animateSlide(activeSlide);
            });
            // initial animation
            animateSlide(window.heroSwiperInstance.slides[window.heroSwiperInstance.activeIndex]);
        }
    }

    // GSAP Animation for Page Banners (About, Shop, Contact)
    if (typeof gsap !== 'undefined') {
        const bannerTitle = document.querySelector('.page-banner h1');
        const bannerDesc = document.querySelector('.page-banner p');
        const breadcrumb = document.querySelector('.page-banner .breadcrumb');
        
        if (bannerTitle && bannerDesc && breadcrumb) {
            gsap.from(bannerTitle, { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
            gsap.from(bannerDesc, { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.4 });
            gsap.from(breadcrumb, { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.6 });
        }
    }

    // Three.js Floating Particles for Backgrounds (Hero Section or Page Banners)
    const initThreeJS = (containerElement) => {
        if (!containerElement || typeof THREE === 'undefined') return;

        // Create canvas container
        const canvasContainer = document.createElement('div');
        canvasContainer.id = "three-canvas-container-" + Math.floor(Math.random()*1000);
        canvasContainer.style.position = "absolute";
        canvasContainer.style.top = "0";
        canvasContainer.style.left = "0";
        canvasContainer.style.width = "100%";
        canvasContainer.style.height = "100%";
        canvasContainer.style.zIndex = "1"; // Between bg and text
        canvasContainer.style.pointerEvents = "none"; // Let clicks pass through
        
        // Ensure container is relative so absolute canvas fits inside
        if(window.getComputedStyle(containerElement).position === 'static') {
            containerElement.style.position = 'relative';
        }
        
        containerElement.appendChild(canvasContainer);

        // ThreeJS setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / containerElement.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, containerElement.clientHeight);
        canvasContainer.appendChild(renderer.domElement);

        // Create particles
        const geometry = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount * 3; i+=3) {
            positions[i] = (Math.random() - 0.5) * 20; // x
            positions[i+1] = (Math.random() - 0.5) * 20; // y
            positions[i+2] = (Math.random() - 0.5) * 20; // z
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() * 0.02) + 0.01,
                z: (Math.random() - 0.5) * 0.02
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create material
        const material = new THREE.PointsMaterial({
            color: 0x28a745, // Primary green color
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        camera.position.z = 5;

        // Animation Loop
        const animate = function () {
            requestAnimationFrame(animate);
            
            const positions = particles.geometry.attributes.position.array;
            
            for(let i = 0; i < particleCount; i++) {
                let idx = i * 3;
                positions[idx] += velocities[i].x;     // x
                positions[idx+1] += velocities[i].y;   // y
                positions[idx+2] += velocities[i].z;   // z

                // Reset position if it goes too high
                if(positions[idx+1] > 10) {
                    positions[idx+1] = -10;
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            if(containerElement) {
                camera.aspect = window.innerWidth / containerElement.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, containerElement.clientHeight);
            }
        });
    };

    // Apply ThreeJS to either Home page hero slider or inner pages banner
    const heroSlider = document.querySelector('.hero-slider');
    const pageBanner = document.querySelector('.page-banner');
    
    if (heroSlider) initThreeJS(heroSlider);
    if (pageBanner) initThreeJS(pageBanner);

});
