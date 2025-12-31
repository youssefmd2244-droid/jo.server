// بيانات Firebase الخاصة بك (يجب وضع بياناتك هنا)
const firebaseConfig = { apiKey: "YOUR_API_KEY", storageBucket: "YOUR_BUCKET.appspot.com" };
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const video = document.getElementById('videoPlayer');
const status = document.getElementById('status');
const checkGenerate = document.getElementById('enableGenerate');
const resultArea = document.getElementById('resultArea');
const generatedLink = document.getElementById('generatedLink');

// 1. التشغيل من رابط
function playFromUrl() {
    const url = document.getElementById('inputUrl').value;
    if (!url) return;
    
    video.src = url;
    video.play();
    status.innerText = "يتم التشغيل الآن...";
    
    // إذا كان خيار التوليد مفعلاً، ابدأ فوراً
    if (checkGenerate.checked) {
        startFastGeneration(url);
    }
}

// 2. التشغيل من ملف الهاتف والرفع التلقائي
document.getElementById('fileUpload').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // تشغيل الفيديو فوراً بدون انتظار الرفع لضمان السرعة
    const localUrl = URL.createObjectURL(file);
    video.src = localUrl;
    video.play();
    status.innerText = "بدء المشاهدة... جاري فحص خيارات التصدير";

    // إذا كان خيار التوليد مفعلاً، ابدأ الرفع فوراً في الخلفية
    if (checkGenerate.checked) {
        uploadAndGenerate(file);
    }
};

// وظيفة التوليد السريع (للروابط)
function startFastGeneration(url) {
    resultArea.style.display = "block";
    generatedLink.innerText = "جاري التوليد...";
    
    // عملية محاكاة سريعة لإنتاج رابط "جو" المعدل
    setTimeout(() => {
        const fastId = btoa(url).substring(0, 12);
        generatedLink.innerText = "https://jo.url/v/" + fastId;
        status.innerText = "تم توليد الرابط أثناء المشاهدة ✅";
    }, 1000);
}

// وظيفة الرفع والتشغيل (للملفات)
function uploadAndGenerate(file) {
    resultArea.style.display = "block";
    generatedLink.innerText = "جاري الرفع والتصدير...";
    
    const ref = storage.ref('movies/' + Date.now() + "_" + file.name);
    ref.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
            generatedLink.innerText = "https://jo.url/cloud/" + btoa(url).substring(0, 12);
            status.innerText = "اكتمل الرفع والتصدير بنجاح ✅";
        });
    });
}

// تكبير الشاشة الإجباري
function requestFullScreen() {
    const container = document.getElementById('videoContainer');
    if (container.requestFullscreen) container.requestFullscreen();
    else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
    else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
}

function copyLink() {
    navigator.clipboard.writeText(generatedLink.innerText);
    alert("تم النسخ!");
}
