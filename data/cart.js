// data/cart.js

export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart();
}

export function updateCartItem(productId, quantity) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = quantity;
    saveCart();
  }
}

export function removeFromCart(productId) {
  cart = cart.filter(i => i.productId !== productId);
  saveCart();
}

export function clearCart() {
  cart = [];
  saveCart();
}
