let products = [];
const params = new URLSearchParams(window.location.search);
const name = params.get("name");


async function initialLoadProducts() {
  try {
    const response = await fetch("https://api.rainforestapi.com/request?api_key=70E345C911924B8FA344650B66FBCC23&type=search&amazon_domain=amazon.com&search_term=home+necessities&sort_by=featured", {
       method: "GET"
    }); 
    const data = await response.json();

    products = data.search_results;
    displayProducts();
  }
   catch (error) {
    console.error("Error loading products:", error);

    document.getElementById("product-list").innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger">Failed to load products.</p>
      </div>
    `;
  }
}

function displayProducts() {
    const productList = document.getElementById("product-list");

    productList.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "col-md-4 col-sm-6 mb-4";

      const image = product.image || "images/placeholder.jpg";

      const title = product.title || "Error Loading Name";

      const description =
        product.product?.description?.substring(0, 100) + "..." ||
        "No description available.";

      const price = product.price?.raw || "Unavailable";

      const rating = product.rating || "N/A";

      card.innerHTML = `
        <div class="card h-100 shadow-sm product-card">

          <img src="${image}"
               class="card-img-top"
               alt="${title}">

          <div class="card-body d-flex flex-column">

            <h5 class="card-title">${title}</h5>

            <div d-flex justify-content-between align-items-center mb-2>
            <p class="fw-bold fs-5">Price: ${price}</p>

            <p class="text-warning">
              Product Rating: ${rating}
            </p>
            </div>

            <div class="mt-auto">

              <a href="product.html?name=${product.title}"
                 class="btn btn-outline-dark w-100 mb-2">
                View Details
              </a>

              <button class="btn btn-primary w-100 add-cart-btn">
                Add to Cart
              </button>

            </div>
          </div>
        </div>
      `;

      card.querySelector(".add-cart-btn").addEventListener("click", () => {
        addToCart({
          asin: product.asin,
          name: title,
          price: product.price?.value || 0,
          image: image,
          quantity: 1
        });
      });

      productList.appendChild(card);
    });

  } 

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find(item => item.asin === product.asin);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  alert(`${product.name} has been added to cart! 
  Click on the Cart button to view your saved items or keep browsing to add more items here`);
}




initialLoadProducts();

async function searchItems() {
  const searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("keypress",async function (event) {
  if (event.key === "Enter") {
    const searchTerm = searchBar.value.toLowerCase();
    try {
    const response = await fetch(`https://api.rainforestapi.com/request?api_key=70E345C911924B8FA344650B66FBCC23&type=search&amazon_domain=amazon.com&search_term=${searchTerm}&sort_by=featured`, {
       method: "GET"
    }); 
    const data = await response.json();

    products = data.search_results;
    document.getElementById("product-list-initial").id = "product-list";
    displayProducts();
  }
   catch (error) {
    console.error("Error loading products:", error);

    document.getElementById("product-list").innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger">Failed to load products.</p>
      </div>
    `;
  }
  }})
}
searchItems();













async function loadIndividualDetails() {
  try {
    const response = await fetch(`https://api.rainforestapi.com/request?api_key=70E345C911924B8FA344650B66FBCC23&type=search&amazon_domain=amazon.com&search_term=${name}&include_products_count=1`, {
      method: "GET"
    });
    const data = await response.json();
    const product = data.search_results?.[0];

    individualProduct(product);

  } catch (error) {
    console.error("Error loading product:", error);
  }
}

function individualProduct (product) {
  document.getElementById("productTitle").textContent = product.title;
  document.getElementById("brandName").textContent = product.brand;
  document.getElementById("totalRatings").textContent = product.ratings_total;
  document.getElementById("productRating").textContent = product.rating
  document.getElementById("individualProductPrice").textContent = product.prices[0].raw; 
  document.getElementById("description").textContent = product.product.description
  document.getElementById("mainImage").src = product.image
  reviews = product.product.top_reviews

  const reviewsContainer = document.getElementById("reviewsContainer");
  reviewsContainer.innerHTML = "";

  if (!reviews || reviews.length === 0) {
    reviewsContainer.innerHTML = `
      <div class="col-12">
        <p>No reviews available.</p>
      </div>
    `;
    return;
  }

  reviews.forEach(review => {
    const reviewCard = document.createElement("div");
    reviewCard.className = "col-md-6";

    reviewCard.innerHTML = `
      <div class="card h-100 shadow-sm p-3">
        
        <h5 class="card-title">${review.title || "No Title"}</h5>
        
        <p class="text-warning">
          Rating: ${review.rating || "N/A"} ★
        </p>
        
        <p class="card-text">
          ${review.body || "No review text available."}
        </p>
        
        <p class="text-muted small">
          By ${review.profile?.name || "Anonymous"}  
          <br>
          ${review.date?.raw || ""}
        </p>

      </div>
    `;
});
    document.querySelector(".btn.btn-dark.w-100.mt-3").addEventListener("click", () => {
        addToCart({
          asin: product.product.asin,
          name: product.title,
          price: product.prices[0].raw || 0,
          image: product.image,
          quantity: 1
        });
      });

    reviewsContainer.appendChild(reviewCard);
  
}

loadIndividualDetails() ;







function displayCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");

  if (!cartItems || !totalElement) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItems.innerHTML = "";

  let total = 0;

  // Empty cart 
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center mt-5">
        <h4>Your cart is empty 🛒</h4>
      </div>
    `;
    totalElement.textContent = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    const subtotal = price * quantity;
    total += subtotal;

    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm";

    card.innerHTML = `
      <div class="row p-3 align-items-center">

        <div class="col-md-2 text-center">
          <img src="${item.image}" 
               alt="${item.name}" 
               class="img-fluid" 
               style="max-height:100px;">
        </div>

        <div class="col-md-6">
          <h5>${item.name}</h5>
          <p class="mb-1">Price: $${price.toFixed(2)}</p>
          <p class="mb-1">Quantity: ${quantity}</p>
          <p class="mb-1"><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>
        </div>

        <div class="col-md-4 text-center">
          
          <button class="btn btn-sm btn-secondary increase-btn" data-index="${index}">
            +
          </button>

          <button class="btn btn-sm btn-secondary decrease-btn" data-index="${index}">
            -
          </button>

          <button class="btn btn-sm btn-danger remove-btn mt-2" data-index="${index}">
            Remove
          </button>

        </div>

      </div>
    `;

    cartItems.appendChild(card);
  });

  totalElement.textContent = total.toFixed(2);

  // REMOVE ITEM
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);

      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));

      displayCart();
    });
  });

  // INCREASE QUANTITY
  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);

      cart[index].quantity += 1;

      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
    });
  });

  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);

      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
    });
  });
}

displayCart();













function loadCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");

  if (!container || !totalEl) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "d-flex justify-content-between border-bottom py-2";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>Qty: ${item.quantity}</small>
      </div>
      <div>
        $${subtotal.toFixed(2)}
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Your order has been placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadCheckout();

  document.getElementById("placeOrderBtn")
    .addEventListener("click", placeOrder);
});

