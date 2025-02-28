document.addEventListener("DOMContentLoaded", () => {
  const tickerContent = document.getElementById("coin-ticker");
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // Fetch top coins from CoinGecko API
  async function fetchCoins() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
      );
      const data = await response.json();

      data.forEach((coin) => {
        const name = coin.symbol.toUpperCase();
        const price = coin.current_price.toFixed(2);
        const priceChange = coin.price_change_percentage_24h || 0;

        const tickerItem = document.createElement("div");
        tickerItem.style.display = "inline-block";
        tickerItem.style.marginRight = "30px";

        tickerItem.innerHTML = `
          <span>${name} ${price}$</span>
          <span style="color: ${priceChange >= 0 ? 'green' : 'red'};">
            (${priceChange.toFixed(2)}%)
          </span>
        `;

        tickerContent.appendChild(tickerItem);
      });
    } catch (error) {
      console.error("Error fetching coins data:", error);
      tickerContent.innerHTML = "<span>Error loading data</span>";
    }
  }

  fetchCoins();

  // Chatbot functionality
  async function handleChat() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display user message
    const userBubble = document.createElement("div");
    userBubble.className = "user-message";
    userBubble.textContent = `User: ${userMessage}`;
    chatBox.appendChild(userBubble);

    // Scroll to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      // Fetch AI response
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `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`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `User: ${userMessage}\nSol Star:`,
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0]?.text?.trim() || "I'm sorry, I cannot respond to this right now.";

      // Display AI response
      const aiBubble = document.createElement("div");
      aiBubble.className = "ai-message";
      aiBubble.textContent = `Sol Star: ${aiResponse}`;
      chatBox.appendChild(aiBubble);

      // Scroll to the latest message
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error("Error with chatbot API:", error);

      // Display default response
      const aiBubble = document.createElement("div");
      aiBubble.className = "ai-message";
      aiBubble.textContent = "Sol Star: I'm sorry, I cannot respond to this right now.";
      chatBox.appendChild(aiBubble);

      // Scroll to the latest message
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    userInput.value = "";
  }

  sendBtn.addEventListener("click", handleChat);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChat();
  });
});
