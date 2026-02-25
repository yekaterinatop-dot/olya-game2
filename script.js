const dialogues = {
    1: "Оля... Но для некоторых я просто нелюдимая девочка.",
    2: "Она защищает то, что внутри... То, что нельзя показывать.",
    3: "Они есть, но иногда кажется, что их нет рядом.",
    4: "Всё остальное ты узнаешь на премьере спектакля «Девочка с головой волка»"
};

let currentTypingTimeout;
let clickCount = 0; 
let seenQuestions = new Set();
const music = document.getElementById('bg-music');

// --- ГЛОБАЛЬНЫЙ ЗАПУСК МУЗЫКИ ---
function forceStartMusic() {
    if (music && music.paused) {
        music.play().then(() => {
            music.volume = 0.4;
            document.removeEventListener('click', forceStartMusic);
            document.removeEventListener('touchstart', forceStartMusic);
        }).catch(e => console.log("Ждем касания..."));
    }
}
document.addEventListener('click', forceStartMusic);
document.addEventListener('touchstart', forceStartMusic);

// --- ПЕЧАТЬ ТЕКСТА ---
function typeWriter(text, elementId, speed = 40) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = ""; 
    let i = 0;
    clearTimeout(currentTypingTimeout);
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            currentTypingTimeout = setTimeout(type, speed);
        }
    }
    type();
}

// Эффект вспышки
function triggerFlash() {
    const flash = document.getElementById('flash-overlay');
    if (flash) {
        flash.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
        setTimeout(() => { flash.style.backgroundColor = "transparent"; }, 300);
    }
}

// Главная функция выбора ответа
window.showDialogue = function(id) {
    const charImg = document.getElementById('olya-sprite');
    const promoBtn = document.getElementById('secret-promo-btn');

    typeWriter(dialogues[id], 'dialogue-text', 40);
    hideQuestions();

    if (id >= 1 && id <= 3) seenQuestions.add(id);
    if (seenQuestions.size === 3 && promoBtn) promoBtn.style.display = "block";

     // --- НОВОЕ: Показываем ссылку, если это финал ---
    if (id == 4) {
        const siteLink = document.getElementById('site-link');
        if (siteLink) {
            siteLink.classList.add('show');
        }
    }

     // 4. --- ЛОГИКА СМЕНЫ СПРАЙТОВ НА ВОПРОСЫ ---
    if (!charImg) return;

    if (id == 1) {
        // Вопрос про имя
        charImg.src = "olya_thinking.png"; 
        setTimeout(() => { charImg.src = "character.png"; }, 4000);

    } else if (id == 2) {
        // Вопрос про голову волка
        charImg.src = "olya_serious.png";
        setTimeout(() => { charImg.src = "character.png"; }, 4000);

    } else if (id == 3) {
        // Вопрос про родителей (грустный)
        charImg.src = "olya_sad.png";
        setTimeout(() => { charImg.src = "character.png"; }, 4000);

    } else if (id == 4) {
        // Финальный вопрос о спектакле
        charImg.src = "olya_story.png";
        setTimeout(() => { charImg.src = "character.png"; }, 4000);
        // Показываем ссылку на сайт
        if (siteLink) siteLink.classList.add('show');
    }
};

function showQuestions() {
    const questionsContainer = document.querySelector('.choice-buttons');
    if (questionsContainer) {
        questionsContainer.style.display = 'flex';
        typeWriter("Выбери вопрос для Оли:", 'dialogue-text', 30);
    }
}

function hideQuestions() {
    const questionsContainer = document.querySelector('.choice-buttons');
    if (questionsContainer) questionsContainer.style.display = 'none';
}

// Реакция Оли на нажатие
function makeOlyaReact() {
    const charImg = document.getElementById('olya-sprite');
    if (!charImg) return;
    clickCount++; 

    if (clickCount === 3) {
        charImg.src = "olya_defend.png"; 
        triggerFlash();
        typeWriter("Не надо...", 'dialogue-text', 60);
        charImg.style.transition = "transform 0.2s ease-out";
        charImg.style.transform = "translateY(-5px) scale(0.95)";
        setTimeout(() => {
            charImg.src = "character.png";
            charImg.style.transform = "translateY(0) scale(1)";
            clickCount = 0;
        }, 2000); 
    } else {
        charImg.src = "olya_surprised.png";
        charImg.style.transition = "transform 0.1s ease-out";
        charImg.style.transform = "translateY(-30px) scale(1.05)";
        setTimeout(() => {
            charImg.src = "character.png";
            charImg.style.transform = "translateY(0) scale(1)";
        }, 300);
    }
}

// --- СТАРТ ПРИ ЗАГРУЗКЕ ---
window.addEventListener('DOMContentLoaded', () => {
    typeWriter("Оля внимательно на тебя смотрит. Нажми на стрелочку, чтобы начать разговор.", 'dialogue-text', 40);

    document.getElementById('next-button').addEventListener('click', () => {
        document.querySelector('.choice-buttons').style.display = 'flex';
        typeWriter("Выбери вопрос для Оли:", 'dialogue-text', 30);
    });

    document.getElementById('olya-sprite').addEventListener('click', makeOlyaReact);

    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            music.muted = !music.muted;
            muteBtn.innerText = music.muted ? "🔇" : "🔊";
        });
    }
});