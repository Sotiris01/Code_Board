# ΑΣΚΗΣΗ: Bubble Sort — Φθίνουσα - ΛΥΣΗ

def bubbleSortDesc(A):
    N = len(A)
    for i in range(N - 1):
        for j in range(N - 1, i, -1):
            if A[j] > A[j - 1]:         # ΜΟΝΟ αυτή η αλλαγή: > αντί <
                A[j], A[j - 1] = A[j - 1], A[j]

# Κύριο πρόγραμμα
data = [12, 45, 3, 67, 28, 9]
print("Πριν:", data)
bubbleSortDesc(data)
print("Μετά:", data)
# → [67, 45, 28, 12, 9, 3]

# ΕΞΗΓΗΣΗ:
# Στην αύξουσα: if A[j] < A[j-1] → στέλνει τα μικρά αριστερά
# Στη φθίνουσα: if A[j] > A[j-1] → στέλνει τα μεγάλα αριστερά
