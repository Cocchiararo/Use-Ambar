// app.js
// Lógica de Carrinho e Geração de Catálogo

function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- INICIO DADOS CATALOGO ---
const products = [{"id":1,"name":"Bata Elize","sizes":["P","M"],"colors":["Preta","Marrom"],"price":60,"img":"Catálogo de peças/Bata Elize - Tamanho P e M - Cores Preta e Marrom - R$ 60,00.jpeg","category":"CatÃ¡logo"},{"id":2,"name":"Bermuda","sizes":["P","M"],"colors":["Cinza","Preta"],"price":80,"img":"Catálogo de peças/Bermuda - Tamanho P e M - Cores Cinza e Preta - R$ 80,00.jpeg","category":"CatÃ¡logo"},{"id":3,"name":"Blusa Bella Renda","sizes":["Único"],"colors":["Nude"],"price":65,"img":"Catálogo de peças/Blusa Bella Renda - Tamanho Único - Cores Nude - R$ 65,00.jpeg","category":"CatÃ¡logo"},{"id":4,"name":"Blusa Serena Renda (Busto e Barra)","sizes":["Único"],"colors":["Vinho"],"price":65,"img":"Catálogo de peças/Blusa Serena Renda (Busto e Barra) - Tamanho Único - Cores Vinho - R$ 65,00.jpeg","category":"CatÃ¡logo"},{"id":5,"name":"Ciganinha Manga Longa","sizes":["P","M"],"colors":["Preta"],"price":65,"img":"Catálogo de peças/Ciganinha Manga Longa - Tamanho P e M - Cores Preta - R$ 65,00.jpeg","category":"CatÃ¡logo"},{"id":6,"name":"Cropped Tomara que Caia","sizes":["P","M"],"colors":["Preto","Cinza"],"price":50,"img":"Catálogo de peças/Cropped Tomara que Caia - Tamanho P e M - Cores Preto e Cinza - R$ 50,00.jpeg","category":"CatÃ¡logo"},{"id":7,"name":"Saia Alfaiataria com cinto","sizes":["P","M"],"colors":["Cinza","Marrom"],"price":105,"img":"Catálogo de peças/Saia Alfaiataria com cinto - Tamanho P e M - Cores Cinza e Marrom - R$ 105,00.jpeg","category":"CatÃ¡logo"},{"id":8,"name":"Short Alfaiataria","sizes":["M","G","GG"],"colors":["Marrom"],"price":60,"img":"Catálogo de peças/Short Alfaiataria - Tamanho M, G e GG - Cores Marrom - R$ 60,00.jpeg","category":"CatÃ¡logo"},{"id":9,"name":"Short Saia Couro Fake","sizes":["P","M"],"colors":["Preto","Caramelo"],"price":80,"img":"Catálogo de peças/Short Saia Couro Fake - Tamanho P e M - Cores Preto e Caramelo - R$ 80,00.jpeg","category":"CatÃ¡logo"},{"id":10,"name":"Vestido Aurora","sizes":["P","M","G"],"colors":["Variadas"],"price":60,"img":"Catálogo de peças/Vestido Aurora - Tamanho P, M e G - Cores Variadas - R$ 60,00.jpeg","category":"CatÃ¡logo"},{"id":11,"name":"Vestido Aurora II","sizes":["P","M","G"],"colors":["Variadas"],"price":60,"img":"Catálogo de peças/Vestido Aurora II - Tamanho P, M e G - Cores Variadas - R$ 60,00.jpeg","category":"CatÃ¡logo"},{"id":12,"name":"Vestido Aurora III","sizes":["P","M","G"],"colors":["Variadas"],"price":60,"img":"Catálogo de peças/Vestido Aurora III - Tamanho P, M e G - Cores Variadas - R$ 60,00.jpeg","category":"CatÃ¡logo"},{"id":13,"name":"Vestido Aurora IV","sizes":["P","M"],"colors":["Variadas"],"price":60,"img":"Catálogo de peças/Vestido Aurora IV - Tamanho P e M - Cores Variadas - R$ 60,00.jpeg","category":"CatÃ¡logo"}];
// --- FIM DADOS CATALOGO ---

