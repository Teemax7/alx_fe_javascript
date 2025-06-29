let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// Show a random quote based on filter
function showRandomQuote() {
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.innerText = `"${filteredQuotes[random].text}" — ${filteredQuotes[random].category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) return alert("Please fill both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  if (!Array.from(categoryFilter.options).some(opt => opt.value === category)) {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  }

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showRandomQuote();
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.text = cat;
    if (cat === selectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes
function filterQuotes() {
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// JSON Export
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for Show New Quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize on load
populateCategories();
filterQuotes();
