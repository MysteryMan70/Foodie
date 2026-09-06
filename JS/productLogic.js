// ProductDetailsLogic///////////////////////

// API
const API_URL =
  "https://gist.githubusercontent.com/138momen/fffa5570c7d705de4148cb496e835366/raw/DBFoodieProject.json";

// =====================================================
// Display Product
// =====================================================

function displayProduct(product) {
  document.querySelector("#name").textContent = product.name;
  document.querySelector("#category").textContent = product.category;
  document.querySelector("#rating").textContent = product.rating;
  document.querySelector("#price").textContent = `$${product.price.toFixed(2)}`;

  document.querySelector("#desc").textContent = product.description;

  document.querySelector(".productImage img").src = product.imageUrl;

  updateFavorite(product.id);
}

// =====================================================
// Get Same Products By Category
// =====================================================

function displaySameProducts(products) {
  const container = document.querySelector("#sameProductsContainer");

  container.innerHTML = "";

  products.forEach((product) => {
    container.innerHTML += `
      <div class="col-12 col-md-6 col-lg-3 d-flex">

        <div
          class="card h-100 w-100"
          onclick="changeProduct(${product.id})"
        >

          <img
            src="${product.imageUrl}"
            class="card-img-top"
            alt="${product.name}"
          />

          <div class="card-body">

            <h5 class="card-title fw-semibold mb-1">
              ${product.name}
            </h5>

            <p class="text-secondary mb-2">
              ${product.category}
            </p>

            <div class="d-flex justify-content-between align-items-center">

              <p class="fw-bold price mb-0">
                $${product.price.toFixed(2)}
              </p>

              <span>
                <i class="fa-solid fa-star text-warning"></i>
                ${product.rating}
              </span>

            </div>

            <button
              class="btn addCart w-100 mt-3"
              onclick="addSameProductToCart(event, ${product.id})"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>
    `;
  });
}

// =====================================================
// Add Same Product To Cart
// =====================================================

async function addSameProductToCart(event, productId) {
  // Prevent clicking the card itself
  event.stopPropagation();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    const product = data.menu.find((product) => product.id === productId);

    if (!product) {
      console.error("Product not found");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find((item) => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;

      if (existingProduct.quantity > 10) {
        existingProduct.quantity = 10;
      }
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
  } catch (error) {
    console.error(error);
  }
}

// =====================================================
// Change Product
// =====================================================

function changeProduct(id) {
  const productSection = document.querySelector(".productDetails");

  // Scroll smoothly to Product Details
  productSection.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  // Change URL
  const url = new URL(window.location.href);

  url.searchParams.set("id", id);

  window.history.pushState({}, "", url);

  // Update product
  getProduct();
}

// =====================================================
// Quantity Logic
// =====================================================

const decreaseBtn = document.querySelector("#decreaseBtn");
const increaseBtn = document.querySelector("#increaseBtn");
const quantityValue = document.querySelector("#quantityValue");

let quantity = 1;

function updateQuantity() {
  quantityValue.textContent = quantity;

  decreaseBtn.disabled = quantity === 1;

  increaseBtn.disabled = quantity === 10;
}

increaseBtn.addEventListener("click", () => {
  if (quantity < 10) {
    quantity++;

    updateQuantity();
  }
});

decreaseBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;

    updateQuantity();
  }
});

updateQuantity();

// =====================================================
// Favorite Logic
// =====================================================

const favoriteBtn = document.querySelector("#favoriteBtn");
const favoriteIcon = favoriteBtn.querySelector("i");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Update favorite button
function updateFavorite(productId) {
  const isFavorite = favorites.some((product) => product.id === productId);

  if (isFavorite) {
    favoriteBtn.classList.add("active");

    favoriteIcon.classList.remove("fa-regular");
    favoriteIcon.classList.add("fa-solid");
  } else {
    favoriteBtn.classList.remove("active");

    favoriteIcon.classList.remove("fa-solid");
    favoriteIcon.classList.add("fa-regular");
  }
}

// Add / Remove Favorite
favoriteBtn.addEventListener("click", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  // Check if product already exists
  const existingProduct = favorites.find((product) => product.id === productId);

  if (existingProduct) {
    // Remove from favorites
    favorites = favorites.filter((product) => product.id !== productId);
  } else {
    // Get current product data from page
    const product = {
      id: productId,
      name: document.querySelector("#name").textContent,
      category: document.querySelector("#category").textContent,
      price: Number(
        document.querySelector("#price").textContent.replace("$", ""),
      ),
      imageUrl: document.querySelector(".productImage img").src,
      rating: Number(document.querySelector("#rating").textContent),
    };

    favorites.push(product);
  }

  // Save favorites
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update button
  updateFavorite(productId);

  // Update favorite dot in navbar
  updatefavoritedot();
});

// =====================================================
// Main Add To Cart
// =====================================================

const addCartBtn = document.querySelector("#addCartBtn");

addCartBtn.addEventListener("click", () => {
  // نجيب الـ ID من الـ URL
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  const quantityToAdd = quantity;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find((product) => product.id === productId);

  if (existingProduct) {
    existingProduct.quantity += quantityToAdd;

    if (existingProduct.quantity > 10) {
      existingProduct.quantity = 10;
    }
  } else {
    // Get current product from page

    const productName = document.querySelector("#name").textContent;
    const category = document.querySelector("#category").textContent;

    const price = Number(
      document.querySelector("#price").textContent.replace("$", ""),
    );

    const imageUrl = document.querySelector(".productImage img").src;

    cart.push({
      id: productId,

      name: productName,

      category: category,

      price: price,

      imageUrl: imageUrl,

      quantity: quantityToAdd,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
});