// Renderizar Produtos se estiver na página de catálogo
const produtosContainer = document.getElementById('produtos-container');
if (produtosContainer) {
    let htmlContent = '';
    products.forEach(p => {
        let sizeOptions = (p.sizes || []).map(s => `<option value="${s}">${s}</option>`).join('');
        let colorOptions = (p.colors || []).map(c => `<option value="${c}">${c}</option>`).join('');
        
        let selectsHtml = '';
        if(p.sizes && p.sizes.length > 0 && p.sizes[0] !== '') {
            selectsHtml += `<select id="size-${p.id}" class="variant-select"><option value="" disabled selected>Tamanho</option>${sizeOptions}</select>`;
        }
        if(p.colors && p.colors.length > 0 && p.colors[0] !== '') {
            selectsHtml += `<select id="color-${p.id}" class="variant-select"><option value="" disabled selected>Cor</option>${colorOptions}</select>`;
        }

        htmlContent += `
            <div class="produto-card minimal-card" style="display: flex; flex-direction: column;">
                <div class="produto-img-wrap">
                    <img src="${encodeURI(p.img)}" loading="lazy" decoding="async" alt="${p.name}">
                </div>
                <div class="produto-info" style="flex: 1; display: flex; flex-direction: column;">
                    <h3 class="produto-nome">${p.name}</h3>
                    <p class="produto-preco">${formatMoney(p.price)}</p>
                    <div class="variant-container">
                        ${selectsHtml}
                    </div>
                    <button onclick="addToCart('${p.id}')" style="margin-top: 0.5rem; width: 100%; padding: 0.75rem 0; background: transparent; border: 1px solid var(--gray-line); color: var(--black-editorial); font-family: var(--font-body); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: background 0.3s, color 0.3s;" onmouseover="this.style.background='var(--black-editorial)'; this.style.color='var(--white)';" onmouseout="this.style.background='transparent'; this.style.color='var(--black-editorial)';">Adicione no carrinho</button>
                </div>
            </div>
        `;
    });
    produtosContainer.innerHTML = htmlContent;
}

// Sistema de Carrinho (Persistido via localStorage)
let cart = JSON.parse(localStorage.getItem('ambar_cart')) || [];
updateCartUI();

