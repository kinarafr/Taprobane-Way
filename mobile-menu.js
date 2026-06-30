/**
 * Mobile Hamburger Menu
 * Handles toggle, overlay click, escape key, and resize events.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');

        if (!hamburgerBtn || !mobileDrawer || !mobileOverlay) return;

        function openMenu() {
            hamburgerBtn.classList.add('active');
            mobileDrawer.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.classList.add('mobile-menu-open');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            hamburgerBtn.classList.remove('active');
            mobileDrawer.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }

        function toggleMenu() {
            if (mobileDrawer.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        hamburgerBtn.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', closeMenu);

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu if resized past mobile breakpoint
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1200 && mobileDrawer.classList.contains('active')) {
                closeMenu();
            }
        });

        // Custom Cursor Implementation
        if (window.matchMedia('(pointer: fine)').matches) {
            const cursorDot = document.createElement('div');
            const cursorOutline = document.createElement('div');
            
            cursorDot.className = 'custom-cursor-dot custom-cursor-hidden';
            cursorOutline.className = 'custom-cursor-outline custom-cursor-hidden';
            
            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorOutline);
            
            let mouseX = 0;
            let mouseY = 0;
            let outlineX = 0;
            let outlineY = 0;
            let isHidden = true;
            
            // Speed of the lerp effect (0.1 = slow/smooth, 1 = instant)
            const speed = 0.15;
            
            document.addEventListener('mousemove', function (e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                if (isHidden) {
                    isHidden = false;
                    cursorDot.classList.remove('custom-cursor-hidden');
                    cursorOutline.classList.remove('custom-cursor-hidden');
                    // Snap outer circle to initial cursor position
                    outlineX = mouseX;
                    outlineY = mouseY;
                }
                
                cursorDot.style.top = `${mouseY}px`;
                cursorDot.style.left = `${mouseX}px`;
            });
            
            // Lerp animation for the outer circle
            function animate() {
                if (!isHidden) {
                    const dx = mouseX - outlineX;
                    const dy = mouseY - outlineY;
                    outlineX += dx * speed;
                    outlineY += dy * speed;
                    
                    cursorOutline.style.top = `${outlineY}px`;
                    cursorOutline.style.left = `${outlineX}px`;
                }
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
            
            // Hide cursor when leaving window
            document.addEventListener('mouseleave', function () {
                isHidden = true;
                cursorDot.classList.add('custom-cursor-hidden');
                cursorOutline.classList.add('custom-cursor-hidden');
            });
            
            document.addEventListener('mouseenter', function () {
                isHidden = false;
                cursorDot.classList.remove('custom-cursor-hidden');
                cursorOutline.classList.remove('custom-cursor-hidden');
            });
            
            // Hover states for interactive elements, green headings, cards, and gallery items
            const hoverSelectors = 'a, button, [role="button"], input, select, textarea, .btn, .search-bar, h1, h2, h3, h4, h5, h6, .nav-link, .custom-nav-link, .card, .clickable-card, a *, button *, .card *, .clickable-card *, .gallery-item, .gallery-item *';
            
            document.addEventListener('mouseover', function (e) {
                if (e.target.closest(hoverSelectors)) {
                    document.body.classList.add('cursor-hovering');
                }
            });
            
            document.addEventListener('mouseout', function (e) {
                if (!e.target.closest(hoverSelectors) || (e.relatedTarget && !e.relatedTarget.closest(hoverSelectors))) {
                    document.body.classList.remove('cursor-hovering');
                }
            });
        }

        // Interactive Heading Logic for all pages (except dashboard)
        const title = document.querySelector('h1');
        const isDashboard = document.querySelector('.dashboard-container');
        if (title && !isDashboard && !title.querySelector('.interactive-char')) {
            const text = title.innerHTML;
            const lines = text.split('<br>');
            title.innerHTML = '';
            
            lines.forEach((line, lineIndex) => {
                const words = line.split(' ');
                words.forEach((word, wordIndex) => {
                    const wordSpan = document.createElement('span');
                    wordSpan.style.display = 'inline-block';
                    
                    for (let i = 0; i < word.length; i++) {
                        const charSpan = document.createElement('span');
                        charSpan.innerHTML = word[i] === ' ' ? '&nbsp;' : word[i];
                        charSpan.classList.add('interactive-char');
                        wordSpan.appendChild(charSpan);
                    }
                    title.appendChild(wordSpan);
                    
                    if (wordIndex < words.length - 1) {
                        const spaceSpan = document.createElement('span');
                        spaceSpan.innerHTML = '&nbsp;';
                        spaceSpan.classList.add('interactive-char');
                        title.appendChild(spaceSpan);
                    }
                });
                if (lineIndex < lines.length - 1) {
                    title.appendChild(document.createElement('br'));
                }
            });

            const chars = title.querySelectorAll('.interactive-char');
            
            document.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) {
                    chars.forEach(char => {
                        if (char.style.transform && char.style.transform !== 'translate(0px, 0px)') {
                            char.style.transform = 'translate(0px, 0px)';
                        }
                    });
                    return;
                }

                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                chars.forEach(char => {
                    const rect = char.getBoundingClientRect();
                    const charX = rect.left + rect.width / 2;
                    const charY = rect.top + rect.height / 2;
                    
                    const deltaX = mouseX - charX;
                    const deltaY = mouseY - charY;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    
                    const maxDistance = 120;
                    
                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        // Push characters away
                        const pushX = -(deltaX / distance) * force * 40;
                        const pushY = -(deltaY / distance) * force * 40;
                        char.style.transform = `translate(${pushX}px, ${pushY}px)`;
                    } else {
                        char.style.transform = 'translate(0px, 0px)';
                    }
                });
            });
            
            document.addEventListener('mouseleave', () => {
                 chars.forEach(char => {
                     char.style.transform = 'translate(0px, 0px)';
                 });
            });
        }

        // Button Ripple Effect on Hover
        document.addEventListener('mouseenter', function (e) {
            const btn = e.target.closest('.btn, button, [role="button"]');
            if (btn) {
                // Ensure position is relative and overflow is hidden
                if (window.getComputedStyle(btn).position === 'static') {
                    btn.style.position = 'relative';
                }
                btn.style.overflow = 'hidden';
                
                // Get button bounds
                const rect = btn.getBoundingClientRect();
                
                // Create ripple element
                const ripple = document.createElement('span');
                ripple.className = 'ripple-span';
                
                // Calculate scale diameter
                const size = Math.max(rect.width, rect.height) * 2;
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                
                // Position relative to button bounds based on cursor entry
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                btn.appendChild(ripple);
                
                // Cleanup after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        }, true);
    });
})();
