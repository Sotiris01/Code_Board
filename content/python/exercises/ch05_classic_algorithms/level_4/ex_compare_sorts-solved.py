# ΑΣΚΗΣΗ: Σύγκριση Bubble Sort vs Insertion Sort - ΛΥΣΗ

def bubbleSortCount(A):
    A = list(A)   # αντίγραφο
    N = len(A)
    comps = 0
    swaps = 0
    for i in range(N - 1):
        for j in range(N - 1, i, -1):
            comps += 1
            if A[j] < A[j - 1]:
                A[j], A[j - 1] = A[j - 1], A[j]
                swaps += 1
    return (comps, swaps)

def insertionSortCount(A):
    A = list(A)   # αντίγραφο
    comps = 0
    moves = 0
    for i in range(1, len(A)):
        value = A[i]
        j = i
        while j > 0:
            comps += 1
            if A[j - 1] > value:
                A[j] = A[j - 1]
                j -= 1
                moves += 1
            else:
                break
        A[j] = value
    return (comps, moves)

# Δοκιμές
data1 = [1, 2, 3, 4, 5]
data2 = [5, 4, 3, 2, 1]
data3 = [3, 1, 4, 1, 5, 9]

for name, data in [("Ταξινομημένη", data1), ("Αντίστροφη", data2), ("Τυχαία", data3)]:
    b_comps, b_swaps = bubbleSortCount(data)
    i_comps, i_moves = insertionSortCount(data)
    print(f"--- {name}: {data} ---")
    print(f"  Bubble:    Συγκρίσεις={b_comps}, Αντιμεταθέσεις={b_swaps}")
    print(f"  Insertion: Συγκρίσεις={i_comps}, Μετακινήσεις={i_moves}")
    print()

# ΣΧΟΛΙΟ:
# - Ταξινομημένη: Insertion κάνει λιγότερες (N-1 συγκρίσεις, 0 μετακινήσεις)
# - Αντίστροφη: Παρόμοια απόδοση (χειρότερη περίπτωση)
# - Γενικά η Insertion Sort είναι πιο αποδοτική
#   σε σχεδόν ταξινομημένα δεδομένα.
