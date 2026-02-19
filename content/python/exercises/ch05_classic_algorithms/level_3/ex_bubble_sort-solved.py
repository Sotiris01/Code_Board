# ΑΣΚΗΣΗ: Bubble Sort — Βασική Υλοποίηση - ΛΥΣΗ

def bubbleSort(A):
    N = len(A)
    for i in range(N - 1):
        for j in range(N - 1, i, -1):
            if A[j] < A[j - 1]:
                A[j], A[j - 1] = A[j - 1], A[j]

# Κύριο πρόγραμμα
data = [64, 34, 25, 12, 22, 11, 90]
print("Πριν:", data)
bubbleSort(data)
print("Μετά:", data)
# → [11, 12, 22, 25, 34, 64, 90]
