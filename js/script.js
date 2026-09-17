document.addEventListener("DOMContentLoaded", () => {
    
    // --- Preloader Logic ---
    const preloader = document.getElementById('theme-preloader');
    let animationsTriggered = false;

    window.startThemeAnimations = function() {
        if(animationsTriggered) return;
        animationsTriggered = true;

        // 1. GSAP Header Reveal (if header exists by now)
        if (typeof gsap !== 'undefined' && document.querySelector('header')) {
            gsap.from("header .top-bar", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
            gsap.from("header .navbar", { y: -50, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
        }

        // 2. Dynamic AOS Attributes
        const fadeUpElements = document.querySelectorAll('.product-card, .feature-box, .category-item, .blog-card, .testimonial-card, .contact-info-card, .branch-card, .mission-card, .team-card');
        fadeUpElements.forEach((el, index) => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (index % 4) * 100);
        });

        const fadeRightElements = document.querySelectorAll('.section-title, .about-story img');
        fadeRightElements.forEach(el => el.setAttribute('data-aos', 'fade-right'));
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
            });
        }

        // 3. GSAP Animation for Hero Slider
        if (typeof gsap !== 'undefined' && document.querySelector('.heroSwiper')) {
            const animateSlide = (activeSlide) => {
                const title = activeSlide.querySelector('.hero-title');
                const subtitle = activeSlide.querySelector('.hero-subtitle');
                const btn = activeSlide.querySelector('.hero-btn');

                if(title && subtitle && btn) {
                    gsap.set([title, subtitle, btn], { opacity: 0, y: 50 });
                    gsap.to(title, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
                    gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
                    gsap.to(btn, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: "back.out(1.7)" });
                }
            };

            if(window.heroSwiperInstance) {
                window.heroSwiperInstance.on('slideChangeTransitionStart', function () {
                    const activeSlide = this.slides[this.activeIndex];
                    animateSlide(activeSlide);
                });
                animateSlide(window.heroSwiperInstance.slides[window.heroSwiperInstance.activeIndex]);
            }
        }

        // 4. GSAP Animation for Page Banners
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

        // 5. Apply ThreeJS to either Home page hero slider or inner pages banner
        const heroSlider = document.querySelector('.hero-slider');
        const pageBanner = document.querySelector('.page-banner');
        if (heroSlider) initThreeJS(heroSlider);
        if (pageBanner) initThreeJS(pageBanner);
    };

    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger animations AFTER preloader is completely gone
                    window.startThemeAnimations();
                }, 500); // Wait for transition
            }, 2000); // 2 second delay
        });
    } else {
        // Fallback if no preloader is found on the page
        window.startThemeAnimations();
    }


    // --- Load Header ---
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

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
            
            // If animations were already triggered (no preloader), run header animation now
            if(animationsTriggered && typeof gsap !== 'undefined') {
                gsap.from("header .top-bar", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
                gsap.from("header .navbar", { y: -50, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
            }
        });

    // --- Load Footer ---
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
                    window.scrollTo({ top: 0, behavior: "smooth" });
                });
            }
        });

    // --- Counter / Deal of the Day Logic ---
    if (document.getElementById('days')) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3); // 3 days from now
        
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

    // --- Three.js Floating Particles Setup ---
    const initThreeJS = (containerElement) => {
        if (!containerElement || typeof THREE === 'undefined') return;

        const canvasContainer = document.createElement('div');
        canvasContainer.id = "three-canvas-container-" + Math.floor(Math.random()*1000);
        canvasContainer.style.position = "absolute";
        canvasContainer.style.top = "0";
        canvasContainer.style.left = "0";
        canvasContainer.style.width = "100%";
        canvasContainer.style.height = "100%";
        canvasContainer.style.zIndex = "1"; 
        canvasContainer.style.pointerEvents = "none"; 
        
        if(window.getComputedStyle(containerElement).position === 'static') {
            containerElement.style.position = 'relative';
        }
        containerElement.appendChild(canvasContainer);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / containerElement.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, containerElement.clientHeight);
        canvasContainer.appendChild(renderer.domElement);

        const geometry = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount * 3; i+=3) {
            positions[i] = (Math.random() - 0.5) * 20; 
            positions[i+1] = (Math.random() - 0.5) * 20; 
            positions[i+2] = (Math.random() - 0.5) * 20; 
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() * 0.02) + 0.01,
                z: (Math.random() - 0.5) * 0.02
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x28a745, 
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        camera.position.z = 5;

        const animate = function () {
            requestAnimationFrame(animate);
            const positions = particles.geometry.attributes.position.array;
            
            for(let i = 0; i < particleCount; i++) {
                let idx = i * 3;
                positions[idx] += velocities[i].x;   
                positions[idx+1] += velocities[i].y; 
                positions[idx+2] += velocities[i].z; 

                if(positions[idx+1] > 10) {
                    positions[idx+1] = -10;
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.002;
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            if(containerElement) {
                camera.aspect = window.innerWidth / containerElement.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, containerElement.clientHeight);
            }
        });
    };

});
