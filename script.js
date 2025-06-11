document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const virtualKeyboardElement = document.getElementById('virtual-keyboard');

    const customTextBtn = document.getElementById('customTextBtn');
    const customTextModal = document.getElementById('customTextModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const customTextArea = document.getElementById('customTextArea');
    const submitCustomTextBtn = document.getElementById('submitCustomTextBtn');

    const saveTextBtn = document.getElementById('saveTextBtn');
    const savedTextsContainer = document.getElementById('savedTextsContainer');
    const noSavedTextsMsg = document.getElementById('noSavedTextsMsg');
    const LOCAL_STORAGE_KEY = 'typingPracticeSavedTexts';

    // DOM Elements for Stats Display
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const kpmDisplay = document.getElementById('kpmDisplay');

    let currentIndex = 0;
    let textSpans = [];
    let currentPracticeText = "The quick brown fox jumps over the lazy dog.\nPress Enter for a new line.\nThis is a typing practice example.\nType this text accurately and quickly.\nGood luck and have fun practicing your typing skills.";

    let startTime = 0;
    let correctCharsTyped = 0;
    let totalErrors = 0;
    let timerStarted = false;

    function getVirtualKeyId(char) {
        if (char === '\n' || char === 'Enter') return 'key-enter';
        if (char === ' ') return 'key-space';
        const namedKeys = ['Backspace', 'Tab', 'Caps Lock', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft', 'AltRight', 'ControlRight'];
        if (namedKeys.includes(char)) return `key-${char.replace(/\s+/g, '')}`;
        const specialCharsMap = {'`': 'key-`','~': 'key-`','1': 'key-1','!': 'key-1','2': 'key-2','@': 'key-2','3': 'key-3','#': 'key-3','4': 'key-4','$': 'key-4','5': 'key-5','%': 'key-5','6': 'key-6','^': 'key-6','7': 'key-7','&': 'key-7','8': 'key-8','*': 'key-8','9': 'key-9','(': 'key-9','0': 'key-0',')': 'key-0','-': 'key--','_': 'key--','=': 'key-=',        '+': 'key-=','[': 'key-[','{': 'key-[',']': 'key-]','}': 'key-]','\\': 'key-\\','|': 'key-\\',';': 'key-;',':': 'key-;',"'": "key-'",'"': "key-'",',': 'key-,','<': 'key-,','.': 'key-.','>': 'key-.','/': 'key-/','?': 'key-/'};
        return specialCharsMap[char] || `key-${char.toLowerCase()}`;
    }

    function updateKeyboardHighlight(char, isActive) {
        if (!char) return;
        const keyId = getVirtualKeyId(char);
        const keyElement = document.getElementById(keyId);
        if (keyElement) { if (isActive) keyElement.classList.add('active'); else keyElement.classList.remove('active'); }
        else console.warn(`Key element not found for char: '${char}' (mapped to ID: '${keyId}')`);
    }

    function populateTextToType(text) {
        textToTypeElement.innerHTML = '';
        textSpans = text.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char;
            if (char === '\n') span.classList.add('newline-char');
            span.classList.add('placeholder');
            textToTypeElement.appendChild(span);
            return span;
        });
        if (textSpans.length > 0) {
            textSpans[0].classList.add('current-letter-text');
            updateKeyboardHighlight(textSpans[0].textContent, true);
            if (typeof textSpans[0].scrollIntoView === 'function') textSpans[0].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
        }
    }

    function createVirtualKeyboard() { /* ... (Full implementation from previous step, assumed correct and complete) ... */
        virtualKeyboardElement.innerHTML = '';
        const fingerZoneMap = { '`': 'zone-l-pinky', '1': 'zone-l-pinky', 'q': 'zone-l-pinky', 'a': 'zone-l-pinky', 'z': 'zone-l-pinky', 'Tab': 'zone-l-pinky', 'Caps Lock': 'zone-l-pinky', 'ShiftLeft': 'zone-l-pinky', 'ControlLeft': 'zone-l-pinky', 'AltLeft': 'zone-l-pinky', '2': 'zone-l-ring', 'w': 'zone-l-ring', 's': 'zone-l-ring', 'x': 'zone-l-ring', '3': 'zone-l-middle', 'e': 'zone-l-middle', 'd': 'zone-l-middle', 'c': 'zone-l-middle', '4': 'zone-l-index', 'r': 'zone-l-index', 'f': 'zone-l-index', 'v': 'zone-l-index', '5': 'zone-l-index-far', 't': 'zone-l-index-far', 'g': 'zone-l-index-far', 'b': 'zone-l-index-far', '6': 'zone-r-index-far', 'y': 'zone-r-index-far', 'h': 'zone-r-index-far', 'n': 'zone-r-index-far', '7': 'zone-r-index', 'u': 'zone-r-index', 'j': 'zone-r-index', 'm': 'zone-r-index', '8': 'zone-r-middle', 'i': 'zone-r-middle', 'k': 'zone-r-middle', ',': 'zone-r-middle', '9': 'zone-r-ring', 'o': 'zone-r-ring', 'l': 'zone-r-ring', '.': 'zone-r-ring', '0': 'zone-r-pinky', '-': 'zone-r-pinky', '=': 'zone-r-pinky', 'p': 'zone-r-pinky', '[': 'zone-r-pinky', ']': 'zone-r-pinky', '\\': 'zone-r-pinky', ';': 'zone-r-pinky', "'": 'zone-r-pinky', '/': 'zone-r-pinky', 'Backspace': 'zone-r-pinky', 'Enter': 'zone-r-pinky', 'ShiftRight': 'zone-r-pinky', 'AltRight': 'zone-r-pinky', 'ControlRight': 'zone-r-pinky', 'Space': 'zone-thumb'};
        const keyboardLayout = [['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'], ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'], ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'], ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'], ['ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight']];
        keyboardLayout.forEach(row => {
            const rowElement = document.createElement('div'); rowElement.classList.add('keyboard-row');
            row.forEach(key => {
                const keyElement = document.createElement('div'); keyElement.classList.add('key'); keyElement.textContent = key; keyElement.id = getVirtualKeyId(key);
                if (key === 'Backspace') keyElement.classList.add('key-backspace'); else if (key === 'Tab') keyElement.classList.add('key-tab'); else if (key === 'Caps Lock') keyElement.classList.add('key-capslock'); else if (key === 'Enter') keyElement.classList.add('key-enter'); else if (key === 'ShiftLeft' || key === 'ShiftRight') keyElement.classList.add('key-shift'); else if (key === 'Space') keyElement.classList.add('key-space'); else if (key === 'ControlLeft' || key === 'ControlRight' || key === 'AltLeft' || key === 'AltRight') keyElement.classList.add('key-modifier'); else keyElement.classList.add('key-standard');
                let lookupKey = key.length > 1 ? key : key.toLowerCase(); if (key === '\\') lookupKey = '\\'; if (key === 'Enter') lookupKey = 'Enter';
                const zoneClass = fingerZoneMap[lookupKey]; if (zoneClass) keyElement.classList.add(zoneClass); else console.warn(`Key '${key}' (lookupKey: '${lookupKey}') not found in fingerZoneMap.`);
                if (key.length === 1 && !key.match(/[a-z0-9 ]/i)) keyElement.classList.add('special-visual'); else if (key.length > 1 && !['Backspace', 'Tab', 'Caps Lock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight'].includes(key)) keyElement.classList.add('special-visual');
                rowElement.appendChild(keyElement);
            });
            virtualKeyboardElement.appendChild(rowElement);
        });
    }

    // Stats Calculation Functions
    function calculateWPM(charsTyped, timeMillis) {
        if (timeMillis === 0 || charsTyped === 0) return 0;
        const wordsTyped = charsTyped / 5; // Standard word length (average 5 chars)
        const minutes = timeMillis / 60000;
        return Math.round(wordsTyped / minutes);
    }

    function calculateKPM(charsTyped, timeMillis) {
        if (timeMillis === 0 || charsTyped === 0) return 0;
        const minutes = timeMillis / 60000;
        return Math.round(charsTyped / minutes);
    }

    function calculateAccuracy(correct, errors) {
        if (correct === 0 && errors === 0) return 100; // No typing done yet
        if (correct + errors === 0) return 0; // Should not happen if errors > 0
        return (correct / (correct + errors)) * 100;
    }

    function updateStatsDisplay() { // Removed isFinal parameter
        if (!wpmDisplay || !accuracyDisplay || !kpmDisplay) return;

        let currentAccuracy = calculateAccuracy(correctCharsTyped, totalErrors);
        accuracyDisplay.textContent = `Accuracy: ${currentAccuracy.toFixed(1)}%`;

        if (timerStarted) {
            const elapsedTimeMillis = Date.now() - startTime;
            // Only show speed after a small delay/chars to avoid extreme values
            if (elapsedTimeMillis > 500 && correctCharsTyped > 0) {
                let currentWPM = calculateWPM(correctCharsTyped, elapsedTimeMillis);
                let currentKPM = calculateKPM(correctCharsTyped, elapsedTimeMillis);
                wpmDisplay.textContent = `WPM: ${currentWPM}`;
                kpmDisplay.textContent = `KPM: ${currentKPM}`;
            } else if (correctCharsTyped === 0 && elapsedTimeMillis > 500) { // Timer started (e.g. by error) but no correct chars
                 wpmDisplay.textContent = "WPM: 0";
                 kpmDisplay.textContent = "KPM: 0";
            }
            // If timer started but not enough time/chars for a stable reading yet,
            // WPM/KPM will retain their previous state (e.g., "---" from initial or reset).
        } else { // Timer not started (initial state or after reset)
            wpmDisplay.textContent = "WPM: ---";
            accuracyDisplay.textContent = "Accuracy: ---%";
            kpmDisplay.textContent = "KPM: ---";
        }
    }

    function resetTypingPractice() {
        if (textSpans && textSpans.length > 0 && currentIndex < textSpans.length && textSpans[currentIndex] && textSpans[currentIndex].textContent) {
            updateKeyboardHighlight(textSpans[currentIndex].textContent, false);
        }
        currentIndex = 0;
        populateTextToType(currentPracticeText);

        startTime = 0;
        correctCharsTyped = 0;
        totalErrors = 0;
        timerStarted = false;

        updateStatsDisplay(); // Reset display to "---"
        console.log("Typing practice and stats display reset.");
    }

    // Modal Logic
    if (customTextBtn) customTextBtn.onclick = () => { if(customTextModal) customTextModal.style.display = "block"; if(customTextArea) { customTextArea.value = currentPracticeText; customTextArea.focus(); }};
    if (closeModalBtn) closeModalBtn.onclick = () => { if(customTextModal) customTextModal.style.display = "none"; };
    if (submitCustomTextBtn) submitCustomTextBtn.onclick = () => { if(customTextArea) { const newText = customTextArea.value; if (newText.trim() !== "") { currentPracticeText = newText; resetTypingPractice(); if(customTextModal) customTextModal.style.display = "none"; } else { alert("Please enter some text to practice."); }}};
    window.onclick = (event) => { if (event.target == customTextModal) { if(customTextModal) customTextModal.style.display = "none"; }};

    // Saved Texts Logic
    function renderSavedTexts() { /* ... (Full implementation from previous step) ... */
        if (!savedTextsContainer || !noSavedTextsMsg) return; savedTextsContainer.innerHTML = '';
        const savedTexts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        if (savedTexts.length === 0) { noSavedTextsMsg.style.display = 'block'; return; } noSavedTextsMsg.style.display = 'none';
        savedTexts.forEach((text, index) => {
            const card = document.createElement('div'); card.classList.add('saved-text-card');
            const snippet = text.substring(0, 100) + (text.length > 100 ? '...' : ''); card.textContent = snippet; card.title = text;
            card.addEventListener('click', () => { currentPracticeText = text; resetTypingPractice(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
            const deleteBtn = document.createElement('button'); deleteBtn.textContent = '×'; deleteBtn.classList.add('delete-card-btn'); deleteBtn.title = 'Delete this saved text';
            deleteBtn.addEventListener('click', (event) => { event.stopPropagation(); deleteSavedText(index); });
            card.appendChild(deleteBtn); savedTextsContainer.appendChild(card);
        });
    }
    function saveCurrentText() { /* ... (Full implementation from previous step) ... */
        if (!currentPracticeText || currentPracticeText.trim() === "") { alert("There is no text to save."); return; }
        const savedTexts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        if (savedTexts.includes(currentPracticeText)) { alert("This text is already saved."); return; }
        savedTexts.push(currentPracticeText); localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedTexts));
        alert("Text saved!"); renderSavedTexts();
    }
    function deleteSavedText(indexToDelete) { /* ... (Full implementation from previous step) ... */
        let savedTexts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        if (indexToDelete >= 0 && indexToDelete < savedTexts.length) {
            const textToDeleteSnippet = savedTexts[indexToDelete].substring(0,20) + "...";
            if (confirm(`Are you sure you want to delete this text card: "${textToDeleteSnippet}"?`)) {
                savedTexts.splice(indexToDelete, 1); localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedTexts)); renderSavedTexts();
            }
        }
    }
    if (saveTextBtn) saveTextBtn.addEventListener('click', saveCurrentText);

    // Keydown event listener
    document.addEventListener('keydown', (event) => {
        // If modal is open and textarea has focus, let textarea handle keys.
        if (customTextModal && customTextModal.style.display === 'block' && document.activeElement === customTextArea) {
            // Allow textarea to receive all key inputs normally, including space.
            return;
        }

        // If we are here, the main typing game is active.
        // Prevent page scroll for spacebar in the main typing game.
        // This needs to be unconditional for spacebar if game is active.
        if (event.key === ' ') {
            event.preventDefault();
        }

        const pressedKey = event.key;
        if (currentIndex >= textSpans.length) return;
        // The check for modal open and customTextArea NOT being focused is tricky.
        // The first check (modal open AND textarea focused -> return) is the most important.
        // If modal is open but something else is focused (e.g. a button in modal, or modal itself),
        // spacebar might still scroll. The unconditional preventDefault above handles this
        // as long as the first check (textarea focused) has passed.
        // We need to ensure Escape still works for modal.
        if (customTextModal && customTextModal.style.display === 'block' && pressedKey === 'Escape') {
             // closeModalBtn.onclick(); // or similar logic to close modal
             // For now, this specific escape handling for modal is not part of the spacebar fix.
             // The existing modal logic handles escape via window.onclick or close button.
        }


        const currentSpan = textSpans[currentIndex];
        const expectedChar = currentSpan.textContent;
        let comparisonPassed = false;
        if (expectedChar === '\n') { if (pressedKey === 'Enter') comparisonPassed = true; }
        else if (pressedKey === expectedChar) comparisonPassed = true;

        // Prevent default browser action for Enter if it was correctly typed for a newline.
        // Spacebar's preventDefault is now handled unconditionally above for the main game context.
        if (comparisonPassed && (pressedKey === 'Enter')) { // Only Enter needs specific check here now
            event.preventDefault();
        }

        const nonTypingFunctionalKeys = ['Shift', 'Control', 'Alt', 'CapsLock', 'Meta', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Backspace'];
        if (nonTypingFunctionalKeys.includes(pressedKey) && !comparisonPassed) {
            console.log(`Functional key ${pressedKey} pressed, and not the expected input. Ignoring.`);
            return;
        }

        if (comparisonPassed) {
            if (!timerStarted) { startTime = Date.now(); timerStarted = true; console.log("Timer started on correct key."); }
            correctCharsTyped++;
            updateStatsDisplay(); // Live accuracy

            currentSpan.classList.remove('placeholder', 'current-letter-text', 'incorrect-letter-flash');
            currentSpan.classList.add('correct-letter', 'selected-letter');
            updateKeyboardHighlight(expectedChar, false);
            currentIndex++;
            if (currentIndex < textSpans.length) {
                const nextSpan = textSpans[currentIndex];
                nextSpan.classList.add('current-letter-text');
                updateKeyboardHighlight(nextSpan.textContent, true);
                if (nextSpan && typeof nextSpan.scrollIntoView === 'function') nextSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            } else { // Text completed
                updateKeyboardHighlight(expectedChar, false);
                updateStatsDisplay(); // WPM/KPM will be final as timer is running and text is complete
                setTimeout(() => alert("Congratulations! Text completed."), 100);
            }
        } else {
            if (currentIndex < textSpans.length) {
                if (!timerStarted && currentPracticeText.length > 0) { startTime = Date.now(); timerStarted = true; console.log("Timer started on first error."); }
                totalErrors++;
                updateStatsDisplay(); // Live accuracy

                textSpans[currentIndex].classList.add('incorrect-letter-flash');
                setTimeout(() => { if (currentIndex < textSpans.length) textSpans[currentIndex].classList.remove('incorrect-letter-flash'); }, 300);
                if (pressedKey.length === 1 || ['Enter', 'Tab', 'Backspace', ' '].includes(pressedKey)) {
                    const wrongKeyId = getVirtualKeyId(pressedKey);
                    const wrongKeyElement = document.getElementById(wrongKeyId);
                    if (wrongKeyElement) { wrongKeyElement.classList.add('key-incorrect-flash'); setTimeout(() => wrongKeyElement.classList.remove('key-incorrect-flash'), 300); }
                    else console.warn(`Incorrect key flash: Key element not found for ID: '${wrongKeyId}' (pressed: '${pressedKey}')`);
                }
            }
        }
    });

    // Initial Setup
    createVirtualKeyboard();
    populateTextToType(currentPracticeText);
    renderSavedTexts();
    updateStatsDisplay(); // Set initial "---" state for stats

    console.log("Typing practice script loaded and initialized.");
});
