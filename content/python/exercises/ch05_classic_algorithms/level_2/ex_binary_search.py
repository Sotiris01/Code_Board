# ΑΣΚΗΣΗ: Δυαδική Αναζήτηση — True/False
#
# Υλοποίησε τη συνάρτηση binarySearch(array, key)
# που δέχεται ΤΑΞΙΝΟΜΗΜΕΝΗ λίστα και κλειδί.
#
# Επιστρέφει True αν βρεθεί, False αν όχι.
#
# ΑΛΓΟΡΙΘΜΟΣ:
# 1. first = 0, last = len(array) - 1
# 2. Όσο first <= last ΚΑΙ δεν βρέθηκε:
#    a. mid = (first + last) // 2
#    b. Αν array[mid] == key → βρέθηκε!
#    c. Αν array[mid] < key → first = mid + 1
#    d. Αλλιώς → last = mid - 1
# 3. Επέστρεψε True/False
#
# Δοκίμασε με:
#   data = [2, 5, 8, 12, 16, 23, 38, 56]
#   binarySearch(data, 23) → True
#   binarySearch(data, 10) → False

# Γράψε τον κώδικά σου εδώ

