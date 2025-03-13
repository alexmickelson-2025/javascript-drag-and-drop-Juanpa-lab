import { products } from "./products.js"

const productContainer = document.getElementById("products-container");
const cartContainer = document.getElementById("cartList");
const totalAmount = document.getElementById("amount");

function renderProducts() {
  productContainer.innerHTML = `<h2>Available Products</h2>`;
  products.forEach((product, index) => { 
    if (product.quantity > 0) {
      const productCard = document.createElement("div");
      productCard.classList.add("card");
      productCard.draggable = true;
      productCard.dataset.index = index;

      productCard.innerHTML = `
        <div class="card-img" style="background-image: url('${product.image}')"></div>
        <div class="card-content">
          <div class="card-title">${product.title}</div>
          <div class="card-description">${product.description}</div>
          <div class="card-price">$${product.price.toFixed(2)}</div>
          <div class="card-quantity">Quantity: ${product.quantity}</div>
        </div>
      `;

      productCard.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", index);
      });

      productContainer.appendChild(productCard);
    }
  });
}

let cart = {};

function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  for (let index in cart) {
    let cartItem = cart[index];

    const cartCard = document.createElement("div");
    cartCard.classList.add("card");
    cartCard.draggable = true;
    cartCard.dataset.index = index;

    cartCard.innerHTML = `
      <div class="card-img" style="background-image: url('${cartItem.image}')"></div>
      <div class="card-content">
        <div class="card-title">${cartItem.title}</div>
        <div class="card-description">${cartItem.description}</div>
        <div class="card-price">$${cartItem.price.toFixed(2)}</div>
        <div class="card-quantity">Quantity: ${cartItem.quantity}</div>
      </div>
    `;

    cartCard.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", `cart-${index}`);
    });

    cartContainer.appendChild(cartCard);

    total += cartItem.price * cartItem.quantity;
  }

  totalAmount.textContent = total.toFixed(2);
}

cartContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

cartContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData("text/plain");

  if (!data.startsWith("cart-")) {
    const index = parseInt(data);
    if (products[index].quantity > 0) {
      if (cart[index]) {
        cart[index].quantity += 1;
      } else {
        cart[index] = { ...products[index], quantity: 1 };
      }

      products[index].quantity -= 1;
      renderProducts();
      renderCart();
    }
  }
});

productContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

productContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData("text/plain");

  if (data.startsWith("cart-")) {
    const index = data.replace("cart-", "");
    if (cart[index]) {
      products[index].quantity += cart[index].quantity;
      delete cart[index];
      renderProducts();
      renderCart();
    }
  }
});

renderProducts();
renderCart();