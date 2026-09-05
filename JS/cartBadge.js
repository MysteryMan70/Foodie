function updateCartBadge() {
  const cartBadge = document.querySelector("#cartBadge");

  if (!cartBadge) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length > 0) {
    cartBadge.style.display = "block";
  } else {
    cartBadge.style.display = "none";
  }
}

updateCartBadge();
