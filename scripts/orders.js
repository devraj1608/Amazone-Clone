// File: scripts/orders.js
import { products } from '../data/products.js';

const ordersGrid = document.querySelector('.orders-grid');

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getEstimatedDeliveryDate() {
  const delivery = new Date();
  delivery.setDate(delivery.getDate() + 3);
  return delivery.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem('placedOrders')) || [];

  if (orders.length === 0) {
    ordersGrid.innerHTML = '<p style="padding: 20px;">No orders found.</p>';
    return;
  }

  ordersGrid.innerHTML = orders.map((order) => {
    const orderItemsHTML = order.items.map((item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return '';

      return `
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-delivery-date">Arriving on: ${order.deliveryDate}</div>
          <div class="product-quantity">Quantity: ${item.quantity}</div>
          <button 
            class="buy-again-button button-primary" 
            data-product-id="${item.productId}" 
            data-quantity="${item.quantity}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
            <button class="track-package-button button-secondary">Track package</button>
          </a>
        </div>
      `;
    }).join('');

    return `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.date}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${formatPrice(order.total)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${orderItemsHTML}
        </div>
      </div>
    `;
  }).join('');

  attachBuyAgainEvents();
}

function attachBuyAgainEvents() {
  document.querySelectorAll('.buy-again-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantity = parseInt(button.dataset.quantity, 10);

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newOrder = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric'
        }),
        deliveryDate: getEstimatedDeliveryDate(),
        total: product.priceCents * quantity + 499 + (product.priceCents * quantity * 0.1), // subtotal + shipping + tax
        items: [
          {
            productId: product.id,
            quantity: quantity
          }
        ]
      };

      const orders = JSON.parse(localStorage.getItem('placedOrders')) || [];
      orders.unshift(newOrder); // Add to the beginning
      localStorage.setItem('placedOrders', JSON.stringify(orders));
      loadOrders(); // Refresh
    });
  });
}

function addClearOrdersButton() {
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear All Orders';
  clearButton.className = 'clear-orders-button button-secondary';
  clearButton.style.margin = '20px';

  clearButton.addEventListener('click', () => {
    const confirmClear = confirm('Are you sure you want to delete all orders?');
    if (confirmClear) {
      localStorage.removeItem('placedOrders');
      loadOrders(); // Refresh after clearing
    }
  });

  document.querySelector('.main').insertBefore(clearButton, ordersGrid);
}

// Initialize
addClearOrdersButton();
loadOrders();