function toggleCart() {
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal && checkoutModal.classList.contains('open')) {
        closeCheckout();
    } else {
        document.getElementById('cart-sidebar').classList.toggle('open');
        document.getElementById('cart-overlay').classList.toggle('open');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if(product) {
        let selectedSize = '';
        let selectedColor = '';
        
        if(product.sizes && product.sizes.length > 0 && product.sizes[0] !== '') {
            const sizeSelect = document.getElementById(`size-${productId}`);
            if(!sizeSelect.value) {
                showToast("Por favor, selecione um tamanho.");
                return;
            }
            selectedSize = sizeSelect.value;
        }
        
        if(product.colors && product.colors.length > 0 && product.colors[0] !== '') {
            const colorSelect = document.getElementById(`color-${productId}`);
            if(!colorSelect.value) {
                showToast("Por favor, selecione uma cor.");
                return;
            }
            selectedColor = colorSelect.value;
        }
        
        if (
            (product.name === "Bata Elize" && selectedColor === "Marrom" && selectedSize === "P") ||
            (product.name === "Ciganinha Manga Longa" && selectedColor === "Preta" && selectedSize === "M") ||
            (product.name === "Cropped Tomara que Caia" && selectedColor === "Preto" && selectedSize === "P") ||
            (product.name === "Saia Alfaiataria com cinto" && selectedColor === "Marrom" && selectedSize === "P")
        ) {
            showToast("Essa combinação está esgotada.");
            return;
        }
        
        cart.push({ ...product, selectedSize, selectedColor });
        localStorage.setItem('ambar_cart', JSON.stringify(cart));
        updateCartUI();
        showToast(`${product.name} adicionado!`);
        
        // Reset selects
        if(document.getElementById(`size-${productId}`)) document.getElementById(`size-${productId}`).value = "";
        if(document.getElementById(`color-${productId}`)) document.getElementById(`color-${productId}`).value = "";
        
        if(window.innerWidth <= 768) {
            document.getElementById('cart-sidebar').classList.add('open');
            document.getElementById('cart-overlay').classList.add('open');
        }
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('ambar_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartTotalElement = document.getElementById('cart-total-value');
    
    if(!cartItemsContainer) return;

    cartCountElements.forEach(el => el.textContent = cart.length);
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Seu carrinho está vazio.</p>';
        cartTotalElement.textContent = formatMoney(0);
        return;
    }
    
    let total = 0;    let cartHtml = '';    cart.forEach((item, index) => {        total += item.price;        let variantText = [];        if(item.selectedSize) variantText.push(`Tamanho: ${item.selectedSize}`);        if(item.selectedColor) variantText.push(`Cor: ${item.selectedColor}`);        let variantHtml = variantText.length > 0 ? `<p style="font-size: 0.75rem; color: var(--gray-text); margin: 4px 0;">${variantText.join(' | ')}</p>` : '';        cartHtml += `            <div class="cart-item">                <img src="${encodeURI(item.img)}" alt="${item.name}" class="cart-item-img">                <div class="cart-item-info">                    <h4 class="cart-item-title">${item.name}</h4>                    <p class="cart-item-price">${formatMoney(item.price)}</p>                    ${variantHtml}                    <button class="remove-item" onclick="removeFromCart(${index})">Remover item</button>                </div>            </div>        `;    });    cartItemsContainer.innerHTML = cartHtml;
    
    cartTotalElement.textContent = formatMoney(total);
}

let partialLeadSent = false;
let abandonedCartTimer = null;

// Checkout Modal
function openCheckout() {
    if(cart.length === 0) {
        showToast("Seu carrinho está vazio.");
        return;
    }
    partialLeadSent = false;
    clearTimeout(abandonedCartTimer);
    toggleCart(); 
    document.getElementById('cart-overlay').classList.add('open'); 
    document.getElementById('checkout-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function sendAbandonedCart() {
    const wppInput = document.getElementById('whatsapp');
    if(!wppInput || partialLeadSent || wppInput.value.length < 8) return;
    
    partialLeadSent = true;
    clearTimeout(abandonedCartTimer);
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx_02R2B_YWQ3P3Cn2GtrAKtCayxNKzGKmWnkKkbMy1pLS7GERf6e887ftaHOeZ-uw/exec';
    const params = new URLSearchParams();
    params.append('Nome', document.getElementById('nome').value || "[Não finalizou]");
    params.append('WhatsApp', wppInput.value);
    params.append('Endereco', document.getElementById('endereco').value || "[Carrinho Abandonado]");
    params.append('Pagamento', document.getElementById('pagamento').value || "N/A");
    params.append('Cupom', document.getElementById('cupom').value || "");
    
    // keepalive: true ensures the request finishes even if the tab is closing
    fetch(scriptURL, { method: 'POST', body: params, mode: 'no-cors', keepalive: true }).catch(() => {});
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

// Submissão Whatsapp
const checkoutForm = document.getElementById('checkout-form');
if(checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Cancel abandoned cart timer because the user completed the purchase!
        partialLeadSent = true;
        clearTimeout(abandonedCartTimer);
        
        const nome = document.getElementById('nome').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const endereco = document.getElementById('endereco').value;
        const pagamento = document.getElementById('pagamento').value;
        const cupom = document.getElementById('cupom').value;
        
        let msg = `*Novo Pedido - Use Âmbar*%0A%0A`;
        msg += `*Cliente:* ${nome}%0A`;
        msg += `*WhatsApp:* ${whatsapp}%0A`;
        msg += `*Endereço:* ${endereco}%0A`;
        msg += `*Pagamento:* ${pagamento}%0A`;
        if (cupom) msg += `*Cupom:* ${cupom}%0A`;
        msg += `%0A*Produtos:*%0A`;
        
        let total = 0;
        cart.forEach(item => {
            let variantText = [];
            if(item.selectedSize) variantText.push(`Tamanho: ${item.selectedSize}`);
            if(item.selectedColor) variantText.push(`Cor: ${item.selectedColor}`);
            let variantStr = variantText.length > 0 ? ` (${variantText.join(', ')})` : '';
            
            msg += `- ${item.name}${variantStr} (${formatMoney(item.price)})%0A`;
            total += item.price;
        });
        
        msg += `%0A*Total da Compra:* ${formatMoney(total)}`;
        
        const phone = "5518981656873";
        
        // Save to Google Sheets (Lead Capture)
        const scriptURL = 'https://script.google.com/macros/s/AKfycbx_02R2B_YWQ3P3Cn2GtrAKtCayxNKzGKmWnkKkbMy1pLS7GERf6e887ftaHOeZ-uw/exec';
        const params = new URLSearchParams();
        params.append('Nome', nome);
        params.append('WhatsApp', whatsapp);
        params.append('Endereco', endereco);
        params.append('Pagamento', pagamento);
        params.append('Cupom', cupom);
        
        fetch(scriptURL, { method: 'POST', body: params, mode: 'no-cors' })
            .catch(error => console.error('Erro ao salvar lead:', error));
        
        // Update Stepper to step 3 visually
        const stepForm = document.getElementById('step-form-indicator');
        const stepWpp = document.getElementById('step-whatsapp-indicator');
        
        if(stepForm && stepWpp) {
            stepForm.classList.remove('active');
            stepForm.classList.add('completed');
            stepWpp.classList.add('active');
        }
        
        // Delay opening Whatsapp to let animation play
        setTimeout(() => {
            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
            
            closeCheckout();
            cart.length = 0;
            localStorage.setItem('ambar_cart', JSON.stringify(cart));
            updateCartUI();
            checkoutForm.reset();
            showToast("Redirecionando para o WhatsApp...");
            
            setTimeout(() => {
                if(stepForm && stepWpp) {
                    stepForm.classList.add('active');
                    stepForm.classList.remove('completed');
                    stepWpp.classList.remove('active');
                }
            }, 500);
        }, 800);
    });

    // Captura de Carrinho Abandonado (Timeout inteligente)
    const wppInput = document.getElementById('whatsapp');
    if(wppInput) {
        wppInput.addEventListener('blur', function() {
            if(!partialLeadSent && wppInput.value.length >= 8) {
                clearTimeout(abandonedCartTimer);
                // Inicia contagem de 5 minutos (300000 milissegundos)
                abandonedCartTimer = setTimeout(sendAbandonedCart, 300000);
            }
        });
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Add WhatsApp Floating Button
document.addEventListener("DOMContentLoaded", () => {
    const waBtn = document.createElement("a");
    waBtn.href = "https://wa.me/5518981656873";
    waBtn.target = "_blank";
    waBtn.className = "whatsapp-float";
    waBtn.setAttribute("aria-label", "Fale conosco pelo WhatsApp");
    waBtn.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
    `;
    document.body.appendChild(waBtn);
});

// Lenis Smooth Scrolling Setup
document.addEventListener('DOMContentLoaded', () => {
    // Load Lenis from CDN
    const lenisScript = document.createElement('script');
    lenisScript.src = 'https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
    lenisScript.onload = () => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });
        window.lenis = lenis; // Expose to window so we can stop/start it

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    };
    document.head.appendChild(lenisScript);
});






