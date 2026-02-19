# ΑΣΚΗΣΗ: Βελτιωμένη Bubble Sort (σημαία) - ΛΥΣΗ

def bubbleSortImproved(A):
    N = len(A)
    isSorted = False
    i = 0
    perasmata = 0
    while i < N - 1 and not isSorted:
        isSorted = True
        for j in range(N - 1, i, -1):
            if A[j] < A[j - 1]:
                A[j], A[j - 1] = A[j - 1], A[j]
                isSorted = False
        i += 1
        perasmata += 1
    return perasmata

# Δοκιμή 1: Ήδη ταξινομημένη
data1 = [1, 2, 3, 4, 5]
p1 = bubbleSortImproved(data1)
print("Ταξινομημένη:", data1, "- Περάσματα:", p1)
# → Περάσματα: 1 (σταματά αμέσως!)

# Δοκιμή 2: Αντίστροφη
data2 = [5, 4, 3, 2, 1]
p2 = bubbleSortImproved(data2)
print("Αντίστροφη:", data2, "- Περάσματα:", p2)
# → Περάσματα: 4

# ΠΛΕΟΝΕΚΤΗΜΑ: Στην ήδη ταξινομημένη, η βελτιωμένη
# κάνει ΜΟΝΟ 1 πέρασμα αντί 4!
