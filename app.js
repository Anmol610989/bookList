// Book Claas

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class
class UI {
  // method to display books
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="danger-btn delete">X</a></td>
        `;
    list.appendChild(row);
  }

  // method to delete book from ui
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  // show alert method
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // vanish in 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

// Clear fields method
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store class: handles storage

class Store {
  static getBooks() {
    let books ;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  
  // Add book to the local Storage
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Remove book from the Local Storage
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
     localStorage.setItem("books", JSON.stringify(books));
  }

}

// Events: Display books

document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Add a book // submit the form
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "error");
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI

    UI.addBookToList(book);
    // Show success message
    UI.showAlert("Book added to the list Successfully", "success");

    // Add book to the Store
    Store.addBook(book);

    // Clear fields
    UI.clearFields();
  }
});

// Events: Remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  // show remove message
  UI.showAlert("Book removed", "success"); 

  // Remove book from store
  const isbn =  e.target.parentElement.previousElementSibling.textContent
  Store.removeBook(isbn);
});
