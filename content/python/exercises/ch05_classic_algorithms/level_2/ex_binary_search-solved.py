# ΑΣΚΗΣΗ: Δυαδική Αναζήτηση — True/False - ΛΥΣΗ

def binarySearch(array, key):
    first = 0
    last = len(array) - 1
    found = False
    while first <= last and not found:
        mid = (first + last) // 2
        if array[mid] == key:
            found = True
        elif array[mid] < key:
            first = mid + 1
        else:
            last = mid - 1
    return found

# Κύριο πρόγραμμα
data = [2, 5, 8, 12, 16, 23, 38, 56]

print("Αναζήτηση 23:", binarySearch(data, 23))   # True
print("Αναζήτηση 10:", binarySearch(data, 10))   # False
