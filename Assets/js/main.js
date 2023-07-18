// ----- Book Class: Represents a Book

class Book {
    constructor(title, author, genre) {// Runs when book is instantiated
        this.title = title; // title will be set to what is passed in parameter
        this.author = author;
        this.genre = genre;
    } 
}

// ----- UI Class: Handle UI Tasks

class UI { // Methods
    static displayBooks(){ // Don't want to instantiate so we make static
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book)); // Loops through array of books and adds them to list
    }

    static addBookToList(book) {
        // Create row to add to tbody
        const list = document.querySelector('#bookList');

        // Create row element
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td class="exit"><a href="#" class="deleteBtn">X</a></td>
        `;

        list.appendChild(row); // Appending row to list
    }

    static deleteBook(el) {
        if(el.classList.contains('deleteBtn')){
            el.parentElement.parentElement.remove(); // parent of delete is td to parent of td which is tr
        }
    }

    static showAlert(mesasge, className) {
        const div = document.createElement('div');
        div.className = `alert alert ${className}`;
        div.appendChild(document.createTextNode(mesasge));

        const container = document.querySelector('.form-wrapper');
        const form = document.querySelector('#bookForm');
        container.insertBefore(div, form); // Insert div before form

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#genre').value = '';
    }
}

// ----- Store Class: Handle Storage(local storage)

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')); // Parse string into array
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books)); // String back into array/object
    }

    static removeBook(genre) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.genre === genre) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// ----- Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// ----- Event: Add a Book

document.querySelector('#bookForm').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const genre = document.querySelector('#genre').value;

    // Validation
    if(title === '' || author === '' || genre === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate book
        const book = new Book(title, author, genre); // Book Class up top

        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        UI.showAlert('Book Added', 'success');

        UI.clearFields(); // Clears field
    }


    
});

// ----- Event: Remove a Book

/* Event Propagation, we select something above like the book list and we target whatever is inside of it (bubbling/capturing?)
Reason for this is that if we have multiple delete buttons so that would only select the single one at the top which is the first delete class */

document.querySelector('#bookList').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'success');
});