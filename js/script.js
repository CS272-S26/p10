const sample_products = [
  {name: "Shirt", price: 20},
  {name: "Shoes", price: 50}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container){
    return;
  } 
  sample_products.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${p.name}</h3><p>$${p.price}</p><button onclick='addToCart(${JSON.stringify(p)})'>Add</button>`;
    container.appendChild(div);
  }
);
}

renderProducts();