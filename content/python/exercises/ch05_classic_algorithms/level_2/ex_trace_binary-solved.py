# ΑΣΚΗΣΗ: Ιχνηλάτηση Δυαδικής Αναζήτησης - ΛΥΣΗ

# array = [2, 5, 8, 12, 16, 23, 38, 56]
#           0   1   2   3    4   5   6   7

# === Αναζήτηση key = 38 ===
# | Βήμα | first | last | mid | array[mid] | Ενέργεια               |
# |------|-------|------|-----|------------|------------------------|
# |  1   |   0   |  7   |  3  |    12      | 12 < 38 → first = 4   |
# |  2   |   4   |  7   |  5  |    23      | 23 < 38 → first = 6   |
# |  3   |   6   |  7   |  6  |    38      | 38 == 38 → Βρέθηκε!   |
#
# Χρειάστηκαν 3 βήματα.
# Η γραμμική θα χρειαζόταν 7 βήματα (θέση 6).

# === Αναζήτηση key = 10 (δεν υπάρχει) ===
# | Βήμα | first | last | mid | array[mid] | Ενέργεια               |
# |------|-------|------|-----|------------|------------------------|
# |  1   |   0   |  7   |  3  |    12      | 12 > 10 → last = 2    |
# |  2   |   0   |  2   |  1  |     5      | 5 < 10  → first = 2   |
# |  3   |   2   |  2   |  2  |     8      | 8 < 10  → first = 3   |
# |  4   |   -   |  -   |  -  |     -      | first(3) > last(2) STOP|
#
# Ξέρουμε ότι δεν βρέθηκε γιατί first > last
# (η περιοχή αναζήτησης "άδειασε").

# Επαλήθευση με κώδικα:
array = [2, 5, 8, 12, 16, 23, 38, 56]

def binarySearch(array, key):
    first = 0
    last = len(array) - 1
    vima = 0
    found = False
    while first <= last and not found:
        mid = (first + last) // 2
        vima += 1
        print(f"Βήμα {vima}: first={first}, last={last}, mid={mid}, array[mid]={array[mid]}")
        if array[mid] == key:
            found = True
        elif array[mid] < key:
            first = mid + 1
        else:
            last = mid - 1
    return found

print("=== Αναζήτηση 38 ===")
print("Βρέθηκε:", binarySearch(array, 38))
print()
print("=== Αναζήτηση 10 ===")
print("Βρέθηκε:", binarySearch(array, 10))
