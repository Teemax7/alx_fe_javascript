// Initial quote data
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <strong>Category:</strong> ${quote.category}<br/>
    <em>${quote.text}</em>
  `;
}

// Create the form dynamically
function createAddQuoteForm() {
  const container = document.getElementById("quoteFormContainer");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  textInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(button);
}

// Add new quote from form input
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added!");
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();
});
