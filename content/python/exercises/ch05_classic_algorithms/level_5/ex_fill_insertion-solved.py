# ΑΣΚΗΣΗ: Συμπλήρωση — Insertion Sort - ΛΥΣΗ

# Τα κενά συμπληρωμένα:
# for i in range(1, len(array)):     → ξεκινά από 1
# value = array[i]                   → i
# while j > 0 and array[j-1] > value → 0, value
# array[j] = array[j - 1]           → j
# j = j - 1                          → 1
# array[j] = value                   → j

def insertionSort(array):
    for i in range(1, len(array)):
        value = array[i]
        j = i
        while j > 0 and array[j - 1] > value:
            array[j] = array[j - 1]
            j = j - 1
        array[j] = value

# Δοκιμή
data = [42, 17, 8, 33, 5, 29]
print("Πριν:", data)
insertionSort(data)
print("Μετά:", data)
# → [5, 8, 17, 29, 33, 42]
