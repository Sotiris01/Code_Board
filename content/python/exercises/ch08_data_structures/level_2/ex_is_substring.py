# ΑΣΚΗΣΗ: isSubstring — Αναζήτηση σε String
#
# 1. Ορίσε συνάρτηση isSubstring(text, sub)
#    που ελέγχει αν το sub υπάρχει
#    μέσα στο text
#    Επιστρέφει True/False
#
#    Αλγόριθμος:
#    - Για κάθε θέση i (0 έως len(text)-len(sub)):
#      Πάρε τμήμα: text[i:i+len(sub)]
#      Αν ίσο με sub → return True
#    - Αν δεν βρέθηκε → return False
#
# 2. Δοκίμασε:
#    print(isSubstring("Hello World", "World"))  → True
#    print(isSubstring("Hello World", "world"))  → False
#    print(isSubstring("abcdef", "cde"))         → True
#    print(isSubstring("abc", "abcd"))           → False
#
# ΣΗΜΑΝΤΙΚΟ: ΜΗ χρησιμοποιήσεις
# τον τελεστή in — φτιάξε τη δική σου!

# Γράψε τον κώδικά σου εδώ

