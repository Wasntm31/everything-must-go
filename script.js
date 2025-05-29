// Cart module for Everything Must Go
(function() {
  // Product Data (should match index.html)
  const products = [
    { id: 1, name: 'Cushion Set', image: 'images/raymond-petrik-VWLrQ2op6GQ-unsplash.jpg' },
    { id: 2, name: 'Wall Clock', image: 'images/julia-tretel-XljnuLUrxjs-unsplash.jpg' },
    { id: 3, name: 'Lampshade', image: 'images/anne-nygard-WBJeqso8WEE-unsplash.jpg' },
    { id: 4, name: 'Rug Mat', image: 'images/daniele-baldassarre-f_LR2vv3KCw-unsplash.jpg' },
    { id: 5, name: 'Storage Basket', image: 'images/suneet-pahwa-RYOl2oVdJzg-unsplash.jpg' },
    { id: 6, name: 'Hanging Light', image: 'images/irfan-y-hLPHkaDJJWo-unsplash.jpg' },
    { id: 7, name: 'Shower Curtain', image: 'images/trude-jonsson-stangel-2Vd1bZLgFU0-unsplash.jpg' },
    { id: 8, name: 'Doormat', image: 'images/james-mcdonald-eYD7_f3ycRk-unsplash.jpg' }
  ];

  let cart = {};
  function loadCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : {};
  }
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  function updateCartCount() {
    let total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const cartCount = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    if (cartCount) cartCount.textContent = total;
    if (cartCountMobile) cartCountMobile.textContent = total;
    if (total > 0) {
      if (cartCount) cartCount.classList.add('has-items');
      if (cartCountMobile) cartCountMobile.classList.add('has-items');
    } else {
      if (cartCount) cartCount.classList.remove('has-items');
      if (cartCountMobile) cartCountMobile.classList.remove('has-items');
    }
  }
  function renderCartItems() {
    loadCart();
    const cartItems = document.getElementById('cart-items');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    if (!cartItems || !cartCheckoutBtn) return;
    if (Object.keys(cart).length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
      cartCheckoutBtn.disabled = true;
      cartCheckoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
      return;
    }
    let html = '<ul class="space-y-2">';
    for (let id in cart) {
      const product = products.find(p => p.id == id);
      html += `<li class="flex items-center border-b pb-2">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" class="w-14 h-14 object-cover rounded border" />` : `<div class='w-14 h-14 bg-gray-300 rounded border flex items-center justify-center'></div>`}
        <span class="flex-1" style="margin-left:1rem;text-align:left;">${product.name}</span>
        <div class="cart-controls" style="display:flex;align-items:center;gap:0.5rem;margin-left:auto;">
          <button class="decrease-qty bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-2 py-0.5 text-lg font-bold" data-id="${id}" title="Decrease">-</button>
          <span class="mx-1">${cart[id]}</span>
          <button class="increase-qty bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-2 py-0.5 text-lg font-bold" data-id="${id}" title="Increase">+</button>
          <button class="remove-from-cart text-red-600 hover:text-red-800 text-lg font-bold px-2 ml-2" data-id="${id}" title="Remove">&times;</button>
        </div>
      </li>`;
    }
    html += '</ul>';
    cartItems.innerHTML = html;
    cartCheckoutBtn.disabled = false;
    cartCheckoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  // Expose cart module to window for index.html to use
  window.CartModule = {
    products,
    loadCart,
    saveCart,
    updateCartCount,
    renderCartItems,
    getCart: () => cart,
    setCart: (newCart) => { cart = newCart; saveCart(); updateCartCount(); },
    addToCart: (id) => {
      loadCart();
      cart[id] = (cart[id] || 0) + 1;
      saveCart();
      updateCartCount();
      // If cart modal is open, re-render contents
      const cartModal = document.getElementById('cart-modal');
      if (cartModal && !cartModal.classList.contains('hidden')) {
        renderCartItems();
      }
    },
    removeFromCart: (id) => {
      loadCart();
      delete cart[id];
      saveCart();
      updateCartCount();
      const cartModal = document.getElementById('cart-modal');
      if (cartModal && !cartModal.classList.contains('hidden')) {
        renderCartItems();
      }
    },
    increaseQty: (id) => {
      loadCart();
      cart[id] = (cart[id] || 0) + 1;
      saveCart();
      updateCartCount();
      const cartModal = document.getElementById('cart-modal');
      if (cartModal && !cartModal.classList.contains('hidden')) {
        renderCartItems();
      }
    },
    decreaseQty: (id) => {
      loadCart();
      if (cart[id] > 1) {
        cart[id]--;
      } else {
        delete cart[id];
      }
      saveCart();
      updateCartCount();
      const cartModal = document.getElementById('cart-modal');
      if (cartModal && !cartModal.classList.contains('hidden')) {
        renderCartItems();
      }
    }
  };

  // Attach cart modal open/close and interaction logic after DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    const cartBtnMobile = document.getElementById('cart-btn-mobile');
    // Ensure cart modal is hidden on load
    if (cartModal) {
      cartModal.classList.add('hidden');
    }
    // Open cart modal and render contents
    if (cartBtn) {
      cartBtn.setAttribute('tabindex', '0');
      cartBtn.setAttribute('role', 'button');
      cartBtn.setAttribute('aria-label', 'View cart');
      cartBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.CartModule.loadCart();
          window.CartModule.renderCartItems();
          if (cartModal) cartModal.style.display = 'flex';
          if (cartModal) cartModal.classList.remove('hidden');
        }
      });
      cartBtn.addEventListener('click', () => {
        window.CartModule.loadCart();
        window.CartModule.renderCartItems();
        if (cartModal) cartModal.style.display = 'flex';
        if (cartModal) cartModal.classList.remove('hidden');
      });
    }
    if (cartBtnMobile) {
      cartBtnMobile.addEventListener('click', () => {
        window.CartModule.loadCart();
        window.CartModule.renderCartItems();
        if (cartModal) cartModal.style.display = 'flex';
        if (cartModal) cartModal.classList.remove('hidden');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
      });
    }
    if (closeCart) {
      closeCart.addEventListener('click', () => {
        if (cartModal) cartModal.style.display = 'none';
        if (cartModal) cartModal.classList.add('hidden');
      });
    }
    if (cartModal) {
      cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
          cartModal.style.display = 'none';
          cartModal.classList.add('hidden');
        }
      });
    }
    if (cartItems) {
      cartItems.addEventListener('click', function(e) {
        const id = e.target.getAttribute('data-id');
        if (e.target.classList.contains('remove-from-cart')) {
          window.CartModule.removeFromCart(id);
          window.CartModule.renderCartItems();
        } else if (e.target.classList.contains('increase-qty')) {
          window.CartModule.increaseQty(id);
          window.CartModule.renderCartItems();
        } else if (e.target.classList.contains('decrease-qty')) {
          window.CartModule.decreaseQty(id);
          window.CartModule.renderCartItems();
        }
      });
    }
    if (cartCheckoutBtn) {
      cartCheckoutBtn.addEventListener('click', () => {
        window.CartModule.loadCart();
        if (Object.keys(window.CartModule.getCart()).length === 0) {
          alert('Your cart is empty.');
          return;
        }
        cartModal.classList.add('hidden');
        window.location.replace('checkout.html');
      });
    }
  });
})();
