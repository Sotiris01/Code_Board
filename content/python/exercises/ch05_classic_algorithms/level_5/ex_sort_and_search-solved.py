# ΑΣΚΗΣΗ: Ταξινόμηση + Δυαδική Αναζήτηση - ΛΥΣΗ

def bubbleSort(A):
    N = len(A)
    for i in range(N - 1):
        for j in range(N - 1, i, -1):
            if A[j] < A[j - 1]:
                A[j], A[j - 1] = A[j - 1], A[j]

def binarySearchPos(array, key):
    first = 0
    last = len(array) - 1
    pos = -1
    while first <= last and pos == -1:
        mid = (first + last) // 2
        if array[mid] == key:
            pos = mid
        elif array[mid] < key:
            first = mid + 1
        else:
            last = mid - 1
    return pos

# Κύριο πρόγραμμα
data = [45, 12, 78, 3, 56, 23, 89, 34, 67, 9]
print("Αρχικά:", data)

# 1. Ταξινόμηση
bubbleSort(data)
print("Ταξινομημένη:", data)

# 2. Αναζήτηση
key = int(input("Δώσε αριθμό για αναζήτηση: "))
thesi = binarySearchPos(data, key)

if thesi != -1:
    print("Βρέθηκε στη θέση", thesi)
else:
    print("Δεν βρέθηκε")
