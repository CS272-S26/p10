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

    // Clear loading placeholders if needed
    productList.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "col-md-4 col-sm-6 mb-4";

      // Safe image fallback
      const image = product.image || "images/placeholder.jpg";

      // Safe title fallback
      const title = product.title || "Error Loading Name";

      // Safe description fallback
      const description =
        product.product?.description?.substring(0, 100) + "..." ||
        "No description available.";

      // Safe price fallback
      const price = product.price?.raw || "Unavailable";

      // Safe rating fallback
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

      // Add cart functionality
      card.querySelector(".add-cart-btn").addEventListener("click", () => {
        addToCart({
          asin: product.asin,
          name: title,
          price: product.price?.value || 0,
          image: image
        });
      });

      productList.appendChild(card);
    });

  } 

// ==========================
// CART STORAGE
// ==========================
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${product.name} added to cart!`);
}

// ==========================

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
  document.getElementById("reviewsContainer").textContent = product.product.top_reviews
}

loadIndividualDetails() ;
