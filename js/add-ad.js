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

// متغيرات
let currentUser = null;
let selectedImage = null;

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    setupEventListeners();
});

// فحص حالة المصادقة
function checkAuthState() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
        } else {
            // المستخدم غير مسجل الدخول، إعادة توجيه لصفحة تسجيل الدخول
            alert('يجب تسجيل الدخول أولاً');
            window.location.href = 'login.html';
        }
    });
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // نموذج إضافة الإعلان
    document.getElementById('add-ad-form').addEventListener('submit', handleAddAd);
    
    // رفع الصورة
    document.getElementById('ad-image').addEventListener('change', handleImageSelect);
}

// التعامل مع اختيار الصورة
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
    }
    
    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
    }
    
    selectedImage = file;
    
    // عرض معاينة الصورة
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `
            <img src="${e.target.result}" alt="معاينة الصورة">
            <button type="button" class="remove-image" onclick="removeImage()">×</button>
        `;
    };
    reader.readAsDataURL(file);
}

// إزالة الصورة
function removeImage() {
    selectedImage = null;
    document.getElementById('ad-image').value = '';
    document.getElementById('image-preview').innerHTML = '';
}

// التعامل مع إضافة الإعلان
function handleAddAd(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('يجب تسجيل الدخول أولاً');
        return;
    }
    
    // جمع البيانات
    const title = document.getElementById('ad-title').value.trim();
    const description = document.getElementById('ad-description').value.trim();
    const price = document.getElementById('ad-price').value;
    const location = document.getElementById('ad-location').value.trim();
    const category = document.getElementById('ad-category').value;
    
    // التحقق من صحة البيانات
    if (!title || !description || !price || !location || !category) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!selectedImage) {
        alert('يرجى اختيار صورة للإعلان');
        return;
    }
    
    if (parseFloat(price) <= 0) {
        alert('يرجى إدخال سعر صالح');
        return;
    }
    
    // تعطيل النموذج أثناء الرفع
    const submitBtn = document.getElementById('publish-btn');
    const btnText = document.getElementById('btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    
    // رفع الصورة أولاً
    uploadImageAndCreateAd({
        title,
        description,
        price: parseFloat(price),
        location,
        category
    });
}

// رفع الصورة وإنشاء الإعلان
function uploadImageAndCreateAd(adData) {
    const imageRef = storage.ref('ads/' + Date.now() + '_' + selectedImage.name);
    const uploadTask = imageRef.put(selectedImage);
    
    uploadTask.on('state_changed',
        function(snapshot) {
            // تتبع تقدم الرفع
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('تقدم الرفع: ' + progress + '%');
        },
        function(error) {
            console.error('خطأ في رفع الصورة:', error);
            alert('حدث خطأ في رفع الصورة');
            resetForm();
        },
        function() {
            // الرفع مكتمل، الحصول على رابط الصورة
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                // إنشاء الإعلان مع رابط الصورة
                createAd({
                    ...adData,
                    imageUrl: downloadURL
                });
            });
        }
    );
}

// إنشاء الإعلان في قاعدة البيانات
function createAd(adData) {
    const adRef = database.ref('ads').push();
    
    const adWithMetadata = {
        ...adData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        status: 'active'
    };
    
    adRef.set(adWithMetadata)
        .then(() => {
            alert('تم نشر الإعلان بنجاح!');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('خطأ في إنشاء الإعلان:', error);
            alert('حدث خطأ في نشر الإعلان');
            resetForm();
        });
}

// إعادة تعيين النموذج
function resetForm() {
    const submitBtn = document.getElementById('publish-btn');
    const btnText = document.getElementById('btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
}

// معاينة الإعلان قبل النشر
function previewAd() {
    const title = document.getElementById('ad-title').value.trim();
    const description = document.getElementById('ad-description').value.trim();
    const price = document.getElementById('ad-price').value;
    const location = document.getElementById('ad-location').value.trim();
    const category = document.getElementById('ad-category').value;
    
    if (!title || !description || !price || !location || !category || !selectedImage) {
        alert('يرجى ملء جميع الحقول أولاً');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content preview-modal">
                <span class="close">&times;</span>
                <h3>معاينة الإعلان</h3>
                <div class="preview-ad">
                    <img src="${e.target.result}" alt="${title}" class="preview-image">
                    <div class="preview-title">${title}</div>
                    <div class="preview-price">${price} ريال</div>
                    <div class="preview-location">📍 ${location}</div>
                    <div class="preview-category">الفئة: ${getCategoryName(category)}</div>
                    <div class="preview-description">${description}</div>
                </div>
                <div class="preview-actions">
                    <button onclick="document.body.removeChild(this.closest('.modal'))" class="btn-secondary">إغلاق</button>
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
    };
    reader.readAsDataURL(selectedImage);
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

