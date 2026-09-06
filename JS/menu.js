let products = [];
let currentCategory = "All";
let currentSort = "default";

let productsearch = document.getElementById("productsearch");
async function getProducts() {
  const response = await fetch(
    "https://gist.githubusercontent.com/138momen/fffa5570c7d705de4148cb496e835366/raw/DBFoodieProject.json",
  );

  const data = await response.json();

  products = data.menu;
  let category = new URLSearchParams(location.search).get("category");

  filterProducts(category || "All");
}

function displayProducts(productsToDisplay) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  for (const product of productsToDisplay) {
    const isFavorite = favorites.some((item) => item.id === product.id);

    container.innerHTML += `
      <div class="productCard col-12 col-md-6 col-lg-3 d-flex">

        <div 
          class="card h-100 w-100 position-relative"
          onclick="goToProduct(${product.id})"
        >

          <button 
            class="favorite-btn ${isFavorite ? "hover" : ""}"
            onclick="event.stopPropagation(); addToFavorite(${product.id}, this)"
          >
            <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>

          <img 
            src="${product.imageUrl}" 
            class="card-img-top" 
            alt="${product.name}" 
          />

          <div class="card-body d-flex flex-column">

            <h5 class="card-title fw-semibold mb-1">
              ${product.name}
            </h5>

            <div class="d-flex mb-3 justify-content-between align-items-center">

              <p class="fw-bold price mb-0">
                $${Number(product.price).toFixed(2)}
              </p>

              <span>
                <i class="fa-solid fa-star text-warning"></i>
                ${product.rating}
              </span>

            </div>

            <button 
              class="btn addCart w-100 mt-auto"
              onclick="addToCartFromHome(event, ${product.id})"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>
    `;
  }
}

function filterProducts(category) {
  currentCategory = category;
  filterAndDisplay();
  document.querySelectorAll(".categoryLink").forEach((link) => {
    link.classList.remove("active");
  });

  document.querySelectorAll(".categoryLink").forEach((link) => {
    if (link.textContent.trim() === category) {
      link.classList.add("active");
    }
  });
}

function filterAndDisplay() {
  let searchValue = productsearch.value.toLowerCase().trim();
  let filteredProducts = products.filter((product) => {
    let matchCategory =
      currentCategory === "All" || product.category === currentCategory;

    let matchSearch = product.name.toLowerCase().includes(searchValue);
    return matchCategory && matchSearch;
  });

  if (currentSort === "low") {
    filteredProducts.sort((a, b) => {
      return a.price - b.price;
    });
  } else if (currentSort === "high") {
    filteredProducts.sort((a, b) => {
      return b.price - a.price;
    });
  } else if (currentSort === "popular") {
    filteredProducts.sort((a, b) => {
      return b.rating - a.rating;
    });
  }
  displayProducts(filteredProducts);
}

productsearch.addEventListener("input", function () {
  filterAndDisplay();
});

let sortDropdown = document.getElementById("sortDropdown");

sortDropdown.addEventListener("change", function () {
  currentSort = this.value;
  filterAndDisplay();
});

getProducts();

// Add to Cart Logic ////////////////////////

function addToCartFromHome(event, productId) {
  event.stopPropagation();

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Get product from the Menu products array
  const product = products.find((product) => product.id === productId);

  if (!product) return;

  const existingProduct = cart.find((product) => product.id === productId);

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
}

function addToFavorite(productId, btn) {
  let product = products.find((product) => product.id === productId);

  if (!product) return;

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  let exists = favorites.some((item) => item.id === product.id);

  const heartIcon = btn.querySelector("i");

  if (!exists) {
    favorites.push({
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      category: product.category,
      rating: product.rating,
    });

    localStorage.setItem("favorites", JSON.stringify(favorites));

    btn.classList.add("hover");

    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");

    console.log("Added to favorites");
  } else {
    favorites = favorites.filter((item) => item.id !== product.id);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    btn.classList.remove("hover");

    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");

    console.log("Removed from favorites");
  }

  updatefavoritedot();
}
