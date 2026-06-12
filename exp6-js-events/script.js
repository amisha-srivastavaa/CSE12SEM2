// DOM Elements
const messageInput = document.getElementById('messageInput');
const outputDisplay = document.getElementById('outputDisplay');
const messageText = document.getElementById('messageText');
const hoverBtn = document.getElementById('hoverBtn');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');

// 1. onclick event (called directly from HTML)
function displayMessage() {
    const text = messageInput.value.trim();
    if (text === "") {
        messageText.textContent = "Please enter a message first!";
        messageText.className = "placeholder-text";
        messageText.style.color = "red";
    } else {
        messageText.textContent = text;
        messageText.className = ""; // remove placeholder class
        messageText.style.color = "#1f2937"; // reset color
        outputDisplay.style.borderColor = "#3b82f6";
    }
}

// 2. onmouseover event (attached via JS property)
hoverBtn.onmouseover = function() {
    // Change background color of output box
    outputDisplay.style.backgroundColor = "#e0e7ff";
    outputDisplay.style.borderColor = "#8b5cf6";
    
    // If there is text, change its color
    if (messageText.className !== "placeholder-text") {
        messageText.style.color = "#8b5cf6";
    }
};

// onmouseout to revert the hover effect
hoverBtn.onmouseout = function() {
    outputDisplay.style.backgroundColor = "#f8fafc";
    outputDisplay.style.borderColor = "#e5e7eb";
    
    if (messageText.className !== "placeholder-text") {
        messageText.style.color = "#1f2937";
    }
};

// 3. onchange / oninput event (attached via JS property)
// Using oninput instead of onchange so it updates as you type
messageInput.oninput = function() {
    const currentLength = this.value.length;
    charCount.textContent = currentLength;
};

// 4. addEventListener (The modern, preferred way)
clearBtn.addEventListener('click', function() {
    // Clear the input
    messageInput.value = '';
    
    // Reset char count
    charCount.textContent = '0';
    
    // Reset display area
    messageText.textContent = "Waiting for interaction...";
    messageText.className = "placeholder-text";
    messageText.style.color = "#9ca3af";
    
    // Reset box styling
    outputDisplay.style.backgroundColor = "#f8fafc";
    outputDisplay.style.borderColor = "#e5e7eb";
});
