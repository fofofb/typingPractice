document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const virtualKeyboardElement = document.getElementById('virtual-keyboard');
    let currentIndex = 0;
    let textSpans = [];

    // Added a shorter text for easier testing, can be changed back later
    const sampleText = "Type this short text. Then type this one. And this.";
    // const sampleText = "Hello world! This is a typing practice example. Type this text accurately and quickly. Good luck and have fun practicing your typing skills. The quick brown fox jumps over the lazy dog.";


    function getVirtualKeyId(char) {
        if (char === ' ') return 'key-space';
        if (char === 'ShiftLeft' || char === 'ShiftRight' || char === 'ControlLeft' || char === 'ControlRight' || char === 'AltLeft' || char === 'AltRight' || char === 'Caps Lock' || char === 'Tab' || char === 'Enter' || char === 'Backspace') {
            return `key-${char.replace(/\s+/g, '')}`;
        }
        // For regular characters, ensure it's lowercase for ID consistency
        // However, the displayed text on keys might be different (e.g. '`' vs 'key-`')
        // The IDs generated in createVirtualKeyboard are like 'key-q', 'key-`', 'key-1'
        const specialCharsMap = {
            '`': 'key-`', '~': 'key-`',
            '1': 'key-1', '!': 'key-1',
            '2': 'key-2', '@': 'key-2',
            '3': 'key-3', '#': 'key-3',
            '4': 'key-4', '$': 'key-4',
            '5': 'key-5', '%': 'key-5',
            '6': 'key-6', '^': 'key-6',
            '7': 'key-7', '&': 'key-7',
            '8': 'key-8', '*': 'key-8',
            '9': 'key-9', '(': 'key-9',
            '0': 'key-0', ')': 'key-0',
            '-': 'key--', '_': 'key--', // ID was key--
            '=': 'key-=', '+': 'key-=',
            '[': 'key-[', '{': 'key-[',
            ']': 'key-]', '}': 'key-]',
            '\\': 'key-\\', '|': 'key-\\', // ID was key-\
            ';': 'key-;', ':': 'key-;',
            "'": "key-'", '"': "key-'",
            ',': 'key-,', '<': 'key-,',
            '.': 'key-.', '>': 'key-.',
            '/': 'key-/', '?': 'key-/'
        };
        return specialCharsMap[char] || `key-${char.toLowerCase()}`;
    }

    function updateKeyboardHighlight(char, isActive) {
        if (!char) return;
        const keyId = getVirtualKeyId(char);
        const keyElement = document.getElementById(keyId);
        if (keyElement) {
            if (isActive) {
                keyElement.classList.add('active');
            } else {
                keyElement.classList.remove('active');
            }
        } else {
            console.warn(`Key element not found for char: '${char}' with ID: '${keyId}'`);
        }
    }

    function populateTextToType() {
        textToTypeElement.innerHTML = '';
        textSpans = sampleText.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('placeholder');
            textToTypeElement.appendChild(span);
            return span;
        });

        if (textSpans.length > 0) {
            textSpans[0].classList.add('current-letter-text');
            updateKeyboardHighlight(textSpans[0].textContent, true); // Highlight first key
        }
    }

    function createVirtualKeyboard() {
        virtualKeyboardElement.innerHTML = '';
        const keyboardLayout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'], // Escaped backslash
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
                else if (key === '\\') keyId = 'key-\\'; // Special ID for backslash character
                else if (key === '-') keyId = 'key--'; // Special ID for hyphen
                else if (key.length > 1) keyId = `key-${key.replace(/\s+/g, '')}`;
                else keyId = `key-${key.toLowerCase()}`; // Default to lowercase for single chars

                keyElement.id = keyId;

                if (key.length > 1 || ['`','\\','[',']',';',"'",',','.','/','-','='].includes(key)) {
                    keyElement.classList.add('special');
                }
                if (key === 'Space') keyElement.style.flexGrow = "6";
                if (['Backspace', 'Tab', 'Enter', 'Caps Lock'].includes(key) || key.startsWith('Shift') || key.startsWith('Control') || key.startsWith('Alt')) {
                    keyElement.style.flexGrow = "2";
                    keyElement.style.minWidth = "60px";
                }
                rowElement.appendChild(keyElement);
            });
            virtualKeyboardElement.appendChild(rowElement);
        });
    }

    document.addEventListener('keydown', (event) => {
        const pressedKey = event.key;

        // Ignore if typing is complete
        if (currentIndex >= textSpans.length) {
            return;
        }

        const currentSpan = textSpans[currentIndex];
        const expectedChar = currentSpan.textContent;

        // Prevent default for space and potentially other keys if they cause scrolling etc.
        if (pressedKey === ' ' && expectedChar === ' ') {
            event.preventDefault();
        }
        // Allow functionality of Tab, Enter, Backspace, etc. for now, but don't process as typed characters unless they match.
        // More specific handling might be needed if we want to use them to control the app itself.

        // Handle non-typable functional keys (Shift, Control, Alt, CapsLock, Meta, etc.)
        // also check if the pressed key is a single character, otherwise it's a special key
        if (pressedKey.length > 1 && !['Tab', 'Enter', 'Backspace', 'Space'].includes(pressedKey) ) {
             if (pressedKey !== expectedChar) { // only ignore if it's not the character we expect (e.g. text contains "ShiftLeft")
                console.log(`Functional key pressed: ${pressedKey}. Ignoring for typing comparison.`);
                return;
            }
        }


        if (pressedKey === expectedChar) {
            currentSpan.classList.remove('placeholder', 'current-letter-text', 'incorrect-letter-flash');
            currentSpan.classList.add('correct-letter', 'selected-letter');
            updateKeyboardHighlight(expectedChar, false); // Deactivate current key

            currentIndex++;

            if (currentIndex < textSpans.length) {
                const nextSpan = textSpans[currentIndex];
                nextSpan.classList.add('current-letter-text');
                updateKeyboardHighlight(nextSpan.textContent, true); // Activate next key
            } else {
                // Text completed
                setTimeout(() => alert("Congratulations! Text completed."), 100); // Timeout to allow final styles to render
                // Optionally, could reset or load new text here.
                updateKeyboardHighlight(expectedChar, false); // Ensure last key is deactivated
            }
        } else {
            // Incorrect key pressed (and it's not one of the ignored functional keys)
            // Check if it's a printable character or one of the allowed special keys (Space, Backspace, etc. if they were part of expected)
            // This check ensures we don't flash for Shift, Ctrl, etc. if they weren't the expected char.
             if (pressedKey.length === 1 || ['Tab', 'Enter', 'Backspace', 'Space'].includes(pressedKey)) {
                currentSpan.classList.add('incorrect-letter-flash');
                setTimeout(() => {
                    currentSpan.classList.remove('incorrect-letter-flash');
                }, 300); // Flash duration
            }
        }
    });

    // Initial setup
    populateTextToType();
    createVirtualKeyboard();

    console.log("Typing practice script loaded and initialized.");
});
