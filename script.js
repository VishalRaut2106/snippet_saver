let snippets = JSON.parse(localStorage.getItem("snippets")) || [];

// ADD SNIPPET
function addSnippet() {
  let title = document.getElementById("title").value.trim();
  let code = document.getElementById("code").value.trim();

  // If you added dropdown
  let langElement = document.getElementById("language");
  let language = langElement ? langElement.value : "javascript";

  if (!title || !code) {
    alert("Fill all fields");
    return;
  }

  snippets.unshift({ title, code, language });

  localStorage.setItem("snippets", JSON.stringify(snippets));

  document.getElementById("title").value = "";
  document.getElementById("code").value = "";

  displaySnippets();
}
// DISPLAY
function displaySnippets(filtered = snippets) {
  let container = document.getElementById("snippets");
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i style="font-style: normal; font-size: 40px;">📂</i>
        <p>No snippets found</p>
      </div>`;
    return;
  }

  filtered.forEach((s) => {
    let lang = s.language || "javascript";
    let globalIndex = snippets.indexOf(s);

    container.innerHTML += `
      <div class="snippet">
        <h3>📌 ${s.title}</h3>
        <pre><code class="language-${lang}">
${escapeHTML(s.code)}
        </code></pre>

        <button onclick="copyCode(${globalIndex})">Copy</button>
        <button onclick="editSnippet(${globalIndex})">Edit</button>
        <button onclick="deleteSnippet(${globalIndex})">Delete</button>
      </div>
    `;
  });

  if (window.Prism) {
    Prism.highlightAll();
  }
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
// COPY
function copyCode(index) {
  const code = snippets[index].code;

  navigator.clipboard.writeText(code);

  let toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// EDIT
function editSnippet(index) {
  let s = snippets[index];
  document.getElementById("title").value = s.title;
  document.getElementById("code").value = s.code;
  let langElement = document.getElementById("language");
  if (langElement) langElement.value = s.language || "javascript";
  
  deleteSnippet(index, true);
}

// DELETE
function deleteSnippet(index, skipConfirm = false) {
  if (!skipConfirm && !confirm("Are you sure you want to delete this snippet?")) {
    return;
  }
  snippets.splice(index, 1);
  localStorage.setItem("snippets", JSON.stringify(snippets));
  displaySnippets();
}

// SEARCH
function searchSnippet() {
  let query = document.getElementById("search").value.toLowerCase();

  let filtered = snippets.filter(s =>
    s.title.toLowerCase().includes(query) ||
    s.code.toLowerCase().includes(query)
  );

  displaySnippets(filtered);
}

// CLEAR SEARCH
function clearSearch() {
  document.getElementById("search").value = "";
  searchSnippet();
}

// INIT
displaySnippets();
