# ΑΣΚΗΣΗ: Ονόματα Μεταβλητών — Σωστό ή Λάθος - ΛΥΣΗ

# x1        → Σ (γράμμα + αριθμός OK)
# 1x        → Λ (ξεκινά με αριθμό!)
# my_var    → Σ (underscore OK)
# my-var    → Λ (η παύλα - είναι τελεστής αφαίρεσης!)
# my var    → Λ (κενό στο όνομα)
# _private  → Σ (underscore στην αρχή OK)
# for       → Λ (δεσμευμένη λέξη!)
# Print     → Σ (Κεφαλαίο P, ΔΕΝ είναι η print)
# PRINT     → Σ (η Python είναι case-sensitive)
# __init__  → Σ (valid, αλλά σπάνια χρήση εκτός OOP)
# αριθμός   → Σ (η Python 3 δέχεται ελληνικά, αλλά αποφεύγεται)
# class     → Λ (δεσμευμένη λέξη!)

# Δοκιμές:
x1 = 1
# 1x = 1         # SyntaxError!
my_var = 1
# my-var = 1     # SyntaxError! (ερμηνεύεται ως my - var)
# my var = 1     # SyntaxError!
_private = 1
# for = 1        # SyntaxError!
Print = 1         # Δουλεύει αλλά μπερδεύει!
PRINT = 1         # Δουλεύει
__init__ = 1      # Δουλεύει
αριθμός = 1       # Δουλεύει στην Python 3
# class = 1      # SyntaxError!

print("Όλα OK!")
