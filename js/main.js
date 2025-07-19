// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAzYZMxqNmnLMGYnCyiJYPg2MbxZMt0co0",
    authDomain: "osama-91b95.firebaseapp.com",
    databaseURL: "https://osama-91b95-default-rtdb.firebaseio.com",
    projectId: "osama-91b95",
    storageBucket: "osama-91b95.appspot.com",
    messagingSenderId: "118875905722",
    appId: "1:118875905722:web:200bff1bd99db2c1caac83",
    measurementId: "G-LEM5PVPJZC"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// متغيرات عامة
let currentUser = null;
let allAds = [];

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    loadAds();
    setupEventListeners();
});

// فحص حالة المصادقة
function checkAuthState() {
    auth.onAuthStateChanged(function(user) {
        currentUser = user;
        updateUI();
    });
}

// تحديث واجهة المستخدم
function updateUI() {
    const accountBtn = document.getElementById('account-btn');
    if (currentUser) {
        accountBtn.innerHTML = `
            <img src="images/account.png" alt="حسابي">
            <span>حسابي</span>
        `;
    } else {
        accountBtn.innerHTML = `
            <img src="images/account.png" alt="تسجيل الدخول">
            <span>تسجيل الدخول</span>
        `;
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر الحساب
    document.getElementById('account-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            showUserProfile();
        } else {
            window.location.href = 'login.html';
        }
    });

    // زر إضافة إعلان
    document.getElementById('add-ad-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            window.location.href = 'add-ad.html';
        } else {
            alert('يجب تسجيل الدخول أولاً لإضافة إعلان');
            window.location.href = 'login.html';
        }
    });

    // زر الإشعارات
    document.getElementById('notifications-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showNotifications();
    });

    // زر فريق الدعم
    document.getElementById('support-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showSupport();
    });

    // زر المزيد
    document.getElementById('more-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showMore();
    });
}

// تحميل الإعلانات
function loadAds() {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '<div class="loading">جاري تحميل الإعلانات...</div>';

    database.ref('ads').orderByChild('timestamp').on('value', function(snapshot) {
        allAds = [];
        const ads = snapshot.val();
        
        if (ads) {
            Object.keys(ads).forEach(key => {
                allAds.push({
                    id: key,
                    ...ads[key]
                });
            });
            
            // ترتيب الإعلانات حسب التاريخ (الأحدث أولاً)
            allAds.sort((a, b) => b.timestamp - a.timestamp);
        }
        
        displayAds(allAds);
    });
}

// عرض الإعلانات
function displayAds(ads) {
    const productsContainer = document.getElementById('products-container');
    
    if (ads.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-ads">
                <h3>لا توجد إعلانات حالياً</h3>
                <p>كن أول من ينشر إعلاناً!</p>
            </div>
        `;
        return;
    }
    
    productsContainer.innerHTML = '';
    
    ads.forEach(ad => {
        const adElement = createAdElement(ad);
        productsContainer.appendChild(adElement);
    });
}

// إنشاء عنصر الإعلان
function createAdElement(ad) {
    const adDiv = document.createElement('div');
    adDiv.className = 'product-card';
    adDiv.onclick = () => viewAdDetails(ad.id);
    
    const date = new Date(ad.timestamp);
    const formattedDate = date.toLocaleDateString('ar-SA');
    
    adDiv.innerHTML = `
        <img src="${ad.imageUrl}" alt="${ad.title}" class="product-image" onerror="this.src='images/placeholder.png'">
        <div class="product-title">${ad.title}</div>
        <div class="product-price">${ad.price} ريال</div>
        <div class="product-location">📍 ${ad.location}</div>
        <div class="product-date">${formattedDate}</div>
    `;
    
    return adDiv;
}

// عرض تفاصيل الإعلان
function viewAdDetails(adId) {
    window.location.href = `ad-details.html?id=${adId}`;
}

// عرض ملف المستخدم
function showUserProfile() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>معلومات الحساب</h3>
            <p><strong>البريد الإلكتروني:</strong> ${currentUser.email}</p>
            <p><strong>تاريخ الإنشاء:</strong> ${new Date(currentUser.metadata.creationTime).toLocaleDateString('ar-SA')}</p>
            <button onclick="signOut()" class="btn-primary">تسجيل الخروج</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق النافذة المنبثقة
    modal.querySelector('.close').onclick = function() {
        document.body.removeChild(modal);
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// تسجيل الخروج
function signOut() {
    auth.signOut().then(() => {
        alert('تم تسجيل الخروج بنجاح');
        location.reload();
    }).catch((error) => {
        console.error('خطأ في تسجيل الخروج:', error);
        alert('حدث خطأ في تسجيل الخروج');
    });
}

// عرض الإشعارات
function showNotifications() {
    alert('ميزة الإشعارات قيد التطوير');
}

// عرض فريق الدعم
function showSupport() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>فريق الدعم</h3>
            <p>للتواصل مع فريق الدعم:</p>
            <p><strong>البريد الإلكتروني:</strong> support@example.com</p>
            <p><strong>الهاتف:</strong> +966 50 123 4567</p>
            <p><strong>ساعات العمل:</strong> من 9 صباحاً إلى 6 مساءً</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق النافذة المنبثقة
    modal.querySelector('.close').onclick = function() {
        document.body.removeChild(modal);
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// عرض المزيد
function showMore() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>المزيد</h3>
            <ul>
                <li><a href="#" onclick="showAbout()">حول الموقع</a></li>
                <li><a href="#" onclick="showTerms()">الشروط والأحكام</a></li>
                <li><a href="#" onclick="showPrivacy()">سياسة الخصوصية</a></li>
                <li><a href="#" onclick="showContact()">اتصل بنا</a></li>
            </ul>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق النافذة المنبثقة
    modal.querySelector('.close').onclick = function() {
        document.body.removeChild(modal);
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// وظائف إضافية للمزيد
function showAbout() {
    alert('موقع الإعلانات المبوبة - منصة لبيع وشراء المنتجات المختلفة');
}

function showTerms() {
    alert('الشروط والأحكام قيد التطوير');
}

function showPrivacy() {
    alert('سياسة الخصوصية قيد التطوير');
}

function showContact() {
    alert('للتواصل: info@example.com');
}

