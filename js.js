// 全局變數與初始化
const isLoggedIn = localStorage.getItem('isLoggedIn');
let userProfile = JSON.parse(localStorage.getItem('profile')) || {};
let selectedRating = 0; // 評分存儲
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// === 會員登入與註冊功能 ===
// 登入/註冊表單處理
document.getElementById('auth-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        localStorage.setItem('user', JSON.stringify({ username, password }));
        localStorage.setItem('isLoggedIn', true);
        alert('登入/註冊成功！');
        window.location.href = 'profile.html';
    } else {
        alert('請輸入帳號與密碼！');
    }
});

// === 會員資料管理 ===
function loadUserProfile() {
    if (userProfile.name) document.getElementById('name').value = userProfile.name;
    if (userProfile.phone) document.getElementById('phone').value = userProfile.phone;
    if (userProfile.address) document.getElementById('address').value = userProfile.address;
    if (userProfile.creditCard) document.getElementById('credit-card').value = userProfile.creditCard;

    document.getElementById('credit-card-extra').style.display = userProfile.creditCard ? 'none' : 'block';
}

// 保存會員資料
document.getElementById('profile-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const creditCard = document.getElementById('credit-card').value;
    const cvc = document.getElementById('cvc').value;
    const expiry = document.getElementById('expiry').value;

    const visaMasterRegex = /^4[0-9]{12}(?:[0-9]{3})?$|^5[1-5][0-9]{14}$/;
    if (!visaMasterRegex.test(creditCard)) {
        alert('請輸入有效的 VISA 或 MasterCard 信用卡號！');
        return;
    }

    userProfile = { name, phone, address, creditCard };
    localStorage.setItem('profile', JSON.stringify(userProfile));
    alert('資料已儲存！');
});

// === 商品評論功能 ===
function initializeSampleReviews() {
    const sampleReviews = [
        { rating: 5, text: '這是非常棒的商品！', user: '用戶A' },
        { rating: 4, text: '性價比很高，值得推薦。', user: '用戶B' },
        { rating: 3, text: '品質不錯，但包裝稍微損壞。', user: '用戶C' },
    ];
    sampleReviews.forEach(review => addReviewToPage(review));
    updateAverageRating();
}

document.getElementById('review-form')?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!checkLoginStatus()) return;

    if (selectedRating === 0) {
        alert('請選擇評分！');
        return;
    }

    const reviewText = document.getElementById('review').value.trim();
    const userName = userProfile.name || '匿名用戶';

    if (!reviewText) {
        alert('請輸入評論內容！');
        return;
    }

    addReviewToPage({ rating: selectedRating, text: reviewText, user: userName });
    updateAverageRating();

    document.getElementById('review-form').reset();
    selectedRating = 0;
});

// === 漢堡選單與頭像功能 ===
document.getElementById('menu-btn')?.addEventListener('click', () => {
    document.getElementById('dropdown-menu').classList.toggle('hidden');
});

document.getElementById('user-avatar')?.addEventListener('click', () => {
    if (isLoggedIn) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'auth.html';
    }
});
document.querySelectorAll('.has-submenu').forEach(item => {
    const submenu = item.nextElementSibling;
    item.addEventListener('mouseenter', () => {
        submenu.classList.remove('hidden');
    });
    item.addEventListener('mouseleave', () => {
        submenu.classList.add('hidden');
    });
    submenu.addEventListener('mouseenter', () => {
        submenu.classList.remove('hidden');
    });
    submenu.addEventListener('mouseleave', () => {
        submenu.classList.add('hidden');
    });
});

