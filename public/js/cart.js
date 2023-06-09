const addToCartBtns = document.querySelectorAll(".addToCartBtn");
const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    console.log(e.target.dataset)
    let found = false;

    //reviso si hay un mismo producto para incrementar su cantidad
    cartItems.forEach((item) => {
      if (item.productId === productId) {
        item.quantity += 1;
        found = true;
      }
    });
    //si no lo encuentro voy a crear un producto nuevo
    if (!found) {
      const productInfo = { productId, quantity: 1 };
      cartItems.push(productInfo);
    }
    //lo guardo en mi carrito con SetItem
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert("product added to cart!");
    //llamo para renderizar productos
    generateCartItemsHTML();
  });
});

const generateCartItemsHTML = () => {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const productHTML = `
        <div>
          <p class="fw-bold">Product: ${item.productId}</p>
          <p class="fw-bold">Quantity: ${item.quantity}</p>
        </div>
      `;
    cartItemsContainer.innerHTML += productHTML;
  });
};

const showCartModal = () => {
  generateCartItemsHTML();
};

window.addEventListener("DOMContentLoaded", showCartModal);