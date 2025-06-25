// scripts/checkout.js
import { cart, updateCartItem, removeFromCart, clearCart } from '../data/cart.js';
import { products } from '../data/products.js';

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getProduct(productId) {
  return products.find(p => p.id === productId);
}

function calculateSummary(deliveryCharge) {
  let items = 0, subtotal = 0;
  cart.forEach(item => {
    const product = getProduct(item.productId);
    if (product) {
      items += item.quantity;
      subtotal += item.quantity * product.priceCents;
    }
  });
  const shipping = deliveryCharge;
  const tax = (subtotal + shipping) * 0.1;
  const total = subtotal + tax + shipping;
  return { items, subtotal, tax, shipping, total };
}

function renderCart(deliveryCharge = 499) {
  const container = document.querySelector('.js-order-summary');
  container.innerHTML = '';

  cart.forEach((item, index) => {
    const product = getProduct(item.productId);
    if (!product) return;

    container.innerHTML += `
      <div class="cart-item-container" data-index="${index}">
        <div class="delivery-date">Delivery date: Tuesday, June 21</div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">
          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatPrice(product.priceCents)}</div>
            <div class="product-quantity">
              <span>Quantity: <span class="quantity-label">${item.quantity}</span></span>
              <span class="update-quantity-link link-primary">Update</span>
              <span class="delete-quantity-link link-primary">Delete</span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            <div class="delivery-option">
              <input type="radio" name="delivery-option-${index}" class="delivery-option-input" value="0" checked>
              <div><div class="delivery-option-date">Tuesday, June 21</div><div class="delivery-option-price">FREE Shipping</div></div>
            </div>
            <div class="delivery-option">
              <input type="radio" name="delivery-option-${index}" class="delivery-option-input" value="499">
              <div><div class="delivery-option-date">Wednesday, June 15</div><div class="delivery-option-price">$4.99 - Shipping</div></div>
            </div>
            <div class="delivery-option">
              <input type="radio" name="delivery-option-${index}" class="delivery-option-input" value="999">
              <div><div class="delivery-option-date">Monday, June 13</div><div class="delivery-option-price">$9.99 - Shipping</div></div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  attachEvents();
  renderSummary(deliveryCharge);
}

function renderSummary(deliveryCharge = 499) {
  const { items, subtotal, tax, shipping, total } = calculateSummary(deliveryCharge);
  const summary = document.querySelector('.js-payment-summary');
  summary.innerHTML = `
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row"><div>Items (${items}):</div><div class="payment-summary-money">${formatPrice(subtotal)}</div></div>
    <div class="payment-summary-row"><div>Shipping & handling:</div><div class="payment-summary-money">${formatPrice(shipping)}</div></div>
    <div class="payment-summary-row subtotal-row"><div>Total before tax:</div><div class="payment-summary-money">${formatPrice(subtotal + shipping)}</div></div>
    <div class="payment-summary-row"><div>Estimated tax (10%):</div><div class="payment-summary-money">${formatPrice(tax)}</div></div>
    <div class="payment-summary-row total-row"><div>Order total:</div><div class="payment-summary-money">${formatPrice(total)}</div></div>
    <button class="place-order-button button-primary">Place your order</button>
  `;

  document.querySelector('.place-order-button').addEventListener('click', () => {
    const order = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      items: [...cart],
      total: formatPrice(total),
      estimatedDelivery: 'June 29'
    };

    const existing = JSON.parse(localStorage.getItem('placedOrders')) || [];
    existing.push(order);
    localStorage.setItem('placedOrders', JSON.stringify(existing));

    clearCart();
    window.location.href = 'orders.html';
  });

  document.querySelector('.checkout-header-middle-section a').textContent = `${items} item${items !== 1 ? 's' : ''}`;
}

function attachEvents() {
  document.querySelectorAll('.update-quantity-link').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      window.location.href = 'amazon.html';
    });
  });

  document.querySelectorAll('.delete-quantity-link').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      removeFromCart(cart[index].productId);
      renderCart();
    });
  });

  document.querySelectorAll('.delivery-option-input').forEach(input => {
    input.addEventListener('change', () => {
      const value = parseInt(input.value);
      renderSummary(value);
    });
  });
}

renderCart();
