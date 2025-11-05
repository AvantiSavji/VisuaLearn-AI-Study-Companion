// ==== SELECT ELEMENTS ====
const summarizeBtn = document.getElementById("summarizeBtn");
const simplifyBtn = document.getElementById("simplifyBtn");
const quizBtn = document.getElementById("quizBtn");
const userInput = document.getElementById("userInput");
const outputContainer = document.getElementById("outputContainer");

// ==== MAIN FUNCTION TO CALL GEMINI VIA BACKEND ====
const callGeminiAPI = async (prompt) => {
    outputContainer.innerHTML = "<p>Generating response, please wait...</p>";

    try {
        const response = await fetch("http://localhost:3000/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }) //Converts your prompt text into a JSON string before sending it.
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        outputContainer.innerHTML = `<p>${data.reply.replace(/\n/g, "<br>")}</p>`;

    } catch (error) {
        console.error("Frontend Error:", error);
        outputContainer.innerHTML = "<p>❌ Something went wrong while contacting the server. Check console for details.</p>";
    }
};

// ==== EVENT LISTENERS ====
summarizeBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return alert("Please enter some text to summarize.");
    const prompt = `Summarize the following text concisely:\n\n"${text}"`;
    callGeminiAPI(prompt);
});

simplifyBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return alert("Please enter some text to simplify.");
    const prompt = `Explain the following text in simple, beginner-friendly terms:\n\n"${text}"`;
    callGeminiAPI(prompt);
});

quizBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return alert("Please enter some text to generate a quiz from.");
    const prompt = `Generate a 3-question multiple-choice quiz based on this text. Provide correct answers too:\n\n"${text}"`;
    callGeminiAPI(prompt);
});
