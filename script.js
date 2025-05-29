



document.addEventListener('DOMContentLoaded', function () {
 console.log('JS funcionando!');
// ==========================
// 🔥 Menu Mobile
// ==========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('#mobile-menu a').forEach(link =>
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  })
);

// ==========================
// 🛒 Carrinho
// ==========================
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const continueShopping = document.getElementById('continue-shopping');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = [];

const toggleCart = (show) => {
  cartSidebar.classList.toggle('translate-x-full', !show);
  cartOverlay.classList.toggle('hidden', !show);
  document.body.style.overflow = show ? 'hidden' : 'auto';
};

cartBtn?.addEventListener('click', () => toggleCart(true));
closeCart?.addEventListener('click', () => toggleCart(false));
cartOverlay?.addEventListener('click', () => toggleCart(false));
continueShopping?.addEventListener('click', () => toggleCart(false));

// Função que renderiza o carrinho
function updateCart() {
  cartItemsContainer.innerHTML = cart.length
    ? cart.map(renderCartItem).join('')
    : renderEmptyCart();

  cartTotal.textContent = `R$ ${getCartTotal().toFixed(2).replace('.', ',')}`;
  cartCount.textContent = getItemCount();

  setWhatsAppCheckout();
  addCartItemEventListeners();
}

function renderCartItem(item) {
  return `
    <div class="cart-item flex justify-between items-center py-3 border-b border-gray-100">
      <div>
        <h4 class="font-medium">${item.name}</h4>
        <p class="text-sm text-gray-500">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
      </div>
      <div class="flex items-center">
        <button class="decrease-quantity px-2" data-id="${item.id}">
          <i class="fas fa-minus text-xs text-gray-500 hover:text-pink-600"></i>
        </button>
        <span class="mx-2">${item.quantity}</span>
        <button class="increase-quantity px-2" data-id="${item.id}">
          <i class="fas fa-plus text-xs text-gray-500 hover:text-pink-600"></i>
        </button>
        <button class="remove-item ml-4" data-id="${item.id}">
          <i class="fas fa-trash text-gray-500 hover:text-red-500"></i>
        </button>
      </div>
    </div>
  `;
}

function renderEmptyCart() {
  return `
    <div class="text-center py-8">
      <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">Seu carrinho está vazio</p>
      <a href="#products" class="mt-4 inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full transition" onclick="toggleCart(false)">
        Ver produtos
      </a>
    </div>
  `;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function setWhatsAppCheckout() {
  if (cart.length === 0) return;
  const msg = cart.map(item =>
    `- ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  const total = getCartTotal().toFixed(2);
  const text = `Olá! Gostaria de comprar os seguintes produtos:\n\n${msg}\n\nTotal: R$ ${total}`;
  checkoutBtn.href = `https://wa.me/5514996651947?text=${encodeURIComponent(text)}`;
}

function addCartItemEventListeners() {
  document.querySelectorAll('.decrease-quantity').forEach(btn =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item.quantity > 1) item.quantity--;
      else cart = cart.filter(i => i.id !== id);
      updateCart();
    })
  );

  document.querySelectorAll('.increase-quantity').forEach(btn =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = cart.find(i => i.id === id);
      item.quantity++;
      updateCart();
    })
  );

  document.querySelectorAll('.remove-item').forEach(btn =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      cart = cart.filter(i => i.id !== id);
      updateCart();
    })
  );
}

addToCartButtons.forEach(button =>
  button.addEventListener('click', () => {
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    const item = cart.find(i => i.id === id);
    item ? item.quantity++ : cart.push({ id, name, price, quantity: 1 });

    updateCart();

    button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
    button.classList.replace('bg-pink-100', 'bg-green-100');
    button.classList.replace('text-pink-600', 'text-green-600');

    setTimeout(() => {
      button.innerHTML = '+ Adicionar';
      button.classList.replace('bg-green-100', 'bg-pink-100');
      button.classList.replace('text-green-600', 'text-pink-600');
    }, 1500);
  })
);

// ==========================
// 🧩 Filtro por Categoria
// ==========================
const categoryButtons = document.querySelectorAll('.category-btn');
const productsContainer = document.getElementById('products-container');

categoryButtons.forEach(button =>
  button.addEventListener('click', () => {
    categoryButtons.forEach(btn =>
      btn.classList.replace('bg-pink-600', 'bg-white') ||
      btn.classList.replace('text-white', 'text-gray-700')
    );

    button.classList.replace('bg-white', 'bg-pink-600');
    button.classList.replace('text-gray-700', 'text-white');

    const category = button.dataset.category;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display =
        category === 'all' || card.dataset.category === category ? 'block' : 'none';
    });
  })
);

// ==========================
// 🔝 Scroll Top
// ==========================
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTopButton?.classList.toggle('hidden', window.pageYOffset <= 300);
});

backToTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================
// 🧭 Âncoras com Scroll Suave
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    e.preventDefault();

    const el = document.querySelector(targetId);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  });
});

// Inicia com carrinho atualizado
updateCart();

});