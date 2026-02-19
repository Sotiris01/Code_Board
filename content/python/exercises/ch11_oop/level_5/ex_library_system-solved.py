# Άσκηση: Σύστημα Βιβλιοθήκης — OOP
# Δυσκολία: ⭐⭐⭐⭐⭐

class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
        self.available = True

    def borrow(self):
        if self.available:
            self.available = False
            print("Δανεισμός:", self.title)
            return True
        else:
            print("Το βιβλίο", self.title, "δεν είναι διαθέσιμο!")
            return False

    def return_book(self):
        self.available = True
        print("Επιστροφή:", self.title)

    def __str__(self):
        status = "Διαθέσιμο" if self.available else "Δανεισμένο"
        return self.title + " - " + self.author + " [" + status + "]"


class Library:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)
        print("Προστέθηκε:", book.title)

    def find_book(self, title):
        for book in self.books:
            if book.title == title:
                return book
        return None

    def borrow_book(self, title):
        book = self.find_book(title)
        if book is not None:
            book.borrow()
        else:
            print("Δεν βρέθηκε:", title)

    def return_book(self, title):
        book = self.find_book(title)
        if book is not None:
            book.return_book()
        else:
            print("Δεν βρέθηκε:", title)

    def available_books(self):
        result = []
        for book in self.books:
            if book.available:
                result.append(book)
        return result

    def display_all(self):
        print("=== Κατάλογος Βιβλιοθήκης ===")
        for book in self.books:
            print(" ", book)
        avail = len(self.available_books())
        print("Διαθέσιμα:", avail, "/", len(self.books))


# --- Δοκιμή ---
lib = Library()
lib.add_book(Book("Python 101", "Κώστας"))
lib.add_book(Book("Αλγόριθμοι", "Μαρία"))
lib.add_book(Book("Δομές Δεδομένων", "Γιάννης"))

print()
lib.display_all()

print()
lib.borrow_book("Python 101")
lib.borrow_book("Python 101")   # → δεν είναι διαθέσιμο

print()
lib.display_all()

print()
lib.return_book("Python 101")

print()
lib.display_all()
