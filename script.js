document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const virtualKeyboardElement = document.getElementById('virtual-keyboard');

    // New DOM Elements for Modal
    const customTextBtn = document.getElementById('customTextBtn');
    const customTextModal = document.getElementById('customTextModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const customTextArea = document.getElementById('customTextArea');
    const submitCustomTextBtn = document.getElementById('submitCustomTextBtn');

    let currentIndex = 0;
    let textSpans = [];
    let currentPracticeText = "The quick brown fox jumps over the lazy dog. Hello world! This is a typing practice example. Type this text accurately and quickly. Good luck and have fun practicing your typing skills."; // Default text

    function getVirtualKeyId(char) {
        if (char === ' ') return 'key-space';
        const namedKeys = ['Backspace', 'Tab', 'Caps Lock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft', 'AltRight', 'ControlRight'];
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
        const keyId = getVirtualKeyId(char);
        const keyElement = document.getElementById(keyId);
        if (keyElement) {
            if (isActive) keyElement.classList.add('active');
            else keyElement.classList.remove('active');
        } else {
            console.warn(`Key element not found for char: '${char}' with ID: '${keyId}'`);
        }
    }

    // Modified populateTextToType to accept text
    function populateTextToType(text) {
        textToTypeElement.innerHTML = '';
        textSpans = text.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('placeholder');
            textToTypeElement.appendChild(span);
            return span;
        });

        if (textSpans.length > 0) {
            textSpans[0].classList.add('current-letter-text');
            updateKeyboardHighlight(textSpans[0].textContent, true);
        }
    }

    function createVirtualKeyboard() {
        virtualKeyboardElement.innerHTML = '';
        const fingerZoneMap = { /* ... fingerZoneMap definition from previous step ... */
            // Left Hand
            '`': 'zone-l-pinky', '1': 'zone-l-pinky', 'q': 'zone-l-pinky', 'a': 'zone-l-pinky', 'z': 'zone-l-pinky', 'Tab': 'zone-l-pinky', 'Caps Lock': 'zone-l-pinky', 'ShiftLeft': 'zone-l-pinky', 'ControlLeft': 'zone-l-pinky', 'AltLeft': 'zone-l-pinky',
            '2': 'zone-l-ring', 'w': 'zone-l-ring', 's': 'zone-l-ring', 'x': 'zone-l-ring',
            '3': 'zone-l-middle', 'e': 'zone-l-middle', 'd': 'zone-l-middle', 'c': 'zone-l-middle',
            '4': 'zone-l-index', 'r': 'zone-l-index', 'f': 'zone-l-index', 'v': 'zone-l-index',
            '5': 'zone-l-index-far', 't': 'zone-l-index-far', 'g': 'zone-l-index-far', 'b': 'zone-l-index-far',
            // Right Hand
            '6': 'zone-r-index-far', 'y': 'zone-r-index-far', 'h': 'zone-r-index-far', 'n': 'zone-r-index-far',
            '7': 'zone-r-index', 'u': 'zone-r-index', 'j': 'zone-r-index', 'm': 'zone-r-index',
            '8': 'zone-r-middle', 'i': 'zone-r-middle', 'k': 'zone-r-middle', ',': 'zone-r-middle',
            '9': 'zone-r-ring', 'o': 'zone-r-ring', 'l': 'zone-r-ring', '.': 'zone-r-ring',
            '0': 'zone-r-pinky', '-': 'zone-r-pinky', '=': 'zone-r-pinky', 'p': 'zone-r-pinky', '[': 'zone-r-pinky', ']': 'zone-r-pinky', '\\': 'zone-r-pinky', ';': 'zone-r-pinky', "'": 'zone-r-pinky', '/': 'zone-r-pinky', 'Backspace': 'zone-r-pinky', 'Enter': 'zone-r-pinky', 'ShiftRight': 'zone-r-pinky', 'AltRight': 'zone-r-pinky', 'ControlRight': 'zone-r-pinky',
            // Thumbs
            'Space': 'zone-thumb'
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
                let keyId;
                if (key === ' ') keyId = 'key-space';
                else if (key === '\\') keyId = 'key-\\';
                else if (key === '-') keyId = 'key--';
                else if (key.length > 1) keyId = `key-${key.replace(/\s+/g, '')}`;
                else keyId = `key-${key.toLowerCase()}`;
                keyElement.id = keyId;

                if (key === 'Backspace') keyElement.classList.add('key-backspace');
                else if (key === 'Tab') keyElement.classList.add('key-tab');
                else if (key === 'Caps Lock') keyElement.classList.add('key-capslock');
                else if (key === 'Enter') keyElement.classList.add('key-enter');
                else if (key === 'ShiftLeft' || key === 'ShiftRight') keyElement.classList.add('key-shift');
                else if (key === 'Space') keyElement.classList.add('key-space');
                else if (key === 'ControlLeft' || key === 'ControlRight' || key === 'AltLeft' || key === 'AltRight') keyElement.classList.add('key-modifier');
                else keyElement.classList.add('key-standard');

                let lookupKey = key.length > 1 ? key : key.toLowerCase();
                if (key === '\\') lookupKey = '\\';
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

    // Helper function to reset typing practice
    function resetTypingPractice() {
        if (textSpans && textSpans.length > 0 && currentIndex < textSpans.length && textSpans[currentIndex] && textSpans[currentIndex].textContent) {
            updateKeyboardHighlight(textSpans[currentIndex].textContent, false); // Deactivate old current key
        }
        currentIndex = 0;
        populateTextToType(currentPracticeText); // This will re-populate and set the first letter highlight
        console.log("Typing practice reset.");
    }

    // Event Listeners for Modal
    if (customTextBtn) {
        customTextBtn.onclick = function() {
            if(customTextModal) customTextModal.style.display = "block";
            if(customTextArea) {
                customTextArea.value = currentPracticeText; // Pre-fill with current text
                customTextArea.focus();
            }
        }
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            if(customTextModal) customTextModal.style.display = "none";
        }
    }

    if (submitCustomTextBtn) {
        submitCustomTextBtn.onclick = function() {
            if(customTextArea) {
                const newText = customTextArea.value;
                if (newText.trim() !== "") {
                    currentPracticeText = newText;
                    resetTypingPractice();
                    if(customTextModal) customTextModal.style.display = "none";
                } else {
                    alert("Please enter some text to practice.");
                }
            }
        }
    }

    window.onclick = function(event) {
        if (event.target == customTextModal) {
            if(customTextModal) customTextModal.style.display = "none";
        }
    }

    // Keydown event listener for typing logic
    document.addEventListener('keydown', (event) => {
        const pressedKey = event.key;
        if (currentIndex >= textSpans.length) return; // Typing complete

        // If modal is open, don't process typing in background
        if (customTextModal && customTextModal.style.display === "block") {
            // Allow Enter key for submitting text in textarea if textarea is focused
            if (pressedKey === 'Enter' && document.activeElement === customTextArea) {
                // Let the textarea handle the Enter key (e.g. new line) or handle submission if desired
                // For now, we let the button handle submission explicitly.
                // event.preventDefault(); // Optionally prevent default Enter behavior in textarea
                return;
            }
            // Allow other keys for textarea input
            if (document.activeElement === customTextArea) return;
        }


        const currentSpan = textSpans[currentIndex];
        const expectedChar = currentSpan.textContent;

        if (pressedKey === ' ' && expectedChar === ' ') event.preventDefault();

        const isFunctionalKey = pressedKey.length > 1 && !['Enter', 'Tab', 'Backspace'].includes(pressedKey);
        if (isFunctionalKey && pressedKey !== expectedChar) {
            console.log(`Functional key pressed: ${pressedKey}. Expected: ${expectedChar}. Ignoring.`);
            return;
        }

        if (pressedKey === expectedChar) {
            currentSpan.classList.remove('placeholder', 'current-letter-text', 'incorrect-letter-flash');
            currentSpan.classList.add('correct-letter', 'selected-letter');
            updateKeyboardHighlight(expectedChar, false);
            currentIndex++;
            if (currentIndex < textSpans.length) {
                const nextSpan = textSpans[currentIndex];
                nextSpan.classList.add('current-letter-text');
                updateKeyboardHighlight(nextSpan.textContent, true);
            } else {
                setTimeout(() => alert("Congratulations! Text completed."), 100);
                updateKeyboardHighlight(expectedChar, false); // Deactivate last key
            }
        } else { // Incorrect key
            if (currentIndex < textSpans.length) {
                textSpans[currentIndex].classList.add('incorrect-letter-flash');
                setTimeout(() => {
                    if (currentIndex < textSpans.length) textSpans[currentIndex].classList.remove('incorrect-letter-flash');
                }, 300);

                let canFlashWrongKeyOnKeyboard = false;
                const isFunctionalKeyPressedWrongly = pressedKey.length > 1 && !['Enter', 'Tab', 'Backspace'].includes(pressedKey);
                if (isFunctionalKeyPressedWrongly) {
                    console.log(`Incorrect functional key ${pressedKey} pressed (expected ${expectedChar}). Not flashing on keyboard.`);
                } else {
                    canFlashWrongKeyOnKeyboard = true;
                }

                if (canFlashWrongKeyOnKeyboard) {
                    const wrongKeyId = getVirtualKeyId(pressedKey);
                    const wrongKeyElement = document.getElementById(wrongKeyId);
                    if (wrongKeyElement) {
                        wrongKeyElement.classList.add('key-incorrect-flash');
                        setTimeout(() => wrongKeyElement.classList.remove('key-incorrect-flash'), 300);
                    } else {
                        console.warn(`Tried to flash .key-incorrect-flash on non-existent key ID: ${wrongKeyId} for pressed key: ${pressedKey}`);
                    }
                }
            }
        }
    });

    // Initial Setup
    createVirtualKeyboard();
    populateTextToType(currentPracticeText);

    console.log("Typing practice script loaded and initialized.");
});
