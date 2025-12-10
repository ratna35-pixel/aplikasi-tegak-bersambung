// --- 1. Konfigurasi Awal ---
const canvas = document.getElementById('tracingCanvas');
const ctx = canvas.getContext('2d');
// guideText (yang menyebabkan error) telah dihapus
const currentLessonTitle = document.getElementById('current-letter'); 

const resetBtn = document.getElementById('reset-btn');
const finishBtn = document.getElementById('finish-btn');
const prevBtn = document.getElementById('prev-btn');
// PERBAIKAN: Menggunakan ID yang benar ('next-btn')
const nextButton = document.getElementById('next-btn'); 

// VARIABEL BARU: Wadah panduan baris (Sesuai dengan <div id="guide-container">)
const guideContainer = document.getElementById('guide-container');

// --- Konfigurasi Garis (Berdasarkan CSS: 90px pola, 20px padding) ---
const linePatternHeight = 90; 
const topPadding = 20; 

// Daftar Abjad (A kapital diikuti a kecil, B kapital diikuti b kecil)
const alphabet = [
    { name: "Huruf A a", guide: "A a" },
    { name: "Huruf B b", guide: "B b" },
    { name: "Huruf C c", guide: "C c" },
    { name: "Huruf D d", guide: "D d" },
    { name: "Huruf E e", guide: "E e" },
    { name: "Huruf F f", guide: "F f" },
    { name: "Huruf G g", guide: "G g" },
    { name: "Huruf H h", guide: "H h" },
    { name: "Huruf I i", guide: "I i" },
    { name: "Huruf J j", guide: "J j" },
    { name: "Huruf K k", guide: "K k" },
    { name: "Huruf L l", guide: "L l" },
    { name: "Huruf M m", guide: "M m" },
    { name: "Huruf N n", guide: "N n" },
    { name: "Huruf O o", guide: "O o" },
    { name: "Huruf P p", guide: "P p" },
    { name: "Huruf Q q", guide: "Q q" },
    { name: "Huruf R r", guide: "R r" },
    { name: "Huruf S s", guide: "S s" },
    { name: "Huruf T t", "guide": "T t" },
    { name: "Huruf U u", guide: "U u" },
    { name: "Huruf V v", guide: "V v" },
    { name: "Huruf W w", guide: "W w" },
    { name: "Huruf X x", guide: "X x" },
    { name: "Huruf Y y", guide: "Y y" },
    { name: "Huruf Z z", guide: "Z z" },
];
let currentLessonIndex = 0; 

// Variabel menggambar
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// --- 2. Fungsi Utama ---

function populateGuideLines(guideTextContent) {
    guideContainer.innerHTML = '';
    
    const wrapperHeight = canvas.parentNode.offsetHeight;
    const effectiveHeight = wrapperHeight - (2 * topPadding); 
    
    const numLines = Math.floor(effectiveHeight / linePatternHeight);
    
    for (let i = 0; i < numLines; i++) {
        const lineGuide = document.createElement('span');
        lineGuide.textContent = guideTextContent;
        lineGuide.classList.add('tracing-guide');
        
        // Offset +25 agar huruf tidak terpotong di baris paling atas
        const topPosition = topPadding + (i * linePatternHeight) + 25; 
        
        lineGuide.style.top = `${topPosition}px`;
        
        guideContainer.appendChild(lineGuide);
    }
}


// Fungsi untuk mengatur ulang ukuran canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawCurrentLesson(); 
}

// Fungsi untuk menampilkan pelajaran panduan (SUDAH DIPERBAIKI)
function drawCurrentLesson() {
    const lesson = alphabet[currentLessonIndex];
    
    // Panggil fungsi populateGuideLines yang baru
    populateGuideLines(lesson.guide); 
    
    // Tampilkan di Judul Navbar
    currentLessonTitle.textContent = lesson.name;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    // Reset Nilai dan Komentar
    document.getElementById('score').textContent = '--';
    document.getElementById('comment').textContent = 'Belum Diperiksa.';
}

// Fungsi untuk memulai menggambar
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCursorPosition(e);
}

// Fungsi saat menggambar
function draw(e) {
    if (!isDrawing) return;
    e.preventDefault(); 
    
    const [x, y] = getCursorPosition(e);

    // Konfigurasi garis goresan anak
    ctx.strokeStyle = '#9370db'; // Tinta Ungu
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5; // Ketebalan goresan
    
    // Gambar garis
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Update posisi
    [lastX, lastY] = [x, y];
}

// Fungsi untuk mendapatkan posisi kursor (mendukung Mouse dan Touch)
function getCursorPosition(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return [
            e.touches[0].clientX - rect.left,
            e.touches[0].clientY - rect.top
        ];
    } else {
        return [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }
}

// Fungsi Hapus
function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Fungsi Selesai (Simulasi)
function finishDrawing() {
    const currentGuide = alphabet[currentLessonIndex].guide;
    alert(`Latihan untuk huruf "${currentGuide}" selesai!`);
    
    // SIMULASI NILAI DAN KOMENTAR GURU
    document.getElementById('score').textContent = Math.floor(Math.random() * 50) + 50; 
    document.getElementById('comment').textContent = 'Hurufmu rapi.';
}

// Fungsi Pindah Pelajaran
function changeLesson(offset) {
    currentLessonIndex += offset;
    
    // Batasi indeks agar tidak keluar dari array
    if (currentLessonIndex < 0) {
        currentLessonIndex = 0;
        alert("Ini adalah huruf pertama (A a).");
    } else if (currentLessonIndex >= alphabet.length) { 
        currentLessonIndex = alphabet.length - 1;
        alert("Selamat! Semua huruf telah diselesaikan.");
    }
    
    drawCurrentLesson();
}

// --- 3. Event Listeners (Penghubung Interaksi) ---

// Resize (PENTING: Memanggil resizeCanvas yang di dalamnya ada drawCurrentLesson/populateGuideLines)
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas); 

// Menggambar (Mouse Events)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// Menggambar (Touch Events untuk HP/Tablet)
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', () => isDrawing = false);

// Tombol Kontrol
resetBtn.addEventListener('click', resetCanvas);
finishBtn.addEventListener('click', finishDrawing);
prevBtn.addEventListener('click', () => changeLesson(-1));
// PERBAIKAN: Menggunakan variabel yang benar (nextButton)
nextButton.addEventListener('click', () => changeLesson(1));