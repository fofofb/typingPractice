document.addEventListener('DOMContentLoaded', () => {
    const textToTypeElement = document.getElementById('text-to-type');
    const virtualKeyboardElement = document.getElementById('virtual-keyboard');
    let currentIndex = 0;
    let textSpans = [];

    const sampleText = "Type this short text. Then type this one. And this.";
    // const sampleText = "Hello world! This is a typing practice example. Type this text accurately and quickly. Good luck and have fun practicing your typing skills. The quick brown fox jumps over the lazy dog.";


    function getVirtualKeyId(char) {
        if (char === ' ') return 'key-space';
        // Handle named keys from keyboardLayout directly
        const namedKeys = ['Backspace', 'Tab', 'Caps Lock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft', 'AltRight', 'ControlRight'];
        if (namedKeys.includes(char)) {
            return `key-${char.replace(/\s+/g, '')}`;
        }

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
            '-': 'key--', '_': 'key--',
            '=': 'key-=', '+': 'key-=',
            '[': 'key-[', '{': 'key-[',
            ']': 'key-]', '}': 'key-]',
            '\\': 'key-\\', '|': 'key-\\',
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
            updateKeyboardHighlight(textSpans[0].textContent, true);
        }
    }

    function createVirtualKeyboard() {
        virtualKeyboardElement.innerHTML = '';
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
                keyElement.classList.add('key'); // Base class
                keyElement.textContent = key;

                let keyId;
                if (key === ' ') keyId = 'key-space';
                else if (key === '\\') keyId = 'key-\\';
                else if (key === '-') keyId = 'key--';
                else if (key.length > 1) keyId = `key-${key.replace(/\s+/g, '')}`;
                else keyId = `key-${key.toLowerCase()}`;
                keyElement.id = keyId;

                // Add sizing classes
                if (key === 'Backspace') keyElement.classList.add('key-backspace');
                else if (key === 'Tab') keyElement.classList.add('key-tab');
                else if (key === 'Caps Lock') keyElement.classList.add('key-capslock');
                else if (key === 'Enter') keyElement.classList.add('key-enter');
                else if (key === 'ShiftLeft' || key === 'ShiftRight') keyElement.classList.add('key-shift');
                else if (key === 'Space') keyElement.classList.add('key-space');
                else if (key === 'ControlLeft' || key === 'ControlRight' || key === 'AltLeft' || key === 'AltRight') keyElement.classList.add('key-modifier');
                else keyElement.classList.add('key-standard');

                // Visual distinction for special char keys (non-alpha)
                if (key.length === 1 && !key.match(/[a-z0-9 ]/i)) { // Check if it's a single character and not alphanumeric or space
                     keyElement.classList.add('special-visual');
                } else if (key.length > 1 && !['Backspace', 'Tab', 'Caps Lock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight'].includes(key)){
                     keyElement.classList.add('special-visual'); // if it's a multi-char key not in the list of special function keys
                }


                rowElement.appendChild(keyElement);
            });
            virtualKeyboardElement.appendChild(rowElement);
        });
    }

    document.addEventListener('keydown', (event) => {
        const pressedKey = event.key;

        if (currentIndex >= textSpans.length) return;

        const currentSpan = textSpans[currentIndex];
        const expectedChar = currentSpan.textContent;

        if (pressedKey === ' ' && expectedChar === ' ') event.preventDefault();

        // Simplified check for ignorable functional keys
        // if (pressedKey.length > 1 && !['Tab', 'Enter', 'Backspace', 'Space'].includes(pressedKey) && pressedKey !== expectedChar) {
        // Keys like 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ArrowUp', etc.
        // We also need to consider if the expectedChar itself is one of these (e.g. if "ShiftLeft" was in sampleText)
        const isFunctionalKey = pressedKey.length > 1 &&
                               !['Enter', 'Tab', 'Backspace', 'Space'].includes(pressedKey); // Space is single char, others are multi-char

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
                updateKeyboardHighlight(expectedChar, false);
            }
        } else {
            // Only flash for printable characters or space, tab, enter, backspace if they were expected but mismatched
            if (pressedKey.length === 1 || ['Enter', 'Tab', 'Backspace'].includes(pressedKey)) {
                 if (currentIndex < textSpans.length) { // Check if there's still a current character
                    textSpans[currentIndex].classList.add('incorrect-letter-flash');
                    setTimeout(() => {
                        if (currentIndex < textSpans.length) { // Check again in case text was completed or reset
                           textSpans[currentIndex].classList.remove('incorrect-letter-flash');
                        }
                    }, 300);
                }
            }
        }
    });

    populateTextToType();
    createVirtualKeyboard();

    console.log("Typing practice script loaded and initialized.");
});
