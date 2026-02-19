# ΑΣΚΗΣΗ: Έλεγχος Παρενθέσεων (Stack)
#
# Χρησιμοποίησε ΣΤΟΙΒΑ για να ελέγξεις
# αν οι παρενθέσεις σε μία έκφραση
# είναι ΙΣΟΡΡΟΠΗΜΕΝΕΣ.
#
# Αλγόριθμος:
# - Για κάθε χαρακτήρα:
#   Αν "(", "[", "{" → push στη στοίβα
#   Αν ")", "]", "}" → pop και σύγκρινε
#     Αν δεν ταιριάζει → return False
# - Στο τέλος η στοίβα πρέπει να είναι ΚΕΝΗ
#
# 1. Ορίσε check_brackets(expression) → True/False
#
# 2. Δοκίμασε:
#    print(check_brackets("(a + b)"))        → True
#    print(check_brackets("((a + b) * c)"))  → True
#    print(check_brackets("(a + b"))          → False
#    print(check_brackets("a + b)"))          → False
#    print(check_brackets("{[()]}"))          → True
#    print(check_brackets("{[(])}"))          → False

# Γράψε τον κώδικά σου εδώ