// === 購物車功能 ===
function addToCart(product) {
    // 確保商品數量為正數
    if (product.quantity <= 0) {
        alert('請選擇正確的數量！');
        return;
    }

    // 檢查購物車中是否已經存在相同商品
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += product.quantity; // 增加數量
    } else {
        cart.push(product); // 新增商品
    }

    // 更新 localStorage 並通知用戶
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} 已加入購物車！`);
    updateCartCount(); // 更新購物車數量
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalQuantity > 0 ? totalQuantity : '';
    }
}

// 頁面載入時初始化購物車數量
document.addEventListener('DOMContentLoaded', updateCartCount);


// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html')) loadUserProfile();
    if (window.location.pathname.includes('product.html')) initializeSampleReviews();
    renderCart();
});
// carousel.js
class Carousel {
    constructor(options = {}) {
        this.currentIndex = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.intervalTime = options.intervalTime || 5000;
        this.slideInterval = null;

        this.init();
    }

    init() {
        this.showSlide(this.currentIndex);
        this.startAutoPlay();
        this.bindEvents();
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            slide.classList.toggle('active', i === index);
        });
    }

    startAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }

        this.slideInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.showSlide(this.currentIndex);
        }, this.intervalTime);
    }

    bindEvents() {
        const prevBtn = document.querySelector('.prev-button');
        const nextBtn = document.querySelector('.next-button');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
                this.showSlide(this.currentIndex);
                this.startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
                this.showSlide(this.currentIndex);
                this.startAutoPlay();
            });
        }
    }
}

// 初始化輪播
document.addEventListener('DOMContentLoaded', () => {
    new Carousel({
        intervalTime: 5000
    });
});
function removeFromCart(productId) {
    // 移除指定商品
    cart = cart.filter(item => item.id !== productId);

    // 更新 localStorage 和頁面
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    alert('商品已移除！');
}

function renderCart() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    // 如果購物車為空
    if (cart.length === 0) {
        cartItems.innerHTML = `<p>購物車尚無商品。</p>`;
        return;
    }

    // 渲染購物車中的商品
    cartItems.innerHTML = cart.map(
        item => `
        <div class="cart-item">
            <p>${item.name}</p>
            <p>單價：$${item.price}</p>
            <label for="quantity-${item.id}">數量：</label>
            <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1">
            <button onclick="updateCartItem('${item.id}')">更新數量</button>
            <p>小計：$${item.price * item.quantity}</p>
            <button onclick="removeFromCart('${item.id}')">移除</button>
        </div>`
    ).join('');

    // 計算與顯示總金額
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartItems.innerHTML += `<div class="cart-total"><strong>總金額：</strong>$${total}</div>`;
}

function updateCartItem(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const newQuantity = parseInt(quantityInput.value, 10);

    // 確保數量為有效數字
    if (isNaN(newQuantity) || newQuantity <= 0) {
        alert('數量必須大於 0！');
        return;
    }

    // 更新購物車中的商品數量
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart)); // 更新 localStorage
        renderCart(); // 重新渲染購物車
        alert('數量已更新！');
    } else {
        alert('商品未找到！');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCheckoutCart() {
    const cartDetails = document.getElementById('cart-details');
    if (!cartDetails) return;

    if (cart.length === 0) {
        cartDetails.innerHTML = '<p>購物車是空的。</p>';
        return;
    }

    // 渲染購物車商品
    cartDetails.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <p>商品名稱：${item.name}</p>
            <p>單價：$${item.price}</p>
            <p>數量：${item.quantity}</p>
            <p>小計：$${item.price * item.quantity}</p>
        </div>
    `).join('');

    // 計算總金額
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('total-amount').textContent = `$${totalAmount}`;
}

// 在頁面加載時執行
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutCart();
    }
});

// 在頁面載入時檢查登入狀態
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPath = window.location.pathname;

    // 若未登入且目前頁面不是 auth.html，導向登入頁
    if (!isLoggedIn && !currentPath.includes('auth.html')) {
        window.location.href = 'auth.html';
    }
});

// 在 profile.html 加載使用者名稱與資料
function displayUserProfile() {
    const userProfile = JSON.parse(localStorage.getItem('profile'));

    if (userProfile) {
        document.getElementById('name').value = userProfile.name || '';
        document.getElementById('phone').value = userProfile.phone || '';
        document.getElementById('address').value = userProfile.address || '';
        document.getElementById('credit-card').value = userProfile.creditCard || '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html')) {
        displayUserProfile();
    }
});

document.getElementById('profile-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const creditCard = document.getElementById('credit-card').value.trim();

    const userProfile = { name, phone, address, creditCard };
    localStorage.setItem('profile', JSON.stringify(userProfile));

    alert('會員資料已更新！');
});

function updateHeaderWithUserName() {
    const userProfile = JSON.parse(localStorage.getItem('profile'));
    const userName = userProfile?.name || '訪客';

    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
        const userNameDisplay = document.createElement('span');
        userNameDisplay.textContent = `您好, ${userName}`;
        userNameDisplay.style.marginLeft = '10px';
        userNameDisplay.style.color = 'white';
        headerRight.appendChild(userNameDisplay);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        updateHeaderWithUserName();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.rating-stars span');
    let selectedRating = 0;

    stars.forEach(star => {
        // 滑鼠移入時高亮當前星星及之前的星星
        star.addEventListener('mouseover', () => {
            const value = parseInt(star.getAttribute('data-value'));
            highlightStars(value);
        });

        // 滑鼠移出時恢復到選擇的評分狀態
        star.addEventListener('mouseout', () => {
            resetStars();
            if (selectedRating > 0) {
                highlightStars(selectedRating);
            }
        });

        // 點擊選擇評分
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-value'));
            resetStars();
            highlightStars(selectedRating);
        });
    });

    // 高亮星星
    function highlightStars(value) {
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-value')) <= value) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    // 清除所有高亮
    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('selected');
        });
    }
});
