// Homepage'de olup olmadığımızı kontrol ediyoruz.
if (window.location.pathname !== "/") {
  console.log("Homepage'de değilsiniz.");
}

// Favorilere eklenenler için local storage kontrolü.
const storedProducts = localStorage.getItem("favoriteProducts");
const storedFavorites = localStorage.getItem("favorites")
  ? JSON.parse(localStorage.getItem("favorites"))
  : [];

// Eğer storage'da varsa storage'dan ürünleri alıyor, yoksa linkten fetchliyor.
function loadProducts() {
  if (storedProducts) {
    createCarousel(JSON.parse(storedProducts));
  } else {
    fetch(
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("favoriteProducts", JSON.stringify(data));
        createCarousel(data);
      })
      .catch((error) => console.error("Fetchlenemedi."));
  }
}

// Carousel
function createCarousel(products) {
  const carousel = document.createElement("div");
  carousel.className = "product-carousel";

  const title = document.createElement("h1");
  title.textContent = "Beğenebileceğinizi düşündüklerimiz";
  carousel.appendChild(title);

  const slider = document.createElement("div");
  slider.className = "carousel-slider";

  const leftArrow = document.createElement("button");
  leftArrow.className = "carousel-arrow left";
  leftArrow.innerHTML = "❮";
  slider.appendChild(leftArrow);

  const trackContainer = document.createElement("div");
  trackContainer.className = "carousel-track-container";

  const track = document.createElement("div");
  track.className = "carousel-track";
  trackContainer.appendChild(track);
  slider.appendChild(trackContainer);

  const rightArrow = document.createElement("button");
  rightArrow.className = "carousel-arrow right";
  rightArrow.innerHTML = "❯";
  slider.appendChild(rightArrow);

  carousel.appendChild(slider);

  products.forEach((product) => {
    const item = document.createElement("div");
    item.className = "carousel-item";

    const heart = document.createElement("div");
    heart.className = `favorite-heart ${
      storedFavorites.includes(product.id) ? "active" : ""
    }`;
    heart.innerHTML = "♥";
    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      heart.classList.toggle("active");
      updateFavorites(product.id);
    });
    item.appendChild(heart);

    const img = document.createElement("img");
    img.src = product.img;
    img.alt = product.name;
    item.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = product.name;
    item.appendChild(name);

    const priceContainer = document.createElement("div");
    priceContainer.className = "price-container";

    if (product.price !== product.original_price) {
      const discount = Math.round(
        100 - (product.price / product.original_price) * 100
      );

      priceContainer.innerHTML = `
          <span class="current-price">${product.price} TL</span>
          <span class="original-price">${product.original_price} TL</span>
          <span class="discount">%${discount}</span>
        `;
    } else {
      priceContainer.innerHTML = `<span class="price">${product.price} TL</span>`;
    }
    item.appendChild(priceContainer);

    const button = document.createElement("button");
    button.className = "add-to-cart";
    button.textContent = "Sepete Ekle";
    item.appendChild(button);

    item.addEventListener("click", () => window.open(product.url, "_blank"));
    track.appendChild(item);
  });

  document
    .querySelector(".hero.banner")
    ?.insertAdjacentElement("afterend", carousel);

  let currentIndex = 0;
  const itemWidth = 250;
  const visibleItems = 4;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  leftArrow.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  rightArrow.addEventListener("click", () => {
    if (currentIndex < products.length - visibleItems) {
      currentIndex++;
      updateCarousel();
    }
  });
}

function updateFavorites(productId) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const index = favorites.indexOf(productId);

  if (index === -1) {
    favorites.push(productId);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// CSS styling
if (!document.querySelector("#carousel-styles")) {
  const style = document.createElement("style");
  style.id = "carousel-styles";
  style.textContent = `
      .product-carousel {
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 40px;
        position: relative;
      }
  
      .product-carousel h1 {
        font-size: 24px;
        font-weight: 900;
        color: #e65100;
        background-color:rgb(249, 242, 230);
        padding: 14px 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        display: inline-block;
      }
  
      .carousel-slider {
        display: flex;
        align-items: center;
        gap: 10px;
      }
  
      .carousel-track-container {
        overflow: hidden;
        flex: 1;
      }
  
      .carousel-track {
        display: flex;
        transition: transform 0.3s ease-in-out;
        gap: 15px;
      }
  
      .carousel-item {
        min-width: 220px;
        max-width: 220px;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 15px;
        position: relative;
        background: white;
        transition: transform 0.3s, border 0.3s;
      }
  
      .carousel-item:hover {
        transform: translateY(-5px);
        border: 2px solid #e65100;
       
      }
  
      .carousel-arrow {
        background: white;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        color: #e65100;
        font-weight: bold;
      }
  
      .carousel-arrow:hover {
        background: #bf360c;
        color: white;
      }
  
      .favorite-heart {
        position: absolute;
        top: 15px;
        right: 15px;
        color: #ccc;
        font-size: 24px;
        cursor: pointer;
        z-index: 2;
      }
  
      .favorite-heart.active {
        color: #bf360c;
      }
  
      .carousel-item img {
        width: 100%;
        height: 160px;
        object-fit: contain;
        margin-bottom: 10px;
      }
  
      .carousel-item h3 {
        font-size: 16px;
        font-weight: bold;
        margin: 8px 0;
        color: #333;
      }
  
      .price-container {
        margin: 12px 0;
        font-size: 16px;
        font-weight: bold;
      }
  
      .current-price {
        color: #e65100;
        font-weight: 900;
        margin-right: 8px;
        font-size: 16px;
      }
  
      .original-price {
        text-decoration: line-through;
        color: #999;
        font-size: 14px;
        margin-right: 8px;
      }
  
      .discount {
        background: #e65100;
        color: white;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: bold;
      }
  
      .add-to-cart {
        width: 100%;
        background: rgb(253, 238, 227);
        color: #e65100;
        font-weight: bold;
        font-size: 15px;
        border: none;
        padding: 10px;
        border-radius: 16px;
        cursor: pointer;
        margin-top: 8px;
      }
  
      .add-to-cart:hover {
        background: #e65100;
        color: white;
      }
    `;
  document.head.appendChild(style);
}

loadProducts();
