const messages = [
    "The speaker discussed their listening habits and mentioned that they mostly listen to music while driving, particularly genres such as afro music, hip-hop, and R&B. They also mentioned that they enjoy listening to music while working out at the gym.",
    "Speaker 1 discussed the importance of music in schools in their country, India, where it is used to express emotions and is taught as a subject in schools. They also mentioned their personal experience of attending live concerts and their favorite artists.",
    "Speaker 1 shared their experience of attending a live concert, which they had always wanted to do and made happen. They described it as a great experience and highlighted the difference between live concerts and other forms of entertainment. Speaker 0 then asked the group to discuss their preference between magazines and newspapers.",
    "Speaker 1 discussed their interest in fashion and interior design magazines, which they find creative and informative. They enjoy learning about new trends and discovering unique styles from around the world. Reading magazines provides them with knowledge about different fabrics, decor styles, and design elements.",
];

// Initialize counters for message and letter index
let messageIndex = 0;
let letterIndex = 0;
let letterInterval; // Variable to hold the letter display interval

// Function to display the next letter
function displayNextLetter() {
    const summaryElement = document.getElementById("summary");
    const currentMessage = messages[messageIndex]; // Get the current message

    // Check if there are more letters in the current message
    if (letterIndex < currentMessage.length) {
        summaryElement.appendChild(document.createTextNode(currentMessage[letterIndex])); // Append the next letter
        letterIndex++; // Move to the next letter
    } else {
        clearInterval(letterInterval); // Stop the letter display interval
        messageIndex++; // Move to the next message
        letterIndex = 0; // Reset letter index for the new message

        // If there are more messages, set up the next message display
        if (messageIndex < messages.length) {
            setTimeout(() => {
                summaryElement.appendChild(document.createElement('BR')); // Add a line break before the next message
                summaryElement.appendChild(document.createElement('BR')); // Add an extra line break for spacing
                startLetterDisplay(); // Start displaying the letters of the next message
            }, 31000); // Wait for 31 seconds before showing the next message
        }
    }
}

// Function to start displaying letters of the current message
function startLetterDisplay() {
    letterInterval = setInterval(displayNextLetter, 50); // Call displayNextLetter every half second
}

// Start the display with the first message
// Start the display with a 10-second delay for the first message
setTimeout(() => {
    startLetterDisplay(); // Start displaying letters after the delay
}, 31000); // Delay of 31 seconds
