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

// متغيرات
let currentAd = null;
let adId = null;

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    getAdIdFromURL();
    if (adId) {
        loadAdDetails();
    } else {
        showError('معرف الإعلان غير صالح');
    }
});

// الحصول على معرف الإعلان من الرابط
function getAdIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    adId = urlParams.get('id');
}

// تحميل تفاصيل الإعلان
function loadAdDetails() {
    const adContent = document.getElementById('ad-content');
    adContent.innerHTML = '<div class="loading">جاري تحميل تفاصيل الإعلان...</div>';
    
    database.ref('ads/' + adId).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                currentAd = {
                    id: adId,
                    ...snapshot.val()
                };
                displayAdDetails();
            } else {
                showError('الإعلان غير موجود');
            }
        })
        .catch((error) => {
            console.error('خطأ في تحميل الإعلان:', error);
            showError('حدث خطأ في تحميل الإعلان');
        });
}

// عرض تفاصيل الإعلان
function displayAdDetails() {
    const adContent = document.getElementById('ad-content');
    const date = new Date(currentAd.timestamp);
    const formattedDate = date.toLocaleDateString('ar-SA');
    const formattedTime = date.toLocaleTimeString('ar-SA');
    
    adContent.innerHTML = `
        <div class="ad-details">
            <img src="${currentAd.imageUrl}" alt="${currentAd.title}" class="ad-image" onerror="this.src='images/placeholder.png'">
            
            <h1 class="ad-title">${currentAd.title}</h1>
            
            <div class="ad-price">${currentAd.price} ريال</div>
            
            <div class="ad-info">
                <div class="info-item">
                    <div class="info-label">الموقع</div>
                    <div class="info-value">📍 ${currentAd.location}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">الفئة</div>
                    <div class="info-value">${getCategoryName(currentAd.category)}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">تاريخ النشر</div>
                    <div class="info-value">${formattedDate} - ${formattedTime}</div>
                </div>
                
                <div class="info-item">
                    <div class="info-label">المعلن</div>
                    <div class="info-value">${currentAd.userEmail}</div>
                </div>
            </div>
            
            <div class="ad-description">
                <h3>وصف الإعلان</h3>
                <p>${currentAd.description}</p>
            </div>
            
            <button onclick="orderProduct()" class="order-btn">طلب الآن</button>
            
            <div class="ad-actions">
                <button onclick="shareAd()" class="btn-secondary">مشاركة الإعلان</button>
                <button onclick="reportAd()" class="btn-secondary">الإبلاغ عن الإعلان</button>
            </div>
        </div>
    `;
}

// طلب المنتج
function orderProduct() {
    if (!currentAd) return;
    
    // حفظ معلومات الإعلان في localStorage للاستخدام في صفحة الطلب
    localStorage.setItem('orderAd', JSON.stringify(currentAd));
    
    // الانتقال لصفحة الطلب
    window.location.href = 'order.html';
}

// مشاركة الإعلان
function shareAd() {
    if (!currentAd) return;
    
    const shareData = {
        title: currentAd.title,
        text: `${currentAd.title} - ${currentAd.price} ريال`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('تم مشاركة الإعلان بنجاح'))
            .catch((error) => console.log('خطأ في المشاركة:', error));
    } else {
        // نسخ الرابط للحافظة كبديل
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('تم نسخ رابط الإعلان');
            })
            .catch(() => {
                // عرض نافذة منبثقة مع الرابط
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h3>مشاركة الإعلان</h3>
                        <p>انسخ الرابط التالي لمشاركة الإعلان:</p>
                        <input type="text" value="${window.location.href}" readonly style="width: 100%; padding: 10px; margin: 10px 0;">
                        <button onclick="copyToClipboard('${window.location.href}')" class="btn-primary">نسخ الرابط</button>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                modal.querySelector('.close').onclick = function() {
                    document.body.removeChild(modal);
                };
                
                modal.onclick = function(e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                };
            });
    }
}

// نسخ النص للحافظة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('تم نسخ الرابط');
    });
}

// الإبلاغ عن الإعلان
function reportAd() {
    if (!currentAd) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>الإبلاغ عن الإعلان</h3>
            <form id="report-form">
                <div class="form-group">
                    <label>سبب الإبلاغ:</label>
                    <select id="report-reason" required>
                        <option value="">اختر السبب</option>
                        <option value="spam">إعلان مكرر أو غير مرغوب فيه</option>
                        <option value="inappropriate">محتوى غير مناسب</option>
                        <option value="fake">إعلان وهمي</option>
                        <option value="wrong-category">فئة خاطئة</option>
                        <option value="other">أخرى</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>تفاصيل إضافية (اختياري):</label>
                    <textarea id="report-details" rows="3" placeholder="أضف تفاصيل إضافية..."></textarea>
                </div>
                <button type="submit" class="btn-primary">إرسال البلاغ</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إعداد النموذج
    document.getElementById('report-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitReport();
    });
    
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

// إرسال البلاغ
function submitReport() {
    const reason = document.getElementById('report-reason').value;
    const details = document.getElementById('report-details').value;
    
    if (!reason) {
        alert('يرجى اختيار سبب الإبلاغ');
        return;
    }
    
    const reportData = {
        adId: currentAd.id,
        adTitle: currentAd.title,
        reason: reason,
        details: details,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        reporterIP: 'unknown' // يمكن إضافة معلومات إضافية هنا
    };
    
    database.ref('reports').push(reportData)
        .then(() => {
            alert('تم إرسال البلاغ بنجاح. شكراً لك على مساعدتنا في تحسين الموقع.');
            document.body.removeChild(document.querySelector('.modal'));
        })
        .catch((error) => {
            console.error('خطأ في إرسال البلاغ:', error);
            alert('حدث خطأ في إرسال البلاغ');
        });
}

// عرض رسالة خطأ
function showError(message) {
    const adContent = document.getElementById('ad-content');
    adContent.innerHTML = `
        <div class="error-message">
            <h3>خطأ</h3>
            <p>${message}</p>
            <button onclick="window.history.back()" class="btn-primary">العودة</button>
        </div>
    `;
}

// الحصول على اسم الفئة
function getCategoryName(category) {
    const categories = {
        'electronics': 'إلكترونيات',
        'cars': 'سيارات',
        'real-estate': 'عقارات',
        'furniture': 'أثاث',
        'clothing': 'ملابس',
        'other': 'أخرى'
    };
    return categories[category] || category;
}

