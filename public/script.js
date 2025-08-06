// Global variable for custom modal (general alerts)
let customModal = document.getElementById('customModal');
let modalMessage = document.getElementById('modalMessage');
let modalCloseButton = document.getElementById('modalCloseButton');

function saveCartToStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCartCountBadge();
  }
}


// Function to show custom modal
function showCustomModal(message) {
  if (customModal && modalMessage) {
    modalMessage.textContent = message;
    customModal.style.display = 'flex'; // Use flex to center content
  }
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    // Auto-hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}


// Function to hide custom modal
function hideCustomModal() {
  if (customModal) {
    customModal.style.display = 'none';
  }
}

// Event listener for closing the general modal
if (modalCloseButton) {
  modalCloseButton.addEventListener('click', hideCustomModal);
}

// Close general modal if user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === customModal) {
    hideCustomModal();
  }
});

// Product Quick View Modal elements
let productQuickViewModal = document.getElementById('productQuickViewModal');
let quickViewCloseButton = document.getElementById('quickViewCloseButton');
let quickViewImage = document.getElementById('quickViewImage');
let quickViewName = document.getElementById('quickViewName');
let quickViewPrice = document.getElementById('quickViewPrice');
let quickViewDescription = document.getElementById('quickViewDescription');
let quickViewAddToCartBtn = document.getElementById('quickViewAddToCartBtn');

// Function to show product quick view modal
function showProductQuickViewModal(product) {
  if (productQuickViewModal && quickViewImage && quickViewName && quickViewPrice && quickViewDescription && quickViewAddToCartBtn) {
    quickViewImage.src = product.image;
    quickViewImage.alt = product.name;
    quickViewName.textContent = product.name;
    quickViewPrice.textContent = `₹${product.price}`;
    quickViewDescription.textContent = product.description;

    // Remove previous event listener from the quick view's add to cart button
    // This prevents multiple event listeners from stacking up
    const oldBtn = quickViewAddToCartBtn;
    const newBtn = oldBtn.cloneNode(true); // Clone to remove existing listeners
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    quickViewAddToCartBtn = newBtn; // Update the reference to the new button

    // Add new event listener for the current product
  quickViewAddToCartBtn.onclick = () => {
  let existingItem = cartItems.find(item => item.name === product.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      name: product.name,
      price: parseFloat(product.price),  
      quantity: 1                      
    });
  }

  showToast(`${product.name} added to cart!`, { name: product.name, price: product.price });
  updateCartCountBadge();
  saveCartToStorage();
  hideProductQuickViewModal();
};
 productQuickViewModal.style.display = 'flex'; // Show the quick view modal
  }
}

// Function to hide product quick view modal
function hideProductQuickViewModal() {
  if (productQuickViewModal) {
    productQuickViewModal.style.display = 'none';
  }
}

// Event listener for closing the quick view modal
if (quickViewCloseButton) {
  quickViewCloseButton.addEventListener('click', hideProductQuickViewModal);
}

// Close quick view modal if user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === productQuickViewModal) {
    hideProductQuickViewModal();
  }
});


// Cart System
let cartItems = [];
function saveCartToStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCartCountBadge(); // also restores the badge
  }
}
function updateCartCountBadge() {
  const badge = document.getElementById("cartCountBadge");
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => 
{ loadCartFromStorage(); // 🧠 Load cart from local storage

  // Add "Add to Cart" buttons to main product listings
  const products = document.querySelectorAll(".col-4");
  products.forEach((product, index) => {
    const priceText = product.querySelector("p").innerText;
    const price = parseInt(priceText.replace("₹", ""));
    const name = product.querySelector("h4").innerText;

    // Add "Add to Cart" button to the main product card
    const btn = document.createElement("button");
    btn.innerText = "Add to Cart 🛒";
    btn.style.marginTop = "10px";
    btn.classList.add("btn");
    product.appendChild(btn);

    // Event listener for the main "Add to Cart" button
    btn.addEventListener("click", () => {
    let existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ name, price, quantity: 1 });  
  }

  showToast(`${name} added to cart!`, { name, price });
  updateCartCountBadge();  
  saveCartToStorage();
});

    // Quick View Buttons on product cards
    const quickViewBtn = product.querySelector(".quick-view-btn");
    if (quickViewBtn) {
      quickViewBtn.addEventListener("click", (e) => {
        // Prevent the default "Add to Cart" button's click if it's somehow triggered
        e.stopPropagation();

        const productElement = e.target.closest(".col-4");
        const productData = {
          name: productElement.dataset.name,
          price: parseInt(productElement.dataset.price),
          description: productElement.dataset.description,
          image: productElement.querySelector("img").src
        };
        showProductQuickViewModal(productData);
      });
    }
  });


  // Cart Icon functionality
  const cartIcon = document.getElementById('cartIcon');
