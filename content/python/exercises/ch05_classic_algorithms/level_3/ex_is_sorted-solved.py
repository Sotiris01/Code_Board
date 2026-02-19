# ΑΣΚΗΣΗ: Έλεγχος αν λίστα ταξινομημένη - ΛΥΣΗ

def is_sorted(L):
    for i in range(len(L) - 1):
        if L[i] > L[i + 1]:
            return False
    return True

# Δοκιμές
print(is_sorted([1, 3, 5, 7, 9]))    # True
print(is_sorted([1, 3, 2, 7, 9]))    # False
print(is_sorted([5]))                 # True
print(is_sorted([]))                  # True

# ΕΞΗΓΗΣΗ:
# Ελέγχουμε κάθε γειτονικό ζεύγος.
# Μόλις βρούμε L[i] > L[i+1] → ΔΕΝ είναι ταξινομημένη.
# Αν δεν βρεθεί κανένα τέτοιο ζεύγος → είναι ταξινομημένη.
