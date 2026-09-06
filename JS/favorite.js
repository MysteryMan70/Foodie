let favoriteProducts = document.getElementById("favoriteProducts");

function displayFavorite() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favoriteProducts.innerHTML = "";

  if (favorites.length === 0) {
    favoriteProducts.innerHTML = `
  <div class="empty-favorites">
    <i class="fa-regular fa-heart"></i>
    <h3>Pick your favorite meal!</h3>
    <p>Add your favorite meals and they'll appear here.</p>
  </div>
`;

    return;
  }

  favorites.forEach((product) => {
    favoriteProducts.innerHTML += `

    <div class="productCard col-12 col-md-6 col-lg-3 d-flex">

      <div 
        class="card h-100 w-100 position-relative"
        onclick="goToProduct(${product.id})"
      >

        <!-- Image -->
        <img 
          src="${product.imageUrl}" 
          class="card-img-top"
          alt="${product.name}"
        />

        <!-- Favorite Button -->
        <button 
          class="favorite-btn"
          onclick="removeFromFavorite(${product.id})"
        >
          <i class="fa-solid fa-heart"></i>
        </button>

        <!-- Card Body -->
        <div class="card-body d-flex flex-column">

          <h5 class="card-title fw-semibold mb-1">
            ${product.name}
          </h5>

          <p class="text-secondary mb-2">
            ${product.category}
          </p>

          <div class="d-flex mb-3 justify-content-between align-items-center">

            <p class="fw-bold price mb-0">
              $${Number(product.price).toFixed(2)}
            </p>

            <span>
              <i class="fa-solid fa-star text-warning"></i>
              ${product.rating}
            </span>

          </div>

          <!-- Add Cart -->
          <button 
            class="btn addCart w-100 mt-auto"
            onclick="addFavoriteToCart(${product.id})"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>

  `;
  });
}

function removeFromFavorite(productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter((product) => product.id != productId);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  displayFavorite();
  updatefavoritedot();
}

// Add to Cart Logic//////////////////////
function addFavoriteToCart(productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  let product = favorites.find((product) => product.id == productId);

  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingProduct = cart.find((item) => item.id == productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      category: product.category,
      rating: product.rating,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

displayFavorite();
