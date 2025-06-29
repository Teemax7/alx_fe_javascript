let quotes = [];
let selectedCategory = "all";

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");

// Load from local storage
window.onload = function () {
  const storedQuotes = localStorage.getItem("quotes");
  const storedCategory = localStorage.getItem("selectedCategory");

  if (storedQuotes) quotes = JSON.parse(storedQuotes);
  if (storedCategory) selectedCategory = storedCategory;

  populateCategories();
  filterQuotes();
  createAddQuoteForm();
};

// Show a random quote
function showRandomQuote() {
  let filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${quote.text}" - (${quote.category})`;
}

// Add a quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ text, category })
})
.then(response => response.json())
.then(data => {
  console.log('Quote posted to server:', data);
})
.catch(error => {
  console.error('Failed to post quote:', error);
});

  if (!Array.from(categoryFilter.options).some(opt => opt.value === category)) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();
  
}

// Create dynamic add quote form
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteFormContainer");
  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Save to local storage
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
    option.textContent = cat;
    if (cat === selectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// Filter by category
function filterQuotes() {
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Export quotes
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        throw new Error("Invalid format");
      }
    } catch {
      alert("Invalid JSON format.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Sync quotes with server (simulation)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();

    const newQuotes = data.map(post => ({
      text: post.title,
      category: "Server"
    }));

    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();

    alert("Quotes synced from server.");
  } catch (error) {
    console.error("Error syncing with server:", error);
    alert("Failed to sync with server.");
  }
}
// Simulate posting to server
async function syncQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();

    // Simulate simple conflict resolution (prefer server quotes)
    localStorage.setItem('quotes', JSON.stringify(serverQuotes));
    quotes = serverQuotes;

    populateCategories(); // refresh UI
    filterQuotes(); // refresh quote display
    notifyUser("Quotes synced with server!");
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}
setInterval(syncQuotes, 60000); // sync every 60 seconds
// Event listener for category filter change
categoryFilter.addEventListener("change", filterQuotes);
// Event listener for 'Show New Quote'
newQuoteBtn.addEventListener("click", showRandomQuote);
function notifyUser(message) {
  const notice = document.createElement('div');
  notice.textContent = message;
  notice.style.background = '#e0ffe0';
  notice.style.color = '#0a460a';
  notice.style.border = '1px solid #0a460a';
  notice.style.padding = '8px';
  notice.style.margin = '10px 0';
  document.body.insertBefore(notice, document.body.firstChild);

  setTimeout(() => notice.remove(), 4000);
}
// Initial call to display a random quote
showRandomQuote();