(function() {

    /* ====================
    Preloader
    ======================= */
    window.onload = function () {
        window.setTimeout(fadeout, 300);
    }

    function fadeout() {
        document.querySelector('.preloader').style.opacity = '0';
        document.querySelector('.preloader').style.display = 'none';
    }

    /* ====================
    Sticky Header & Scroll to Top - FIXED VERSION
    ======================= */
    let lastScrollTop = 0;
    const header = document.querySelector(".header");
    const navbarHeight = 100;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Sticky header - selalu tetap di atas saat scroll
        if (scrollTop > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Hanya hide/show navbar jika di mobile untuk pengalaman yang lebih baik
        if (window.innerWidth > 991) {
            // Untuk desktop: hide saat scroll down, show saat scroll up
            if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                header.classList.add("hidden");
            } else {
                header.classList.remove("hidden");
            }
        }
        
        lastScrollTop = scrollTop;

        // Show or hide the back-to-top button
        const backToTo = document.querySelector(".scroll-top");
        if (scrollTop > 300) {
            backToTo.style.display = "flex";
        } else {
            backToTo.style.display = "none";
        }
        
        // Update active nav link
        updateActiveNavLink();
    });

    /* ====================
    Navbar Active State Management
    ======================= */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-item a.page-scroll');
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = '';
        
        // Reset semua active class
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Cari section yang sedang aktif
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Set active class ke nav link yang sesuai
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        // Special handling untuk home section
        const homeLink = document.querySelector('a[href="#home"]');
        if (scrollPosition < 100) {
            // Di paling atas, set home sebagai aktif
            homeLink.classList.add('active');
        } else if (currentSection !== 'home') {
            // Jika tidak di home section, hapus active class dari home
            homeLink.classList.remove('active');
        }
    }

    /* ====================
    Navbar Toggler - FIXED VERSION
    ======================= */
    document.addEventListener('DOMContentLoaded', function() {
        const navbarToggler = document.querySelector(".navbar-toggler");
        const navbarCollapse = document.querySelector(".navbar-collapse");
        
        // Inisialisasi navbar state
        updateActiveNavLink();
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle class active untuk hamburger icon
                this.classList.toggle("active");
                
                // Toggle class show untuk navbar menu
                navbarCollapse.classList.toggle("show");
                
                // Prevent body scroll ketika navbar terbuka di mobile
                if (navbarCollapse.classList.contains('show')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Close navbar when clicking on nav links
        document.querySelectorAll(".navbar-nav .page-scroll").forEach(link => {
            link.addEventListener("click", function(e) {
                // Untuk smooth scrolling, biarkan event default
                if (window.innerWidth <= 991) {
                    const navbarToggler = document.querySelector(".navbar-toggler");
                    const navbarCollapse = document.querySelector(".navbar-collapse");
                    
                    if (navbarToggler && navbarCollapse) {
                        navbarToggler.classList.remove("active");
                        navbarCollapse.classList.remove('show');
                        document.body.style.overflow = 'auto';
                    }
                }
            });
        });
        
        // Close navbar when clicking outside
        document.addEventListener('click', function(e) {
            const navbarToggler = document.querySelector(".navbar-toggler");
            const navbarCollapse = document.querySelector(".navbar-collapse");
            
            if (navbarCollapse && navbarCollapse.classList.contains('show') && 
                !e.target.closest('.navbar') && 
                !e.target.closest('.navbar-toggler')) {
                navbarToggler.classList.remove("active");
                navbarCollapse.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Auto close on scroll untuk mobile
        window.addEventListener('scroll', function() {
            const navbarToggler = document.querySelector(".navbar-toggler");
            const navbarCollapse = document.querySelector(".navbar-collapse");
            
            if (window.innerWidth <= 991 && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.classList.remove("active");
                navbarCollapse.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            const navbarToggler = document.querySelector(".navbar-toggler");
            const navbarCollapse = document.querySelector(".navbar-collapse");
            
            // Jika resize ke desktop, pastikan navbar terbuka dan reset state
            if (window.innerWidth > 991) {
                if (navbarCollapse) {
                    navbarCollapse.classList.remove('show');
                }
                if (navbarToggler) {
                    navbarToggler.classList.remove('active');
                }
                document.body.style.overflow = 'auto';
            }
        });
    });

    /* ====================
    Smooth Scrolling dengan Offset untuk Fixed Header
    ======================= */
    document.addEventListener('DOMContentLoaded', function() {
        // Smooth scrolling untuk semua link dengan hash
        document.querySelectorAll('a.page-scroll').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                
                // Skip untuk link tanpa target
                if (targetId === '#' || !targetId.startsWith('#')) return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Hitung offset berdasarkan tinggi header
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL tanpa reload page
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        location.hash = targetId;
                    }

                    // Update active nav link setelah scroll
                    setTimeout(() => {
                        updateActiveNavLink();
                    }, 500);

                    // Close mobile navbar if open
                    if (window.innerWidth <= 991) {
                        const navbarCollapse = document.querySelector(".navbar-collapse");
                        const navbarToggler = document.querySelector(".navbar-toggler");
                        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                            navbarToggler.classList.remove('active');
                            navbarCollapse.classList.remove('show');
                            document.body.style.overflow = 'auto';
                        }
                    }
                }
            });
        });

        // Scroll to top functionality
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Update URL
                if (history.pushState) {
                    history.pushState(null, null, '#home');
                }
                
                // Update active nav link ke home
                setTimeout(() => {
                    updateActiveNavLink();
                }, 500);
            });
        }
    });

    /* ====================
    Article Modal Functionality - FIXED VERSION
    ======================= */
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize modal functionality
        initModalFunctionality();

        function initModalFunctionality() {
            const readMoreButtons = document.querySelectorAll('.btn-read-more');
            const modalCloseButtons = document.querySelectorAll('.modal-close');
            const modalOverlays = document.querySelectorAll('.modal-overlay');
            const articleCards = document.querySelectorAll('.article-card');
            
            console.log('Modal initialization started');
            console.log('Read more buttons:', readMoreButtons.length);
            console.log('Article cards:', articleCards.length);
            console.log('Modal close buttons:', modalCloseButtons.length);
            console.log('Modal overlays:', modalOverlays.length);

            // Buka modal dari tombol "Baca Selengkapnya"
            readMoreButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Read more button clicked');
                    
                    const articleId = this.getAttribute('data-article');
                    const modal = document.getElementById(`modal-${articleId}`);
                    
                    if (modal) {
                        console.log('Opening modal:', `modal-${articleId}`);
                        modal.style.display = 'flex';
                        setTimeout(() => {
                            modal.classList.add('active');
                        }, 10);
                        document.body.style.overflow = 'hidden';
                    } else {
                        console.error('Modal not found:', `modal-${articleId}`);
                    }
                });
            });

            // Buka modal dari klik card (kecuali tombol)
            articleCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    // Jangan buka modal jika yang diklik adalah tombol
                    if (!e.target.closest('.btn-read-more')) {
                        e.preventDefault();
                        console.log('Article card clicked');
                        
                        const articleId = this.getAttribute('data-article');
                        const modal = document.getElementById(`modal-${articleId}`);
                        
                        if (modal) {
                            console.log('Opening modal from card:', `modal-${articleId}`);
                            modal.style.display = 'flex';
                            setTimeout(() => {
                                modal.classList.add('active');
                            }, 10);
                            document.body.style.overflow = 'hidden';
                        }
                    }
                });
            });
            
            // Fungsi tutup modal
            function closeAllModals() {
                console.log('Closing all modals');
                const modals = document.querySelectorAll('.article-modal');
                modals.forEach(modal => {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                });
                document.body.style.overflow = 'auto';
            }
            
            // Tutup modal dengan tombol close
            modalCloseButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Close button clicked');
                    closeAllModals();
                });
            });
            
            // Tutup modal dengan klik overlay
            modalOverlays.forEach(overlay => {
                overlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Overlay clicked');
                    closeAllModals();
                });
            });

            // Tutup modal dengan ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    console.log('ESC key pressed');
                    closeAllModals();
                }
            });

            // Prevent modal content click from closing modal
            document.querySelectorAll('.modal-container').forEach(container => {
                container.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            });
        }

        /* ====================
        Contact Form Handling
        ======================= */
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validasi form sederhana
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                if (!name || !email || !message) {
                    showNotification('Harap lengkapi semua field yang wajib diisi!', 'error');
                    return;
                }
                
                // Validasi email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Format email tidak valid!', 'error');
                    return;
                }
                
                // Simulasi pengiriman form
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.innerHTML = '<i class="lni lni-spinner-alt spinning"></i> Mengirim...';
                submitButton.disabled = true;
                
                // Simulasi delay pengiriman
                setTimeout(() => {
                    showNotification('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.');
                    this.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 2000);
            });
        }

        // Fungsi untuk menampilkan notifikasi
        function showNotification(message, type = 'success') {
            // Hapus notifikasi sebelumnya jika ada
            const existingNotification = document.querySelector('.custom-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            // Buat elemen notifikasi
            const notification = document.createElement('div');
            notification.className = `custom-notification ${type === 'error' ? 'error' : ''}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="lni ${type === 'error' ? 'lni-warning' : 'lni-checkmark-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animasi masuk
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Animasi keluar setelah 3 detik
            setTimeout(() => {
                notification.style.transform = 'translateX(150%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        }

        // Tambahkan style untuk spinner dan notifikasi
        const style = document.createElement('style');
        style.textContent = `
            .lni-spinner-alt.spinning {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .custom-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                max-width: 300px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .custom-notification.error {
                background: #dc3545;
            }
            
            .custom-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .custom-notification .notification-content i {
                font-size: 20px;
            }
        `;
        document.head.appendChild(style);
    });

    /* ====================
    Counter Up
    ======================= */
    var cu = new counterUp({
        start: 0,
        duration: 2000,
        intvalues: true,
        interval: 100,
        append: " ",
    });
    cu.start();

    /* ====================
    WOW Animation
    ======================= */
    new WOW().init();

})();