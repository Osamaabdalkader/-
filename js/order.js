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
const database = firebase.database();

// متغيرات
let orderAd = null;

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
    setupEventListeners();
});

// تحميل بيانات الطلب
function loadOrderData() {
    const orderData = localStorage.getItem('orderAd');
    
    if (!orderData) {
        showError('لا توجد بيانات للطلب');
        return;
    }
    
    try {
        orderAd = JSON.parse(orderData);
        displayProductSummary();
    } catch (error) {
        console.error('خطأ في تحليل بيانات الطلب:', error);
        showError('خطأ في بيانات الطلب');
    }
}

// عرض ملخص المنتج
function displayProductSummary() {
    const productSummary = document.getElementById('product-summary');
    
    productSummary.innerHTML = `
        <h3>ملخص الطلب</h3>
        <div class="order-item">
            <img src="${orderAd.imageUrl}" alt="${orderAd.title}" class="order-image" onerror="this.src='images/placeholder.png'">
            <div class="order-details">
                <div class="order-title">${orderAd.title}</div>
                <div class="order-price">${orderAd.price} ريال</div>
                <div class="order-location">📍 ${orderAd.location}</div>
                <div class="order-seller">المعلن: ${orderAd.userEmail}</div>
            </div>
        </div>
        
        <div class="order-total">
            <div class="total-row">
                <span>سعر المنتج:</span>
                <span>${orderAd.price} ريال</span>
            </div>
            <div class="total-row final-total">
                <span><strong>المجموع الكلي:</strong></span>
                <span><strong>${orderAd.price} ريال</strong></span>
            </div>
        </div>
    `;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // لا توجد أحداث خاصة في هذه الصفحة حالياً
}

// نسخ رقم الحساب
function copyAccountNumber() {
    const accountNumber = '39532797587';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountNumber)
            .then(() => {
                showSuccessMessage('تم نسخ رقم الحساب بنجاح');
            })
            .catch(() => {
                fallbackCopyTextToClipboard(accountNumber);
            });
    } else {
        fallbackCopyTextToClipboard(accountNumber);
    }
}

// نسخ النص كبديل
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // تجنب التمرير إلى الأسفل
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showSuccessMessage('تم نسخ رقم الحساب بنجاح');
        } else {
            showErrorMessage('فشل في نسخ رقم الحساب');
        }
    } catch (err) {
        console.error('خطأ في النسخ:', err);
        showErrorMessage('فشل في نسخ رقم الحساب');
    }
    
    document.body.removeChild(textArea);
}

// عرض رسالة نجاح
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// عرض رسالة خطأ
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// عرض رسالة خطأ في المحتوى
function showError(message) {
    const productSummary = document.getElementById('product-summary');
    productSummary.innerHTML = `
        <div class="error-message">
            <h3>خطأ</h3>
            <p>${message}</p>
            <button onclick="window.history.back()" class="btn-primary">العودة</button>
        </div>
    `;
}

// حفظ معلومات الطلب (للمتابعة المستقبلية)
function saveOrderInfo() {
    if (!orderAd) return;
    
    const orderInfo = {
        adId: orderAd.id,
        adTitle: orderAd.title,
        adPrice: orderAd.price,
        sellerEmail: orderAd.userEmail,
        orderDate: firebase.database.ServerValue.TIMESTAMP,
        status: 'pending_payment'
    };
    
    // يمكن حفظ معلومات الطلب في قاعدة البيانات للمتابعة
    database.ref('orders').push(orderInfo)
        .then(() => {
            console.log('تم حفظ معلومات الطلب');
        })
        .catch((error) => {
            console.error('خطأ في حفظ معلومات الطلب:', error);
        });
}

// تأكيد الطلب
function confirmOrder() {
    if (!orderAd) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>تأكيد الطلب</h3>
            <p>هل أنت متأكد من رغبتك في طلب هذا المنتج؟</p>
            <div class="modal-actions">
                <button onclick="processOrder()" class="btn-primary">تأكيد الطلب</button>
                <button onclick="document.body.removeChild(this.closest('.modal'))" class="btn-secondary">إلغاء</button>
            </div>
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

// معالجة الطلب
function processOrder() {
    saveOrderInfo();
    showSuccessMessage('تم تأكيد طلبك. يرجى تحويل المبلغ وانتظار التأكيد.');
    
    // إغلاق النافذة المنبثقة
    const modal = document.querySelector('.modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

