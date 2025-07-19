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
let isLoginMode = true;

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthState();
});

// فحص حالة المصادقة
function checkAuthState() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // المستخدم مسجل الدخول، الانتقال للصفحة الرئيسية
            window.location.href = 'index.html';
        }
    });
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // نموذج تسجيل الدخول
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // نموذج إنشاء حساب
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // رابط التبديل بين النماذج
    document.getElementById('switch-link').addEventListener('click', toggleForms);
}

// التعامل مع تسجيل الدخول
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    // تعطيل الزر أثناء المعالجة
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري تسجيل الدخول...';
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('تم تسجيل الدخول بنجاح');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('خطأ في تسجيل الدخول:', error);
            let errorMessage = 'حدث خطأ في تسجيل الدخول';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'البريد الإلكتروني غير مسجل';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'كلمة المرور غير صحيحة';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صالح';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'تم تجاوز عدد المحاولات المسموح، حاول لاحقاً';
                    break;
            }
            
            alert(errorMessage);
            
            // إعادة تفعيل الزر
            submitBtn.disabled = false;
            submitBtn.textContent = 'تسجيل الدخول';
        });
}

// التعامل مع إنشاء حساب
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // التحقق من صحة البيانات
    if (!name || !phone || !email || !password || !confirmPassword) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('كلمة المرور وتأكيدها غير متطابقتين');
        return;
    }
    
    if (password.length < 6) {
        alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('البريد الإلكتروني غير صالح');
        return;
    }
    
    if (!isValidPhone(phone)) {
        alert('رقم الهاتف غير صالح');
        return;
    }
    
    // تعطيل الزر أثناء المعالجة
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري إنشاء الحساب...';
    
    // إنشاء الحساب
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // حفظ معلومات المستخدم الإضافية
            return database.ref('users/' + user.uid).set({
                name: name,
                phone: phone,
                email: email,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
        })
        .then(() => {
            alert('تم إنشاء الحساب بنجاح');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('خطأ في إنشاء الحساب:', error);
            let errorMessage = 'حدث خطأ في إنشاء الحساب';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صالح';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'كلمة المرور ضعيفة';
                    break;
            }
            
            alert(errorMessage);
            
            // إعادة تفعيل الزر
            submitBtn.disabled = false;
            submitBtn.textContent = 'إنشاء حساب';
        });
}

// التبديل بين نماذج تسجيل الدخول وإنشاء الحساب
function toggleForms(e) {
    e.preventDefault();
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formTitle = document.getElementById('form-title');
    const switchText = document.getElementById('switch-text');
    const switchLink = document.getElementById('switch-link');
    
    if (isLoginMode) {
        // التبديل إلى نموذج إنشاء حساب
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = 'إنشاء حساب جديد';
        switchText.innerHTML = 'لديك حساب بالفعل؟ <a href="#" id="switch-link">تسجيل الدخول</a>';
        isLoginMode = false;
    } else {
        // التبديل إلى نموذج تسجيل الدخول
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        formTitle.textContent = 'تسجيل الدخول';
        switchText.innerHTML = 'ليس لديك حساب؟ <a href="#" id="switch-link">إنشاء حساب جديد</a>';
        isLoginMode = true;
    }
    
    // إعادة ربط مستمع الحدث للرابط الجديد
    document.getElementById('switch-link').addEventListener('click', toggleForms);
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// التحقق من صحة رقم الهاتف
function isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
}

