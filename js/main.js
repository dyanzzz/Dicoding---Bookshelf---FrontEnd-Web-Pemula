const books = [];
const RENDER_EVENT = 'renderBook';
const SAVED_EVENT = 'savedBook';
const STORAGE_KEY = 'BOOK_APPS';
const selectedEditBook = [];
let isEdit = false;

function storageExist() {
    if (typeof (Storage) === undefined) {
        alert('Unfortunately, your browser does not support local storage.');
        return false;
    }
    return true;
}

function saveData() {
    if (storageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event('SAVED_EVENT'));
    }
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (isEdit == true) {
            saveEditBook();
        } else {
            addBook();
        }
        clear();
        selectedEditBook.splice(0, selectedEditBook.length);
        
        const editNameButton = document.getElementById('bookFormSubmit');
        editNameButton.innerText = 'Masukkan Buku ke rak';
    });

    if (storageExist()) {
        loadDataFromStorage();
    }
})

function addBook() {
    isEdit = false;
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(
        generateID,
        title,
        author,
        parseInt(year),
        isComplete
    );
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

function saveEditBook() {
    isEdit = false;
    const getBookId = selectedEditBook[0].id;
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const bookTarget = findBook(getBookId);

    if (bookTarget == null) return;

    bookTarget.id = getBookId;
    bookTarget.title = title;
    bookTarget.author = author;
    bookTarget.year = parseInt(year);
    bookTarget.isComplete = isComplete;

    selectedEditBook.splice(0, selectedEditBook.length);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        };
    };
    return null;
};

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function generateId() {
    return +new Date();
};

// return book
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
};

function clear() {
    document.getElementById('bookFormTitle').value = '';
    document.getElementById('bookFormAuthor').value = '';
    document.getElementById('bookFormYear').value = '';
    document.getElementById('bookFormIsComplete').checked = false;
}

document.addEventListener(RENDER_EVENT, () => {
    const unfinished = document.getElementById('incompleteBookList');
    const finished = document.getElementById('completeBookList');

    unfinished.innerHTML = '';
    finished.innerHTML = '';

    for (const book of books) {
        const bookElement = newBook(book);
        if (book.isComplete) {
            finished.append(bookElement);
        } else {
            unfinished.append(bookElement);
        }
    }
})

function newBook(bookObject) {
    // card-body>content
    const bookTitle = document.createElement('h3');
    bookTitle.setAttribute('data-testid', 'bookItemTitle');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
    bookAuthor.innerText = "Penulis : " + bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.setAttribute('data-testid', 'bookItemYear');
    bookYear.innerText = "Tahun : " + bookObject.year;

    const content = document.createElement('div');
    content.classList.add('content');
    content.append(bookTitle, bookAuthor, bookYear);

    // card-body>action
    const action = document.createElement('div');
    action.classList.add('action');

    // card-body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.setAttribute('data-testid', 'bookItem')
    cardBody.setAttribute('data-bookid', bookObject.id)
    cardBody.append(content, action);

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.setAttribute('type', 'button');
        undoButton.setAttribute('data-testid', 'bookItemIsCompleteButton')
        undoButton.classList.add('btn-submit');
        undoButton.innerText = "Belum Selesai Baca"

        undoButton.addEventListener('click', function () {
            addUnfinished(bookObject.id);
        });
        
        const editButton = document.createElement('button');
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('data-testid', 'bookItemEditButton')
        editButton.classList.add('btn-submit');
        editButton.innerText = "Edit Buku"

        editButton.addEventListener('click', function () {
            editBook(bookObject.id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton')
        deleteButton.classList.add('btn-submit');
        deleteButton.innerText = "Hapus Buku"

        deleteButton.addEventListener('click', function () {
            deleteBook(bookObject.id);
        });

        action.append(undoButton, editButton, deleteButton);

    } else {
        const doneButton = document.createElement('button');
        doneButton.setAttribute('type', 'button');
        doneButton.setAttribute('data-testid', 'bookItemIsCompleteButton')
        doneButton.classList.add('btn-submit');
        doneButton.innerText = "Selesai Baca"

        doneButton.addEventListener('click', function () {
            addFinished(bookObject.id);
        });
        
        const editButton = document.createElement('button');
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('data-testid', 'bookItemEditButton')
        editButton.classList.add('btn-submit');
        editButton.innerText = "Edit Buku"

        editButton.addEventListener('click', function () {
            editBook(bookObject.id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton')
        deleteButton.classList.add('btn-submit');
        deleteButton.innerText = "Hapus Buku"

        deleteButton.addEventListener('click', function () {
            deleteBook(bookObject.id);
        });

        action.append(doneButton, editButton, deleteButton);
    };
    
    return cardBody;
};

function addUnfinished(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

function addFinished(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}

function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget == -1) return;

    const confirmDelete = confirm('Are you sure?');
    if (confirmDelete === true) {
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
        return;
    }

    saveData();
}

function editBook(bookId) {
    isEdit = true;
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    selectedEditBook.push(bookTarget);
    document.getElementById('bookFormTitle').value = bookTarget.title;
    document.getElementById('bookFormAuthor').value = bookTarget.author;
    document.getElementById('bookFormYear').value = bookTarget.year;
    document.getElementById('bookFormIsComplete').checked = bookTarget.isComplete;

    const h2 = document.querySelector('.title-add-book');
    h2.innerText = 'Form Edit Buku'

    const editNameButton = document.getElementById('bookFormSubmit');
    editNameButton.innerText = 'Edit Buku';
}

const search = document.getElementById('searchBookTitle');
search.addEventListener('keyup', function (event) {
    const searchBook = event.target.value.toLowerCase();
    const listBooks = document.querySelectorAll('.card-body');

    listBooks.forEach((book) => {
        const bookTitle = book.querySelector('.content h3').innerText.toLowerCase();
        if (bookTitle.includes(searchBook)) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
});

const searchSubmit = document.getElementById('searchSubmit');
searchSubmit.addEventListener('click', function (event) {
    event.preventDefault();
});