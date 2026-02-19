# Άσκηση: Σύστημα Βιβλιοθήκης — OOP
# Δυσκολία: ⭐⭐⭐⭐⭐
#
# Δημιούργησε ένα σύστημα βιβλιοθήκης με δύο κλάσεις:
#
# 1. Κλάση Book:
#    - __init__(title, author) + self.available = True
#    - borrow() → αλλάζει available σε False (αν είναι διαθέσιμο)
#    - return_book() → αλλάζει available σε True
#    - __str__() → επιστρέφει "<title> - <author> [Διαθ./Δανεισμ.]"
#
# 2. Κλάση Library:
#    - __init__() → self.books = [] (κενή λίστα βιβλίων)
#    - add_book(book) → προσθέτει βιβλίο
#    - find_book(title) → βρίσκει βιβλίο με τίτλο (ή None)
#    - borrow_book(title) → βρίσκει και δανείζει βιβλίο
#    - return_book(title) → βρίσκει και επιστρέφει βιβλίο
#    - available_books() → επιστρέφει λίστα διαθέσιμων βιβλίων
#    - display_all() → εμφανίζει όλα τα βιβλία
#
# Δοκίμασε:
# lib = Library()
# lib.add_book(Book("Python 101", "Κώστας"))
# lib.add_book(Book("Αλγόριθμοι", "Μαρία"))
# lib.borrow_book("Python 101")
# lib.display_all()

# Γράψε τον κώδικά σου εδώ
