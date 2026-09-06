// Cart Logic ///////////////////////

const cartContainer = document.querySelector("#cartContainer");
const subtotalElement = document.querySelector("#subtotal");
const totalElement = document.querySelector("#cartTotal");
const clearCartBtns = document.querySelectorAll(".clearCartBtn");

const checkoutBtn = document.querySelector("#checkoutBtn");
const modalTotal = document.querySelector("#modalTotal");

const DELIVERY = 3.5;

// =====================================================
// Get Cart
// =====================================================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// =====================================================
// Save Cart
// =====================================================

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =====================================================
// Display Cart
// =====================================================

function displayCart() {
  const cart = getCart();

  cartContainer.innerHTML = "";

  // Empty Cart
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="text-center p-5">
        <i class="fa-solid fa-cart-shopping fs-1 text-secondary mb-3"></i>

        <h4>Your cart is empty</h4>

        <p class="text-secondary">
          Add some delicious food to your cart.
        </p>
      </div>
    `;

    updateSummary();

    return;
  }

  // Products
  cart.forEach((product) => {
    const productTotal = product.price * product.quantity;

    cartContainer.innerHTML += `

      <div class="content mx-4 p-3 cart-row">

        <!-- Product -->
        <div
          class="cart-product row"
          onclick="goToProduct(${product.id})"
        >

          <div class="img1-cart col-12 col-xl-6 p-0">

            <img
              class="rounded-4"
              src="${product.imageUrl}"
              alt="${product.name}"
            />

          </div>

          <div class="header-cart d-none d-xl-grid col-xl-6">

            <h3 class="fw-bold fs-4">
              ${product.name}
            </h3>

            <p class="bold">
              $${product.price.toFixed(2)}
            </p>

          </div>

        </div>


        <!-- Quantity -->
        <div class="increment d-flex">

          <button
            class="btn"
            onclick="event.stopPropagation(); decreaseQuantity(${product.id})"
            ${product.quantity === 1 ? "disabled" : ""}
          >
            −
          </button>


          <span>
            ${product.quantity}
          </span>


          <button
            class="btn"
            onclick="event.stopPropagation(); increaseQuantity(${product.id})"
            ${product.quantity === 10 ? "disabled" : ""}
          >
            +
          </button>

        </div>


        <!-- Total -->
        <p class="cart-product-total bold">

          $${productTotal.toFixed(2)}

        </p>


        <!-- Remove -->
        <span
          class="cart-remove"
          onclick="event.stopPropagation(); removeProduct(${product.id})"
        >

          <i class="fa-solid fa-trash-can"></i>

        </span>

      </div>

    `;
  });

  updateSummary();
}

// =====================================================
// Increase Quantity
// =====================================================

function increaseQuantity(id) {
  const cart = getCart();

  const product = cart.find((product) => product.id === id);

  if (!product) return;

  if (product.quantity < 10) {
    product.quantity++;
  }

  saveCart(cart);

  displayCart();
}

// =====================================================
// Decrease Quantity
// =====================================================

function decreaseQuantity(id) {
  const cart = getCart();

  const product = cart.find((product) => product.id === id);

  if (!product) return;

  if (product.quantity > 1) {
    product.quantity--;
  }

  saveCart(cart);

  displayCart();
}

// =====================================================
// Remove Product
// =====================================================

function removeProduct(id) {
  let cart = getCart();

  cart = cart.filter((product) => product.id !== id);

  saveCart(cart);

  updateCartBadge();
  displayCart();
}

// =====================================================
// Clear Cart
// =====================================================

clearCartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    localStorage.removeItem("cart");

    updateCartBadge();

    displayCart();
  });
});

// =====================================================
// Check Login Status
// =====================================================

function isUserLoggedIn() {
  const username =
    localStorage.getItem("userUsername") ||
    sessionStorage.getItem("userUsername");

  const email =
    localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

  return Boolean(username && email);
}

// =====================================================
// Open Checkout Modal
// =====================================================

function openCheckoutModal() {
  const checkoutModalElement = document.querySelector("#exampleModal2");

  if (!checkoutModalElement) {
    console.error("Checkout modal #exampleModal2 was not found.");
    return;
  }

  const checkoutModal =
    bootstrap.Modal.getInstance(checkoutModalElement) ||
    new bootstrap.Modal(checkoutModalElement);

  checkoutModal.show();
}

// =====================================================
// Checkout Button
// =====================================================

checkoutBtn.addEventListener("click", () => {
  const cart = getCart();

  // Safety check
  if (cart.length === 0) {
    return;
  }

  // ===================================================
  // User is NOT logged in
  // ===================================================

  if (!isUserLoggedIn()) {
    // Remember that the user wanted to checkout
    sessionStorage.setItem("pendingCheckout", "true");

    // Open Login Required Modal
    const loginRequired = document.querySelector("#loginRequiredModal");

    if (!loginRequired) {
      console.error("Login Required Modal was not found.");
      return;
    }

    const loginRequiredModal =
      bootstrap.Modal.getInstance(loginRequired) ||
      new bootstrap.Modal(loginRequired);

    loginRequiredModal.show();

    return;
  }

  // ===================================================
  // User is already logged in
  // ===================================================

  openCheckoutModal();
});

// =====================================================
// Login Required -> Login
// =====================================================

// =====================================================
// Update Checkout
// =====================================================

function updateCheckout() {
  const total = parseFloat(totalElement.textContent.replace("$", ""));

  modalTotal.textContent = `$${total.toFixed(2)}`;

  checkoutBtn.disabled = total === 0;
}

// =====================================================
// Update Summary
// =====================================================

function updateSummary() {
  const cart = getCart();

  const subtotal = cart.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  const total = subtotal + (cart.length > 0 ? DELIVERY : 0);

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

  totalElement.textContent = `$${total.toFixed(2)}`;

  updateCheckout();
}

// =====================================================
// Initial Display
// =====================================================

displayCart();

// =====================================================
// Setup Login Required Modal
// =====================================================

// =====================================================
// Checkout Validation
// =====================================================

const fullNameInput = document.querySelector("#fullName");
const phoneInput = document.querySelector("#phone");
const addressInput = document.querySelector("#address");
const emailInput = document.querySelector("#email");

const placeOrderBtn = document.querySelector("#placeOrderBtn");

// =====================================================
// Error Functions
// =====================================================

function showError(input, message) {
  removeError(input);

  const error = document.createElement("small");

  error.classList.add("text-danger", "d-block", "mt-1");
  error.textContent = message;

  input.after(error);
  input.classList.add("is-invalid");
}

function removeError(input) {
  input.classList.remove("is-invalid");

  const oldError = input.parentElement.querySelector(".text-danger");

  if (oldError) {
    oldError.remove();
  }
}

// =====================================================
// Full Name Validation
// =====================================================

function validateName() {
  const name = fullNameInput.value.trim();

  if (name === "") {
    showError(fullNameInput, "Please Enter Your Full Name");

    return false;
  }

  const nameWithoutSpaces = name.replace(/\s/g, "");

  if (nameWithoutSpaces.length <= 3) {
    showError(fullNameInput, "Name must be more than 3 characters");

    return false;
  }

  removeError(fullNameInput);

  return true;
}

// =====================================================
// Phone Validation
// =====================================================

function validatePhone() {
  const phone = phoneInput.value.trim();

  if (phone === "") {
    showError(phoneInput, "Please Enter Your Phone Number");

    return false;
  }

  if (!/^\d+$/.test(phone)) {
    showError(phoneInput, "Phone number must contain numbers only");

    return false;
  }

  const prefix = phone.substring(0, 3);

  if (
    prefix !== "010" &&
    prefix !== "011" &&
    prefix !== "015" &&
    prefix !== "012"
  ) {
    showError(phoneInput, "Phone number must start with 010, 011, 012 or 015");

    return false;
  }

  if (phone.length !== 11) {
    showError(phoneInput, "Phone number must contain 11 digits");

    return false;
  }

  removeError(phoneInput);

  return true;
}

// =====================================================
// Address Validation
// =====================================================

function validateAddress() {
  const address = addressInput.value.trim();

  if (address === "") {
    showError(addressInput, "Please Enter Your Address");

    return false;
  }

  removeError(addressInput);

  return true;
}

// =====================================================
// Place Order
// =====================================================

placeOrderBtn.addEventListener("click", () => {
  const nameValid = validateName();
  const phoneValid = validatePhone();
  const addressValid = validateAddress();

  if (!nameValid || !phoneValid || !addressValid) {
    return;
  }

  // =====================================================
  // Order Sent Successfully
  // =====================================================

  const checkoutForm = document.querySelector("#checkoutForm");

  const checkoutLoading = document.querySelector("#checkoutLoading");

  const checkoutSuccess = document.querySelector("#checkoutSuccess");

  // Hide form
  checkoutForm.classList.add("d-none");

  // Show loading
  checkoutLoading.classList.remove("d-none");

  // Simulate sending order
  setTimeout(() => {
    // 1. Grab current cart and total
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const finalTotal = parseFloat(modalTotal.textContent.replace("$", ""));

    // 2. Get previous orders
    let localOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
    // calculate order id
    let nextId = 1;
    if (localOrders.length > 0) {
      nextId = parseInt(localOrders[0].orderId) + 1;
    }
    // 3. Date and time
    const now = new Date();

    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 4. Build Order
    const newOrder = {
      orderId: nextId.toString(), // Replaced the random Math block with nextId!
      date: dateStr,
      time: timeStr,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),

      status: "Processing",

      totalPrice: finalTotal,

      customerName: fullNameInput.value.trim(),

      customerPhone: phoneInput.value.trim(),

      customerAddress: addressInput.value.trim(),
    };

    // 5. Save Order
    localOrders.unshift(newOrder);

    localStorage.setItem("myOrders", JSON.stringify(localOrders));

    // Hide loading
    checkoutLoading.classList.add("d-none");

    // Show success
    checkoutSuccess.classList.remove("d-none");

    // Clear Cart
    localStorage.removeItem("cart");

    // Update cart badge
    updateCartBadge();

    // Update cart page
    displayCart();
  }, 2000);
});

// -------------------------------------------------
