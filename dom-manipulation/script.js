let quotes = [];
let selectedCategory = "all";

// Load quotes from localStorage or start with some defaults
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Live and let live.", category: "Wisdom" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote based on current filter
function showRandomQuote() {
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").textContent = filteredQuotes[randomIndex].text;
}

// Add a new quote from form
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    populateCategories();
    filterQuotes();
  } else {
    alert("Please fill in both fields.");
  }
}

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  const previous = select.value;

  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.value = previous;
}

// Filter quotes when category is selected
function filterQuotes() {
  selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    } catch (e) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// JSON Export
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// Server Sync
async function syncQuotes() {
  try {
    for (let quote of quotes) {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: quote.text, body: quote.category, userId: 1 })
      });
    }
    alert("Quotes synced to server successfully.");
  } catch (error) {
    console.error("Error syncing:", error);
    alert("Failed to sync.");
  }
}

// Fetch from Server (simulate conflict resolution)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();

    const newQuotes = data.map(post => ({
      text: post.title,
      category: "Server"
    }));

    const existingTexts = new Set(quotes.map(q => q.text));
    const filtered = newQuotes.filter(q => !existingTexts.has(q.text));

    if (filtered.length > 0) {
      quotes.push(...filtered);
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("New quotes synced from server.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// Notification UI
function showNotification(message) {
  const div = document.createElement("div");
  div.className = "notification";
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    document.getElementById("categoryFilter").value = savedCategory;
    selectedCategory = savedCategory;
  }

  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