if (cartIcon) {
  const cartModal = document.getElementById('cartModal');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');


  const cartIcon = document.getElementById('cartIcon');
if (cartIcon) {
  const cartModal = document.getElementById('cartModal');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');

  cartIcon.addEventListener('click', () => {
    if (cartItems.length === 0) {
      showCustomModal("Your cart is empty.");
      return;
    }

    // Clear previous items
    cartItemsList.innerHTML = "";
    let total = 0;

    cartItems.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.innerHTML = `
        <p style="margin: 0; display: flex; justify-content: space-between; align-items: center;">
          <strong>${item.name}</strong>
          <button class="remove-btn" data-index="${index}">❌</button>
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0 15px;">
          <div>
            <button class="qty-btn" data-index="${index}" data-action="decrease">➖</button>
            <span style="margin: 0 10px;">${item.quantity}</span>
            <button class="qty-btn" data-index="${index}" data-action="increase">➕</button>
          </div>
          <span>₹${item.price * item.quantity}</span>
        </div>
      `;
      cartItemsList.appendChild(itemElement);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = `Total: ₹${total}`;
    cartModal.style.display = "flex";
  });

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = "none";
    }
  });

  // ➕ ➖ quantity + ❌ remove button handling
  cartItemsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-btn')) {
      const index = parseInt(e.target.dataset.index);
      const action = e.target.dataset.action;

      if (action === 'increase') {
        cartItems[index].quantity += 1;
      } else if (action === 'decrease') {
        cartItems[index].quantity -= 1;
        if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1);
     }
        updateCartCountBadge(); 
        cartIcon.click();        
      }
      cartIcon.click(); // Refresh cart modal
    }

    if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.dataset.index);
      cartItems.splice(index, 1);
      updateCartCountBadge();  
      cartIcon.click();

    }
  });
}
 

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = "none";
    }
  });
}


  // Add sort dropdown
  const container = document.querySelector(".small-container");
const sortBox = document.createElement("select");
sortBox.innerHTML = `
  <option value="">Sort by Price</option>
  <option value="low">Low to High</option>
  <option value="high">High to Low</option>
`;
sortBox.style.margin = "20px 14px";
sortBox.style.padding = "8px 12px";
sortBox.style.borderRadius = "5px";
sortBox.style.border = "1px solid #ccc";
sortBox.style.outline = "none";
sortBox.style.cursor = "pointer";
sortBox.style.fontSize = "16px";
container.prepend(sortBox);

sortBox.addEventListener("change", (e) => {
  const value = e.target.value;
  const productRow = document.querySelector(".small-container .row");
  const productsArray = Array.from(productRow.querySelectorAll(".col-4"));

  productsArray.sort((a, b) => {
    const priceA = parseFloat(a.querySelector("p").innerText.replace(/[^0-9.]/g, ''));
    const priceB = parseFloat(b.querySelector("p").innerText.replace(/[^0-9.]/g, ''));

    if (value === "low") {
      return priceA - priceB;
    } else if (value === "high") {
      return priceB - priceA;
    }
    return 0;
  });

  // Clear existing products and append sorted ones
  productRow.innerHTML = '';
  productsArray.forEach(product => productRow.appendChild(product));
});

  // Scroll to Top Button
  const topBtn = document.createElement("button");
  topBtn.innerText = "↑ Top"; // Changed text to an arrow for modern look
  topBtn.style.position = "fixed";
  topBtn.style.bottom = "30px";
  topBtn.style.right = "30px";
  topBtn.style.padding = "12px 18px";
  topBtn.style.backgroundColor = "orangered";
  topBtn.style.color = "white";
  topBtn.style.border = "none";
  topBtn.style.borderRadius = "50%"; // Make it round
  topBtn.style.cursor = "pointer";
  topBtn.style.display = "none";
  topBtn.style.fontSize = "20px";
  topBtn.style.boxShadow = "0 5px 15px rgba(255, 69, 0, 0.4)";
  topBtn.style.zIndex = "900"; // Ensure it's above other content
  document.body.appendChild(topBtn);

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 200 ? "block" : "none";
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Check if it's an internal link (starts with #)
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault(); // Prevent default only for internal links

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
      // For external links like login.html, let default behavior happen
    });
  });


  // Hero Carousel Logic
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentSlide = 0;
  let slideInterval;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideShow();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  // Initialize carousel
  showSlide(0);
  startSlideShow();

}); // End DOMContentLoaded

