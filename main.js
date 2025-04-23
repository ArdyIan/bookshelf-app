const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");

  if (isStorageExist()) {
    loadData();
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBooks();
  });
});

function isStorageExist() {
  return typeof Storage !== "undefined";
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  }
  renderBooks();
}

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;
  const id = +new Date();
  const newBook = { id, title, author, year, isComplete };
  books.push(newBook);
  saveData();
  renderBooks();
  document.getElementById("bookForm").reset();
}

function createBookElement(book) {
  const title = document.createElement("h3");
  title.className = "text-lg font-bold text-gray-800 ";
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${book.year}`;

  const toggleButton = document.createElement("button");
  toggleButton.innerText = book.isComplete ? "Pindah ke belum selesai dibaca" : "Pindah ke selesai dibaca";

  toggleButton.className = "bg-blue-500 text-white p-1 rounded cursor-pointer hover:bg-blue-700";

  toggleButton.addEventListener("click", () => {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus buku";

  deleteButton.className = "bg-blue-500 text-white p-1 rounded cursor-pointer hover:bg-blue-700 ml-2";

  deleteButton.addEventListener("click", () => {
    books = books.filter((b) => b.id !== book.id);
    saveData();
    renderBooks();
  });

  const container = document.createElement("div");
  container.classList.add("book-item");
  container.className = "bg-white shadow-md rounded-lg p-4 mb-4 border-1 border-gray-300";
  container.append(title, author, year, toggleButton, deleteButton);

  return container;
}

function renderBooks(filteredBooks = null) {
  const incompleteShelf = document.getElementById("incompleteBookshelfList");
  const completeShelf = document.getElementById("completeBookshelfList");

  incompleteShelf.innerHTML = "";
  completeShelf.innerHTML = "";

  const displayBooks = filteredBooks || books;

  displayBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeShelf.appendChild(bookElement);
    } else {
      incompleteShelf.appendChild(bookElement);
    }
  });
}

function searchBooks() {
  const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const filtered = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
  renderBooks(filtered);
}
