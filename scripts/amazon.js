// scripts/amazon.js
import { cart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';

const productGrid = document.querySelector('.js-products-grid');
let html = '';

products.forEach(product => {
  html += `
    <div class="product-container" data-product-id="${product.id}">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>
      <div class="product-name limit-text-to-2-lines">${product.name}</div>
      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">(${product.rating.count} reviews)</div>
      </div>
      <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
      <div class="product-quantity-container">
        <select class="js-quantity-selector">${[...Array(10)].map((_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}</select>
      </div>
      <div class="product-spacer"></div>
      <div class="added-to-cart js-added-to-cart">✔ Added</div>
      <button class="add-to-cart-button button-primary js-add-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `;
});

productGrid.innerHTML = html;

function updateCartBadge() {
  let count = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.querySelector('.js-cart-quantity').innerText = count;
}

document.querySelectorAll('.js-add-cart').forEach(button => {
  button.addEventListener('click', () => {
    const container = button.closest('.product-container');
    const productId = button.dataset.productId;
    const quantity = parseInt(container.querySelector('.js-quantity-selector').value);
    addToCart(productId, quantity);
    updateCartBadge();
    const tick = container.querySelector('.js-added-to-cart');
    tick.classList.add('show');
    setTimeout(() => tick.classList.remove('show'), 1000);
  });
});

updateCartBadge();
