# Άσκηση: Κλάση Book — Βιβλιοθήκη
# Δυσκολία: ⭐⭐⭐

class Book:
    total_books = 0

    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
        self.available = True
        Book.total_books += 1

    def borrow(self):
        if self.available:
            self.available = False
            print("Δανεισμός:", self.title)
        else:
            print("Το βιβλίο δεν είναι διαθέσιμο")

    def return_book(self):
        self.available = True
        print("Επιστροφή:", self.title)

    def display(self):
        status = "Διαθέσιμο" if self.available else "Δανεισμένο"
        print(self.title, "-", self.author, "(" + str(self.pages), "σελ.) [" + status + "]")

    @classmethod
    def get_total(cls):
        return cls.total_books


# Δημιουργία βιβλίων
b1 = Book("Python 101", "Γιάννης", 250)
b2 = Book("Αλγόριθμοι", "Μαρία", 180)

# Εμφάνιση
b1.display()    # → Python 101 - Γιάννης (250 σελ.) [Διαθέσιμο]
b2.display()    # → Αλγόριθμοι - Μαρία (180 σελ.) [Διαθέσιμο]

# Δανεισμός
b1.borrow()              # → Δανεισμός: Python 101
b1.borrow()              # → Το βιβλίο δεν είναι διαθέσιμο
b1.display()             # → [Δανεισμένο]

# Επιστροφή & εκ νέου δανεισμός
b1.return_book()         # → Επιστροφή: Python 101
b1.borrow()              # → Δανεισμός: Python 101

# Σύνολο βιβλίων
print("Σύνολο:", Book.get_total())  # → 2
