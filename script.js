// --- БАЗА ДАННЫХ ДИАЛОГОВ ---
const dialogues = {
    1: "Оля... Но для некоторых я просто нелюдимая девочка.",
    2: "Она защищает то, что внутри... То, что нельзя показывать.",
    3: "Они есть, но иногда кажется, что их нет рядом.",
    4: "Всё остальное ты узнаешь на премьере спектакля «Девочка с головой волка»"
};

let currentTypingTimeout;
let clickCount = 0; 
let seenQuestions = new Set(); // Это наш список памяти

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

function triggerFlash() {
    const flash = document.getElementById('flash-overlay');
    if (flash) {
        flash.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
        setTimeout(() => {
            flash.style.backgroundColor = "rgba(255, 0, 0, 0)";
        }, 300);
    }
}

// ГЛАВНАЯ ФУНКЦИЯ
window.showDialogue = function(id) {
    const charImg = document.getElementById('olya-sprite');
    const promoBtn = document.getElementById('secret-promo-btn');

    // 1. Печатаем ответ
    typeWriter(dialogues[id], 'dialogue-text', 40);
    
    // 2. Скрываем кнопки
    hideQuestions();

    // 3. Логика секретной кнопки
    if (id >= 1 && id <= 3) {
        seenQuestions.add(id);
    }
    if (seenQuestions.size === 3 && promoBtn) {
        promoBtn.style.display = "block";
    }

    // --- ЛОГИКА СПРАЙТА (Исправленная проверка) ---
    if (id === 3 || id === "3") {
        if (charImg) {
            charImg.src = "olya_sad.png"; 
            
            setTimeout(() => {
                // Возвращаем обычную, если до сих пор висит грустная
                if (charImg.src.includes("olya_sad.png")) {
                    charImg.src = "character.png";
                }
            }, 4000);
        }
    } else {
        if (charImg) charImg.src = "character.png";
    }
};

// ТУТ Я УБРАЛА ТОТ ЛИШНИЙ КУСОК, КОТОРЫЙ ЛОМАЛ КОД

function showQuestions() {
    const questionsContainer = document.querySelector('.choice-buttons');
    if (questionsContainer) {
        questionsContainer.style.display = 'flex';
        typeWriter("Выбери вопрос для Оли:", 'dialogue-text', 30);
    }
}

function hideQuestions() {
    const questionsContainer = document.querySelector('.choice-buttons');
    if (questionsContainer) {
        questionsContainer.style.display = 'none';
    }
}

function makeOlyaReact() {
    const charImg = document.getElementById('olya-sprite'); // Используем ID для надежности
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
            const textElement = document.getElementById('dialogue-text');
            if (textElement) textElement.textContent = "..."; 
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

// --- ИНИЦИАЛИЗАЦИЯ ---
window.addEventListener('DOMContentLoaded', () => {
    typeWriter("Оля внимательно на тебя смотрит. Нажми на стрелочку, чтобы начать разговор.", 'dialogue-text', 40);
    
    const olyaClickable = document.getElementById('olya-sprite');
    if (olyaClickable) {
        olyaClickable.style.cursor = "pointer";
        olyaClickable.addEventListener('click', makeOlyaReact);
    }

    const nextBtn = document.getElementById('next-button');
    if (nextBtn) {
        nextBtn.addEventListener('click', showQuestions);
    }
});