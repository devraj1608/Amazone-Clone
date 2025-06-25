// File: scripts/tracking.js
import { products } from '../data/products.js';

const trackingContainer = document.querySelector('.js-order-tracking');

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const productId = urlParams.get('productId');

// Load orders from localStorage
const orders = JSON.parse(localStorage.getItem('placedOrders')) || [];
const order = orders.find(order => order.id === orderId);

function formatDelivery(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

function renderTracking() {
  if (!order) {
    trackingContainer.innerHTML = `<p style="padding: 20px;">Order not found.</p>`;
    return;
  }

  const item = order.items.find(i => i.productId === productId);
  const product = products.find(p => p.id === productId);

  if (!item || !product) {
    trackingContainer.innerHTML = `<p style="padding: 20px;">Product not found in this order.</p>`;
    return;
  }

  // Simulate progress stage (Preparing, Shipped, Delivered)
  const stageIndex = Math.floor(Math.random() * 3);
  const progressPercent = (stageIndex + 1) / 3 * 100;

  trackingContainer.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">View all orders</a>

    <div class="delivery-date">
      Arriving on ${formatDelivery(order.deliveryDate)}
    </div>

    <div class="product-info">${product.name}</div>
    <div class="product-info">Quantity: ${item.quantity}</div>

    <img class="product-image" src="${product.image}" alt="${product.name}">

    <div class="progress-labels-container">
      <div class="progress-label ${stageIndex === 0 ? 'current-status' : ''}">Preparing</div>
      <div class="progress-label ${stageIndex === 1 ? 'current-status' : ''}">Shipped</div>
      <div class="progress-label ${stageIndex === 2 ? 'current-status' : ''}">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressPercent}%"></div>
    </div>
  `;
}

renderTracking();
