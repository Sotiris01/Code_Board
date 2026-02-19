# ΑΣΚΗΣΗ: Έλεγχος Email
#
# 1. Ορίσε συνάρτηση is_valid_email(email)
#    που ελέγχει αν ένα email είναι έγκυρο:
#
#    Κριτήρια:
#    α) Περιέχει ΑΚΡΙΒΩΣ ένα "@"
#    β) Πριν το "@" υπάρχει τουλάχιστον
#       1 χαρακτήρας
#    γ) Μετά το "@" υπάρχει τουλάχιστον
#       1 χαρακτήρας και μία τελεία "."
#
# 2. Δοκίμασε:
#    print(is_valid_email("user@mail.com"))    → True
#    print(is_valid_email("test@gmail.gr"))     → True
#    print(is_valid_email("invalid"))           → False
#    print(is_valid_email("@mail.com"))         → False
#    print(is_valid_email("user@"))             → False
#    print(is_valid_email("a@@b.com"))          → False
#
# ΣΥΜΒΟΥΛΗ: Μέτρα τα "@" με βρόχο,
# μετά βρες τη θέση με αναζήτηση.

# Γράψε τον κώδικά σου εδώ

