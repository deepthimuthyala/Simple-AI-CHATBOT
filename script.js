// ==========================================
// AI CHATBOT - FRONTEND JAVASCRIPT
// ==========================================


// ==========================================
// SEND MESSAGE FUNCTION
// ==========================================

async function sendMessage() {

    // Get input box
    const userInput = document.getElementById("userInput");

    // Get the message typed by the user
    const message = userInput.value.trim();


    // ------------------------------------------
    // Check if message is empty
    // ------------------------------------------

    if (message === "") {
        return;
    }


    // Get chat box
    const chatBox = document.getElementById("chatBox");


    // ==========================================
    // DISPLAY USER MESSAGE
    // ==========================================

    const userMessage = document.createElement("div");

    userMessage.classList.add(
        "message",
        "user-message"
    );

    userMessage.innerText = message;

    // Add user message to chat box
    chatBox.appendChild(userMessage);


    // Clear input box
    userInput.value = "";


    // Scroll chat to bottom
    chatBox.scrollTop = chatBox.scrollHeight;


    // ==========================================
    // CREATE BOT MESSAGE
    // ==========================================

    const botMessage = document.createElement("div");

    botMessage.classList.add(
        "message",
        "bot-message"
    );

    // Show temporary message
    botMessage.innerText = "Thinking...";

    // Add bot message to chat
    chatBox.appendChild(botMessage);


    // ==========================================
    // SEND MESSAGE TO NODE.JS BACKEND
    // ==========================================

    try {

        const response = await fetch(
            "http://localhost:3000/chat",
            {

                // HTTP method
                method: "POST",

                // Tell backend that we are sending JSON
                headers: {
                    "Content-Type": "application/json"
                },

                // Convert JavaScript object into JSON
                body: JSON.stringify({
                    message: message
                })
            }
        );


        // ==========================================
        // CHECK SERVER RESPONSE
        // ==========================================

        if (!response.ok) {

            throw new Error(
                "Server returned an error: " +
                response.status
            );
        }


        // Convert response into JSON
        const data = await response.json();


        // ==========================================
        // DISPLAY BOT RESPONSE
        // ==========================================

if (data.reply) {

    // Display AI response
    botMessage.innerText = data.reply;

    // Create token information
    const tokenInfo = document.createElement("div");

    tokenInfo.classList.add("token-info");

    tokenInfo.innerText =
        "📊 Tokens used: " +
        data.tokenUsage.totalTokens;

    // Put token information INSIDE the bot response
    botMessage.appendChild(tokenInfo);
}

        else if (data.error) {

            // Backend error
            botMessage.innerText =
                "Error: " + data.error;

        }

        else {

            // Unknown response
            botMessage.innerText =
                "Sorry, I received an unexpected response.";

        }


    }


    // ==========================================
    // HANDLE CONNECTION ERROR
    // ==========================================

    catch (error) {

        console.error(
            "Backend connection error:",
            error
        );


        botMessage.innerText =
            "Sorry, I could not connect to the server.";

    }


    // ==========================================
    // SCROLL TO LATEST MESSAGE
    // ==========================================

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// ==========================================
// PRESS ENTER TO SEND MESSAGE
// ==========================================

document.getElementById("userInput").addEventListener(
    "keydown",
    function(event) {

        // If user presses Enter
        if (event.key === "Enter") {

            sendMessage();

        }

    }
);