// Toggle Menu for small screens
var menuItems = document.getElementById("menuItems");
menuItems.style.maxHeight = "0px";

function menutoggle() {
  if (menuItems.style.maxHeight == "0px") {
    menuItems.style.maxHeight = "200px"; // Adjust as needed
  } else {
    menuItems.style.maxHeight = "0px";
  }
}

let lastAddedItem = null;

function showToast(message, item = null) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const undoBtn = document.getElementById("undoBtn");

  toastMessage.textContent = message;
  toast.classList.add("show");

  lastAddedItem = item;

  undoBtn.style.display = item ? "inline-block" : "none";

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.getElementById("undoBtn").addEventListener("click", () => {
  if (lastAddedItem) {
    const index = cartItems.findIndex(item => item.name === lastAddedItem.name);
    if (index !== -1) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      } else {
        cartItems.splice(index, 1);
      }
      updateCartCountBadge();
      saveCartToStorage();
      lastAddedItem = null;
      cartIcon.click(); // Refresh cart
    }
  }
});

const products = [
  "Red Printed T-shirt",
  "Black Sports Shoes",
  "Grey Sports Pant",
  "Navy Blue T-shirt",
  "Casual Shoe Mens",
  "Black Puma T-shirt",
  "HRX Socks",
  "Black Fossil Watch",
  "Roadster Watch",
  "Black HRX Shoe",
  "Grey Nike Shoe",
  "Black Jogger Pant"
];

const searchBar = document.getElementById("searchBar");
const suggestionList = document.getElementById("suggestionList");

function handleSearch(query) {
  query = query.toLowerCase().trim();
  suggestionList.innerHTML = "";

  if (!query) {
    suggestionList.style.display = "none";
    return;
  }

  const matches = products.filter(p => p.toLowerCase().includes(query));
  if (matches.length === 0) {
    suggestionList.style.display = "none";
    return;
  }

  matches.forEach(product => {
    const li = document.createElement("li");
    li.textContent = product;
    li.onclick = () => {
      searchBar.value = product;
      suggestionList.style.display = "none";
      scrollToProduct(product);
    };
    suggestionList.appendChild(li);
  });

  suggestionList.style.display = "block";
}

function scrollToProduct(productName) {
  const items = document.querySelectorAll(".col-4");
  for (let item of items) {
    if (item.querySelector("h4")?.innerText === productName) {
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      item.style.outline = "2px dashed orangered";
      setTimeout(() => (item.style.outline = "none"), 2000);
      break;
    }
  }
}

// Hide suggestions if clicking outside
document.addEventListener("click", (e) => {
  if (!searchBar.contains(e.target) && !suggestionList.contains(e.target)) {
    suggestionList.style.display = "none";
  }
});

  const orders = [
    "Someone from Delhi just bought a Combo T-shirt Pack",
    "Someone from Mumbai purchased a Stylish Sneakers",
    "Someone from Bangalore ordered a Sports Watch",
    "Suraj meher from Kolkata bought a Travel Backpack",
    "Rajib loachan from Hyderabad purchased a Sunglasses Pack",
    "Someone from Chennai ordered Wireless Earbuds",
    "Someone from Pune bought a Cotton Hoodie",
    "Someone from Jaipur purchased a Casual Shirt"
  ];

  function showLiveOrder() {
    const popup = document.getElementById('liveOrder');
    const orderText = document.getElementById('orderText');
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    orderText.textContent = randomOrder;

    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 4000); // Show for 4 seconds
  }

  // Show every 10–30 seconds randomly
  setInterval(() => {
    showLiveOrder();
  }, Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000);


