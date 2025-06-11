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

    let currentIndex = 0;
    let textSpans = [];
    let currentPracticeText = "The quick brown fox jumps over the lazy dog.\nPress Enter for a new line.\nThis is a typing practice example.\nType this text accurately and quickly.\nGood luck and have fun practicing your typing skills."; // Default text with newlines

    function getVirtualKeyId(char) {
        if (char === '\n' || char === 'Enter') return 'key-enter'; // Map both newline and "Enter" key string to key-enter
        if (char === ' ') return 'key-space';

        const namedKeys = ['Backspace', 'Tab', 'Caps Lock', /* 'Enter' handled above */ 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft', 'AltRight', 'ControlRight'];
        if (namedKeys.includes(char)) {
            return `key-${char.replace(/\s+/g, '')}`;
        }
        const specialCharsMap = {
            '`': 'key-`', '~': 'key-`', '1': 'key-1', '!': 'key-1', '2': 'key-2', '@': 'key-2', '3': 'key-3', '#': 'key-3', '4': 'key-4', '$': 'key-4', '5': 'key-5', '%': 'key-5', '6': 'key-6', '^': 'key-6', '7': 'key-7', '&': 'key-7', '8': 'key-8', '*': 'key-8', '9': 'key-9', '(': 'key-9', '0': 'key-0', ')': 'key-0', '-': 'key--', '_': 'key--', '=': 'key-=', '+': 'key-=', '[': 'key-[', '{': 'key-[', ']': 'key-]', '}': 'key-]', '\\': 'key-\\', '|': 'key-\\', ';': 'key-;', ':': 'key-;', "'": "key-'", '"': "key-'", ',': 'key-,', '<': 'key-,', '.': 'key-.', '>': 'key-.', '/': 'key-/', '?': 'key-/'
        };
        return specialCharsMap[char] || `key-${char.toLowerCase()}`;
    }

    function updateKeyboardHighlight(char, isActive) {
        if (!char) return;
        const keyId = getVirtualKeyId(char); // This will map '\n' to 'key-enter'
        const keyElement = document.getElementById(keyId);
        if (keyElement) {
            if (isActive) keyElement.classList.add('active');
            else keyElement.classList.remove('active');
        } else {
            console.warn(`Key element not found for char: '${char}' (mapped to ID: '${keyId}')`);
        }
    }

    function populateTextToType(text) {
        textToTypeElement.innerHTML = '';
        textSpans = text.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char;
            // If char is '\n', browsers will render it as a line break.
            // We might want to make the span itself invisible or very small for '\n'
            // or represent it with a symbol like ¶ if current-letter-text is on it.
            // For now, default rendering is fine; white-space: pre-wrap handles display.
            if (char === '\n') {
                span.classList.add('newline-char'); // For potential specific styling
                // span.innerHTML = '&#9252;<br>'; // Example: visible symbol for newline + actual break
            }
            span.classList.add('placeholder');
            textToTypeElement.appendChild(span);
            return span;
        });

        if (textSpans.length > 0) {
            textSpans[0].classList.add('current-letter-text');
            updateKeyboardHighlight(textSpans[0].textContent, true);
            if (typeof textSpans[0].scrollIntoView === 'function') {
                textSpans[0].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            }
        }
    }

    function createVirtualKeyboard() {
        virtualKeyboardElement.innerHTML = '';
        const fingerZoneMap = {
            '`': 'zone-l-pinky', '1': 'zone-l-pinky', 'q': 'zone-l-pinky', 'a': 'zone-l-pinky', 'z': 'zone-l-pinky', 'Tab': 'zone-l-pinky', 'Caps Lock': 'zone-l-pinky', 'ShiftLeft': 'zone-l-pinky', 'ControlLeft': 'zone-l-pinky', 'AltLeft': 'zone-l-pinky', '2': 'zone-l-ring', 'w': 'zone-l-ring', 's': 'zone-l-ring', 'x': 'zone-l-ring', '3': 'zone-l-middle', 'e': 'zone-l-middle', 'd': 'zone-l-middle', 'c': 'zone-l-middle', '4': 'zone-l-index', 'r': 'zone-l-index', 'f': 'zone-l-index', 'v': 'zone-l-index', '5': 'zone-l-index-far', 't': 'zone-l-index-far', 'g': 'zone-l-index-far', 'b': 'zone-l-index-far', '6': 'zone-r-index-far', 'y': 'zone-r-index-far', 'h': 'zone-r-index-far', 'n': 'zone-r-index-far', '7': 'zone-r-index', 'u': 'zone-r-index', 'j': 'zone-r-index', 'm': 'zone-r-index', '8': 'zone-r-middle', 'i': 'zone-r-middle', 'k': 'zone-r-middle', ',': 'zone-r-middle', '9': 'zone-r-ring', 'o': 'zone-r-ring', 'l': 'zone-r-ring', '.': 'zone-r-ring', '0': 'zone-r-pinky', '-': 'zone-r-pinky', '=': 'zone-r-pinky', 'p': 'zone-r-pinky', '[': 'zone-r-pinky', ']': 'zone-r-pinky', '\\': 'zone-r-pinky', ';': 'zone-r-pinky', "'": 'zone-r-pinky', '/': 'zone-r-pinky', 'Backspace': 'zone-r-pinky', 'Enter': 'zone-r-pinky', 'ShiftRight': 'zone-r-pinky', 'AltRight': 'zone-r-pinky', 'ControlRight': 'zone-r-pinky', 'Space': 'zone-thumb'
        };
        const keyboardLayout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
            ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
            ['ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight']
        ];

        keyboardLayout.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('keyboard-row');
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.classList.add('key');
                keyElement.textContent = key;
                // Use getVirtualKeyId to ensure consistent ID generation, especially for 'Enter'
                keyElement.id = getVirtualKeyId(key);

                if (key === 'Backspace') keyElement.classList.add('key-backspace');
                else if (key === 'Tab') keyElement.classList.add('key-tab');
                else if (key === 'Caps Lock') keyElement.classList.add('key-capslock');
                else if (key === 'Enter') keyElement.classList.add('key-enter');
                else if (key === 'ShiftLeft' || key === 'ShiftRight') keyElement.classList.add('key-shift');
                else if (key === 'Space') keyElement.classList.add('key-space');
                else if (key === 'ControlLeft' || key === 'ControlRight' || key === 'AltLeft' || key === 'AltRight') keyElement.classList.add('key-modifier');
                else keyElement.classList.add('key-standard');

                let lookupKey = key.length > 1 ? key : key.toLowerCase();
                if (key === '\\') lookupKey = '\\'; // Special case for backslash in map
                if (key === 'Enter') lookupKey = 'Enter'; // Ensure 'Enter' uses 'Enter' for map lookup

                const zoneClass = fingerZoneMap[lookupKey];
                if (zoneClass) keyElement.classList.add(zoneClass);
                else console.warn(`Key '${key}' (lookupKey: '${lookupKey}') not found in fingerZoneMap.`);

                if (key.length === 1 && !key.match(/[a-z0-9 ]/i)) keyElement.classList.add('special-visual');
                else if (key.length > 1 && !['Backspace', 'Tab', 'Caps Lock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight'].includes(key)) keyElement.classList.add('special-visual');

                rowElement.appendChild(keyElement);
            });
            virtualKeyboardElement.appendChild(rowElement);
        });
    }

    function resetTypingPractice() {
        if (textSpans && textSpans.length > 0 && currentIndex < textSpans.length && textSpans[currentIndex] && textSpans[currentIndex].textContent) {
            updateKeyboardHighlight(textSpans[currentIndex].textContent, false);
        }
        currentIndex = 0;
        populateTextToType(currentPracticeText);
        console.log("Typing practice reset.");
    }

    // Modal Logic (custom text input)
    if (customTextBtn) customTextBtn.onclick = () => { if(customTextModal) customTextModal.style.display = "block"; if(customTextArea) { customTextArea.value = currentPracticeText; customTextArea.focus(); }};
    if (closeModalBtn) closeModalBtn.onclick = () => { if(customTextModal) customTextModal.style.display = "none"; };
    if (submitCustomTextBtn) submitCustomTextBtn.onclick = () => { if(customTextArea) { const newText = customTextArea.value; if (newText.trim() !== "") { currentPracticeText = newText; resetTypingPractice(); if(customTextModal) customTextModal.style.display = "none"; } else { alert("Please enter some text to practice."); }}};
    window.onclick = (event) => { if (event.target == customTextModal) { if(customTextModal) customTextModal.style.display = "none"; }};

    // Saved Texts Logic
    function renderSavedTexts() { /* ... (implementation from previous step, assumed correct) ... */
        if (!savedTextsContainer || !noSavedTextsMsg) return;
        savedTextsContainer.innerHTML = '';
        const savedTexts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        if (savedTexts.length === 0) { noSavedTextsMsg.style.display = 'block'; return; }
        noSavedTextsMsg.style.display = 'none';
        savedTexts.forEach((text, index) => {
            const card = document.createElement('div'); card.classList.add('saved-text-card');
            const snippet = text.substring(0, 100) + (text.length > 100 ? '...' : ''); card.textContent = snippet; card.title = text;
            card.addEventListener('click', () => { currentPracticeText = text; resetTypingPractice(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
            const deleteBtn = document.createElement('button'); deleteBtn.textContent = '×'; deleteBtn.classList.add('delete-card-btn'); deleteBtn.title = 'Delete this saved text';
            deleteBtn.addEventListener('click', (event) => { event.stopPropagation(); deleteSavedText(index); });
            card.appendChild(deleteBtn); savedTextsContainer.appendChild(card);
        });
    }
    function saveCurrentText() { /* ... (implementation from previous step, assumed correct) ... */
        if (!currentPracticeText || currentPracticeText.trim() === "") { alert("There is no text to save."); return; }
        const savedTexts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        if (savedTexts.includes(currentPracticeText)) { alert("This text is already saved."); return; }
        savedTexts.push(currentPracticeText); localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedTexts));
        alert("Text saved!"); renderSavedTexts();
    }
    function deleteSavedText(indexToDelete) { /* ... (implementation from previous step, assumed correct) ... */
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
        const pressedKey = event.key; // e.g., "a", "Enter", "Shift"

        if (currentIndex >= textSpans.length) return; // Typing complete or no text

        // If modal is open, generally ignore typing unless it's in the textarea
        if (customTextModal && customTextModal.style.display === "block") {
            if (document.activeElement === customTextArea) return; // Allow typing in textarea
             // If Enter is pressed and modal is open but textarea not focused, could submit/close modal (optional)
            if (pressedKey === 'Enter') { /* submitCustomTextBtn.click(); */ return; } // Or just ignore
            return; // Ignore other keys if modal is open and textarea not focused
        }

        const currentSpan = textSpans[currentIndex];
        const expectedChar = currentSpan.textContent; // This can be '\n'

        let comparisonPassed = false;
        if (expectedChar === '\n') {
            if (pressedKey === 'Enter') {
                comparisonPassed = true;
            }
        } else if (pressedKey === expectedChar) {
            comparisonPassed = true;
        }

        // Prevent default browser action for space and Enter if they were correctly typed
        if (comparisonPassed && (pressedKey === ' ' || pressedKey === 'Enter')) {
            event.preventDefault();
        }

        // Filter out functional keys if they were not the one to make `comparisonPassed` true.
        // Handles cases like pressing Shift, Ctrl, Alt, etc.
        const nonTypingFunctionalKeys = ['Shift', 'Control', 'Alt', 'CapsLock', 'Meta', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Backspace'];
        if (nonTypingFunctionalKeys.includes(pressedKey) && !comparisonPassed) {
            // If 'Enter' was pressed but not expected (i.e., comparisonPassed is false for Enter)
            // it will fall through to the "incorrect key" logic, which is desired.
            console.log(`Functional key ${pressedKey} pressed, and not the expected input. Ignoring.`);
            return;
        }


        if (comparisonPassed) {
            currentSpan.classList.remove('placeholder', 'current-letter-text', 'incorrect-letter-flash');
            currentSpan.classList.add('correct-letter', 'selected-letter');
            updateKeyboardHighlight(expectedChar, false); // expectedChar could be '\n'

            currentIndex++;

            if (currentIndex < textSpans.length) {
                const nextSpan = textSpans[currentIndex];
                nextSpan.classList.add('current-letter-text');
                updateKeyboardHighlight(nextSpan.textContent, true); // nextSpan.textContent could be '\n'

                if (nextSpan && typeof nextSpan.scrollIntoView === 'function') {
                    nextSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                }
            } else {
                updateKeyboardHighlight(expectedChar, false);
                setTimeout(() => alert("Congratulations! Text completed."), 100);
            }
        } else { // Incorrect key pressed
            // This block is reached if comparisonPassed is false.
            // This includes pressing 'Enter' when '\n' was not expected, or 'a' when 'b' was expected.
            // It should not be reached for 'Shift', 'Ctrl' etc. due to the filter above.
            if (currentIndex < textSpans.length) {
                textSpans[currentIndex].classList.add('incorrect-letter-flash');
                setTimeout(() => {
                    if (currentIndex < textSpans.length) textSpans[currentIndex].classList.remove('incorrect-letter-flash');
                }, 300);

                // Flash the incorrectly pressed key on the virtual keyboard
                // Check if it's a printable character or a key we want to give feedback for (like Enter, Space)
                if (pressedKey.length === 1 || ['Enter', 'Tab', 'Backspace', ' '].includes(pressedKey)) {
                    const wrongKeyId = getVirtualKeyId(pressedKey); // Maps "Enter" to "key-enter"
                    const wrongKeyElement = document.getElementById(wrongKeyId);
                    if (wrongKeyElement) {
                        wrongKeyElement.classList.add('key-incorrect-flash');
                        setTimeout(() => wrongKeyElement.classList.remove('key-incorrect-flash'), 300);
                    } else {
                        console.warn(`Incorrect key flash: Key element not found for ID: '${wrongKeyId}' (pressed: '${pressedKey}')`);
                    }
                }
            }
        }
    });

    // Initial Setup
    createVirtualKeyboard();
    populateTextToType(currentPracticeText);
    renderSavedTexts();

    console.log("Typing practice script loaded and initialized.");
});
