// ============================================
// JAVASCRIPT LATIHAN MENULIS TEGAK BERSAMBUNG 
// ============================================

// --- 1. Konfigurasi Awal ---
const canvas = document.getElementById('tracingCanvas');
const ctx = canvas.getContext('2d');

const currentLessonTitle = document.getElementById('current-letter'); 
const guideContainer = document.getElementById('guide-container');

const resetBtn = document.getElementById('reset-btn');
const finishBtn = document.getElementById('finish-btn');
const prevBtn = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn'); 

// --- Konfigurasi Garis (Berdasarkan CSS: 90px pola, 20px padding) ---
const linePatternHeight = 90; 
const topPadding = 20; 

// Daftar Kalimat BARU (Mengganti 'alphabet')
const lessons = [
    { name: "Kalimat 1: Aku", guide: "Aku sayang ibu" },
    { name: "Kalimat 2: Bunga", guide: "Bunga itu indah" },
    { name: "Kalimat 3: Bola Saya", guide: "Ini bola saya" },
    { name: "Kalimat 4: Ibu Masak", guide: "Ibu masak nasi" },
    { name: "Kalimat 5: Kami Pergi", guide: "Kami pergi ke sekolah" },
    { name: "Kalimat 6: Ayah Bekerja", guide: "Ayah bekerja di kantor" },
    // Tambahkan kalimat lain sesuai kebutuhan
];
let currentLessonIndex = 0; 

// Variabel menggambar
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// --- 2. Fungsi Utama ---

/**
 * Membuat elemen <span> panduan dengan mengulang seluruh kalimat per baris.
 * @param {string} guideTextContent - Kalimat panduan (misalnya "Ajar anak membaca").
 */
function populateGuideLines(guideTextContent) {
    
    // --- PENGATURAN TEKS REPETISI HORIZONTAL ---
    // 1. Tentukan SPASI PEMISAH antar pengulangan kalimat (4 spasi standar)
    const separator = '    '; 
    let repeatedContent = guideTextContent + separator; 
    
    // 2. Menetapkan jumlah pengulangan (Misal 3 kali per baris)
    const REPETITION_COUNT = 1; 
    let fullLineText = repeatedContent.repeat(REPETITION_COUNT); 
    
    // Hapus konten kontainer lama
    guideContainer.innerHTML = ''; 
    
    // --- PENGATURAN POSISI VERTIKAL (Hanya Baris Pertama) ---
    // Logika baris di bawah ini HANYA UNTUK MENGHITUNG TINGGI EFEKTIF
    const wrapperHeight = canvas.parentNode.offsetHeight;
    const effectiveHeight = wrapperHeight - (2 * topPadding); 
    const numLines = Math.floor(effectiveHeight / linePatternHeight); // Menghitung total baris yang muat

    // Kita HANYA AKAN membuat panduan di baris pertama (i=0)
    // Dan baris berikutnya akan dibiarkan kosong
    for (let i = 0; i < numLines; i++) {
        // Cek: Apakah ini baris pertama (i=0)?
        if (i === 0) { 
            const lineGuide = document.createElement('span');
            
            lineGuide.textContent = fullLineText; 
            lineGuide.classList.add('tracing-guide');
            
            // Offset
            // NOTE: Kami tetap menggunakan pola baris 90px, tetapi hanya memuat di i=0
            const topPosition = topPadding + (i * linePatternHeight) + 25; 
            
            lineGuide.style.top = `${topPosition}px`;
            
            guideContainer.appendChild(lineGuide);
        } else {
            // Baris kedua, ketiga, dst, dibiarkan kosong, jadi tidak ada yang perlu ditambahkan.
            // Anda bisa menambahkan placeholder jika diperlukan, tetapi untuk kasus ini, 
            // membiarkannya kosong sudah cukup.
        }
    }
}


// Fungsi untuk mengatur ulang ukuran canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Panggil drawCurrentLesson untuk memastikan panduan dimuat ulang saat resize
    drawCurrentLesson(); 
}

// Fungsi untuk menampilkan pelajaran panduan
function drawCurrentLesson() {
    // GANTI 'alphabet' menjadi 'lessons'
    const lesson = lessons[currentLessonIndex];
    
    // HAPUS PANDUAN LAMA
    guideContainer.innerHTML = ''; 
    
    // Clear canvas (Hapus goresan pengguna)
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    // Panggil fungsi populateGuideLines yang baru
    populateGuideLines(lesson.guide); 
    
    // Tampilkan di Judul Navbar
    currentLessonTitle.textContent = lesson.name;
    
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
    // GANTI 'alphabet' menjadi 'lessons'
    const currentGuide = lessons[currentLessonIndex].guide;
    alert(`Latihan untuk kalimat "${currentGuide}" selesai!`);
    
    // SIMULASI NILAI DAN KOMENTAR GURU
    document.getElementById('score').textContent = Math.floor(Math.random() * 50) + 50; 
    document.getElementById('comment').textContent = 'Hurufmu rapi.';
}

// Fungsi Pindah Pelajaran
function changeLesson(offset) {
    currentLessonIndex += offset;
    
    // GANTI 'alphabet' menjadi 'lessons'
    const maxIndex = lessons.length - 1;

    // Batasi indeks agar tidak keluar dari array
    if (currentLessonIndex < 0) {
        currentLessonIndex = 0;
        // UBAH ALERT
        alert("Ini adalah kalimat pertama.");
    } else if (currentLessonIndex > maxIndex) { 
        currentLessonIndex = maxIndex;
        // UBAH ALERT
        alert("Selamat! Semua kalimat telah diselesaikan.");
    }
    
    // Panggil fungsi pemuatan baru
    drawCurrentLesson();
}

// --- 3. Event Listeners (Penghubung Interaksi) ---

// Resize (PENTING)
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
nextButton.addEventListener('click', () => changeLesson(1));