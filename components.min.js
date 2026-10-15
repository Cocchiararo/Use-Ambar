// components.js

(function() {
    /* ---------------------------------
       MAGNETIC HOVER BUTTON
    --------------------------------- */
    const magBtn = document.getElementById('magnetic-catalog-btn');
    if (magBtn) {
        const sweep = document.getElementById('magnetic-catalog-sweep');
        const text = document.getElementById('magnetic-catalog-text');
        
        const magnetStrength = 10;
        const maxPull = 0.5;
        const rangePerPoint = 18;
        const pull = (magnetStrength / 20) * maxPull;
        const reach = magnetStrength * rangePerPoint;
        
        let isHover = false;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        
        function animateMag() {
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            magBtn.style.transform = `translate(${currentX}px, ${currentY}px)`;
            requestAnimationFrame(animateMag);
        }
        animateMag();

        document.addEventListener('pointermove', (e) => { if (window.innerWidth <= 768) return;
            const rect = magBtn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - currentX;
            const cy = rect.top + rect.height / 2 - currentY;
            
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            
            const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                           e.clientY >= rect.top && e.clientY <= rect.bottom;
                           
            if (inside && !isHover) {
                isHover = true;
                magBtn.style.boxShadow = "0 16px 40px rgba(0,0,0,0.22)";
                text.style.color = "#FFFFFF";
                
                const lx = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const ly = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
                const d = 2 * Math.hypot(rect.width, rect.height);
                
                sweep.style.transition = "none";
                sweep.style.width = "0px";
                sweep.style.height = "0px";
                sweep.style.left = lx + "px";
                sweep.style.top = ly + "px";
                sweep.style.marginLeft = "0px";
                sweep.style.marginTop = "0px";
                sweep.style.transform = "scale(0)";
                
                sweep.offsetHeight; // force reflow
                
                sweep.style.transition = "transform 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out";
                sweep.style.width = d + "px";
                sweep.style.height = d + "px";
                sweep.style.marginLeft = -(d/2) + "px";
                sweep.style.marginTop = -(d/2) + "px";
                sweep.style.transform = "scale(1)";
            }
            
            const edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
            const edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
            const gap = Math.hypot(edgeX, edgeY);
            
            if (gap > reach) {
                targetX = 0;
                targetY = 0;
                if (isHover) {
                    isHover = false;
                    magBtn.style.boxShadow = "0 8px 22px rgba(0,0,0,0.14)";
                    text.style.color = "#BEBEBE";
                    sweep.style.transform = "scale(0)";
                }
                return;
            }
            
            const falloff = reach === 0 ? 0 : 1 - gap / reach;
            targetX = dx * pull * falloff;
            targetY = dy * pull * falloff;
        });
    }

    /* ---------------------------------
       MAGNETIC CAROUSEL (Lookbook)
    --------------------------------- */
    const carouselContainer = document.getElementById('magnetic-carousel');
    if (carouselContainer) {
        const images = [
            "LookBook/Lookbook_1.webp",
            "LookBook/Lookbook_2.webp",
            "LookBook/Lookbook_3.webp",
            "LookBook/Lookbook_4.webp",
            "LookBook/Lookbook_5.webp",
            "LookBook/Lookbook_6.webp",
            "LookBook/Lookbook_7.webp"
        ];

                        const isMobileCarousel = window.matchMedia("(max-width: 768px)").matches || window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const collapsedWidth = isMobileCarousel ? 50 : 120;
        const hoverWidth = isMobileCarousel ? 120 : 350;
        const collapsedHeight = isMobileCarousel ? 240 : 500;
        const hoverHeight = isMobileCarousel ? 280 : 550;
        const openSize = isMobileCarousel ? 300 : 700;
        const gap = isMobileCarousel ? 8 : 16;
        const influence = 200;
        const blur = 2;

        const items = [];
        const targetFactors = Array(images.length).fill(0);
        const currentFactors = Array(images.length).fill(0);
        let openIndex = null;
        let closing = false;
        let loopId = 0;

        const backdrop = document.createElement('div');
        backdrop.style.cssText = "position: absolute; inset: 0; z-index: 1; pointer-events: none;";
        backdrop.onclick = closeCarousel;
        carouselContainer.appendChild(backdrop);

        images.forEach((src, i) => {
            const el = document.createElement('div');
            el.style.cssText = `
                flex: none;
                width: ${collapsedWidth}px;
                height: ${collapsedHeight}px;
                overflow: hidden;
                cursor: pointer;
                transition: width 0.3s ease-in-out, height 0.3s ease-in-out;
                will-change: width, height;
                position: relative;
                z-index: 2;
                background-color: transparent;
                background-image: url(${src});
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            `;
            el.onclick = (e) => {
                e.stopPropagation();
                if (openIndex === i) closeCarousel();
                else openItem(i);
            };
            carouselContainer.appendChild(el);
            items.push(el);
        });

        function openItem(i) {
            openIndex = i;
            backdrop.style.pointerEvents = 'auto';
            updateStyles(true);
        }

        function closeCarousel() {
            targetFactors.fill(0);
            currentFactors.fill(0);
            closing = true;
            openIndex = null;
            backdrop.style.pointerEvents = 'none';
            updateStyles(true);
            setTimeout(() => { closing = false; updateStyles(); }, 300);
        }

        function updateStyles(useTransition = false) {
            items.forEach((el, i) => {
                let w, h;
                if (openIndex !== null) {
                    if (openIndex === i) {
                        w = openSize; h = openSize;
                    } else {
                        w = collapsedWidth; h = collapsedHeight;
                    }
                } else {
                    const f = currentFactors[i];
                    w = collapsedWidth + (hoverWidth - collapsedWidth) * f;
                    h = collapsedHeight + (hoverHeight - collapsedHeight) * f;
                }

                const blurred = openIndex !== null && i !== openIndex;
                const openEase = "width 0.3s ease-in-out, height 0.3s ease-in-out, filter 0.3s ease-in-out, opacity 0.3s ease-in-out";
                const transition = (openIndex !== null || closing || useTransition) ? openEase : "none";

                el.style.width = w + 'px';
                el.style.height = h + 'px';
                el.style.transition = transition;
                el.style.zIndex = openIndex === i ? 3 : 2;
                el.style.filter = (blurred && !isMobileCarousel) ? `blur(px)` : 'none';
                el.style.opacity = blurred ? 0.6 : 1;
            });
        }

        function step() {
            let moving = false;
            for (let i = 0; i < currentFactors.length; i++) {
                const d = targetFactors[i] - currentFactors[i];
                if (Math.abs(d) > 0.001) {
                    currentFactors[i] += d * 0.2;
                    moving = true;
                } else {
                    currentFactors[i] = targetFactors[i];
                }
            }
            updateStyles();
            if (moving) {
                loopId = requestAnimationFrame(step);
            } else {
                loopId = 0;
            }
        }

        function startLoop() {
            if (!loopId) loopId = requestAnimationFrame(step);
        }

        carouselContainer.addEventListener('mousemove', (e) => {
            if (isMobileCarousel) return;
            if (openIndex !== null) return;
            const rect = carouselContainer.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const n = images.length;
            const totalBase = n * collapsedWidth + (n - 1) * gap;
            const startX = (rect.width - totalBase) / 2;

            for (let i = 0; i < n; i++) {
                const center = startX + i * (collapsedWidth + gap) + collapsedWidth / 2;
                const dist = Math.abs(cx - center);
                const f = Math.max(0, 1 - dist / influence);
                targetFactors[i] = f * f * (3 - 2 * f);
            }
            startLoop();
        });

        carouselContainer.addEventListener('mouseleave', () => {
            if (openIndex !== null) return;
            targetFactors.fill(0);
            startLoop();
        });
        
        updateStyles(true);
    }

    /* ---------------------------------
       ENCRYPT BUTTON (Hover Scramble)
    --------------------------------- */
    const encBtn = document.getElementById('encrypt-btn-editorial');
    if (encBtn) {
        const textSpan = encBtn.querySelector('.encrypt-text');
        const originalText = textSpan.innerText;
        const chars = "!@#$%^&*():{};|,.<>/?";
        const cycles = 4;
        const speed = 60;
        const stepMs = 1000 / speed;
        let rafRef = null;
        
        function scramble() {
            const letters = originalText.split('');
            const total = letters.length * cycles;
            let step = 0;
            let last = 0;
            
            function tick(now) {
                if (!last) last = now;
                if (now - last >= stepMs) {
                    last = now;
                    const scrambled = letters.map((char, index) => {
                        if (step / cycles > index) return char;
                        if (!char.trim()) return char;
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('');
                    textSpan.innerText = scrambled;
                    step++;
                    if (step >= total) {
                        textSpan.innerText = originalText;
                        cancelAnimationFrame(rafRef);
                        return;
                    }
                }
                rafRef = requestAnimationFrame(tick);
            }
            rafRef = requestAnimationFrame(tick);
        }
        
        encBtn.addEventListener('mouseenter', () => {
            if (rafRef) cancelAnimationFrame(rafRef);
            scramble();
        });
        encBtn.addEventListener('mouseleave', () => {
            if (rafRef) cancelAnimationFrame(rafRef);
            textSpan.innerText = originalText;
        });
    }

    /* ---------------------------------
       WEIGHT HOVER
    --------------------------------- */
    const weightContainer = document.getElementById('weight-hover-text');
    if (weightContainer) {
        const text = weightContainer.innerText;
        weightContainer.innerHTML = ''; 
        
        const letters = text.split('');
        const spans = [];
        
        letters.forEach((char) => {
            const span = document.createElement('span');
            span.className = 'weight-letter';
            span.innerText = char;
            weightContainer.appendChild(span);
            spans.push(span);
        });
        
        weightContainer.addEventListener('mouseenter', () => {
            const indices = spans.map((_, i) => i).sort(() => Math.random() - 0.5);
            spans.forEach((span, i) => {
                const delay = indices.indexOf(i) * 30; 
                setTimeout(() => {
                    span.style.fontVariationSettings = "'wght' 900";
                }, delay);
            });
        });
        
        weightContainer.addEventListener('mouseleave', () => {
            spans.forEach(span => {
                span.style.fontVariationSettings = "'wght' 200";
            });
        });
    }

    /* ---------------------------------
       SCROLL HIGHLIGHT TEXT
    --------------------------------- */
    const scrollTexts = document.querySelectorAll('.scroll-highlight-text');
    scrollTexts.forEach(para => {
        // Obter o texto puro (preservando quebras de linha se quisermos, mas usando a lógica original)
        // Para manter as quebras originais caso existam tags <br>:
        let htmlContent = para.innerHTML;
        // Substituir <br> por um token especial para não perder nas quebras
        htmlContent = htmlContent.replace(/<br\s*[\/]?>/gi, " _BR_ ");
        
        // Pega os tokens separados por espaço
        const tokens = htmlContent.replace(/&nbsp;/g, ' ').trim().split(/\s+/).filter(Boolean);
        para.innerHTML = '';
        
        const wordSpans = [];
        
        tokens.forEach((token, index) => {
            if (token === "_BR_") {
                para.appendChild(document.createElement('br'));
            } else {
                const span = document.createElement('span');
                span.className = 'scroll-word';
                span.innerText = token;
                span.style.transition = 'color 0.2s ease-out';
                span.style.color = 'rgba(239, 238, 233, 0.15)';
                para.appendChild(span);
                wordSpans.push(span);
                
                if (index < tokens.length - 1 && tokens[index+1] !== "_BR_") {
                    para.appendChild(document.createTextNode(' '));
                }
            }
        });
        
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = para.getBoundingClientRect();
                    const vh = window.innerHeight;
                    const center = vh / 2;
                    const distance = rect.height;
                    const pastStart = center - rect.top;
                    let progress = distance > 0 ? (pastStart / distance) : 0;
                    progress = Math.max(0, Math.min(1, progress));
                    const wordsToLight = Math.floor(progress * wordSpans.length);
                    wordSpans.forEach((span, i) => {
                        if (i < wordsToLight) {
                            span.style.color = '#FFFFFF';
                        } else {
                            span.style.color = 'rgba(239, 238, 233, 0.15)';
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        handleScroll();
    });
    /* ---------------------------------
    /* ---------------------------------
       SMOOTH 3D SLIDESHOW (Replaces Coverflow)
    --------------------------------- */
    const coverflowContainer = document.getElementById('coverflow-carousel');
    if (coverflowContainer) {
        const images = [
            "Carrossel%20pe%C3%A7as/Peca_1.webp",
            "Carrossel%20pe%C3%A7as/Peca_2.webp",
            "Carrossel%20pe%C3%A7as/Peca_3.webp",
            "Carrossel%20pe%C3%A7as/Peca_4.webp",
            "Carrossel%20pe%C3%A7as/Peca_5.webp"
        ];
        
                const isMobileCoverflow = window.innerWidth <= 768;
        const cardWidth = isMobileCoverflow ? 240 : 450;
        const cardHeight = isMobileCoverflow ? 240 : 450;
        const radius = 3;
        const tilt = 12;
        const sideTilt = 8;
        const gap = isMobileCoverflow ? 6 : 8;
        const opacity = 60; 
        const maxVisible = 2;
        const depth = isMobileCoverflow ? 150 : 240;
        const scaleStep = isMobileCoverflow ? 0.25 : 0.16;
        
        const n = images.length;
        let active = 0;
        let lock = false;
        
        coverflowContainer.style.perspective = '1600px';
        coverflowContainer.style.display = 'flex';
        coverflowContainer.style.alignItems = 'center';
        coverflowContainer.style.justifyContent = 'center';
        coverflowContainer.style.position = 'relative';
        coverflowContainer.style.width = '100%';
        coverflowContainer.style.height = '100%';
        
        const track = document.createElement('div');
        track.style.position = 'relative';
        track.style.width = cardWidth + 'px';
        track.style.height = cardHeight + 'px';
        track.style.transformStyle = 'preserve-3d';
        coverflowContainer.appendChild(track);
        
        const effectiveRadius = (Math.max(0, Math.min(20, radius)) / 20) * (Math.min(cardWidth, cardHeight) / 2);
        const dim = 1 - opacity / 100;
        
        const cards = images.map((src, i) => {
            const card = document.createElement('div');
            card.style.position = 'absolute';
            card.style.left = '50%';
            card.style.top = '50%';
            card.style.width = cardWidth + 'px';
            card.style.height = cardHeight + 'px';
            card.style.borderRadius = effectiveRadius + 'px';
            card.style.overflow = 'hidden';
            card.style.transformStyle = 'preserve-3d';
            card.style.transformOrigin = 'center center';
            card.style.backgroundColor = '#1a1a1a';
            card.style.cursor = 'pointer';
            card.style.transition = 'transform 0.4s cubic-bezier(0.44, 0, 0.56, 1), opacity 0.4s cubic-bezier(0.44, 0, 0.56, 1)';
            
            const img = document.createElement('img');
            img.src = src;
            img.style.position = 'absolute';
            img.style.inset = '0';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            img.style.userSelect = 'none';
            img.draggable = false;
            
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.inset = '0';
            overlay.style.backgroundColor = '#000000';
            overlay.style.pointerEvents = 'none';
            overlay.style.transition = 'opacity 0.4s cubic-bezier(0.44, 0, 0.56, 1)';
            
            card.appendChild(img);
            card.appendChild(overlay);
            track.appendChild(card);
            
            card.addEventListener('click', () => {
                if (lock) return;
                if (active !== i) {
                    lock = true;
                    active = i;
                    update();
                    setTimeout(() => { lock = false; }, 400);
                }
            });
            
            return { card, overlay };
        });
        
        function update() {
            cards.forEach((item, i) => {
                let rel = i - active;
                if (rel > n / 2) rel -= n;
                if (rel < -n / 2) rel += n;
                
                const ax = Math.abs(rel);
                const visible = ax <= maxVisible;
                const isActive = rel === 0;
                
                const sc = Math.max(0.4, 1 - ax * scaleStep);
                const tx = rel * (gap * 30);
                const tz = -ax * depth;
                const ry = -rel * tilt;
                const rz = rel * sideTilt;
                
                item.card.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
                item.card.style.opacity = visible ? '1' : '0';
                item.card.style.pointerEvents = visible && !isActive ? 'auto' : 'none';
                item.card.style.cursor = isActive ? 'default' : 'pointer';
                
                item.overlay.style.opacity = isActive ? '0' : dim;
            });
        }
        
        update();
    }
})();















