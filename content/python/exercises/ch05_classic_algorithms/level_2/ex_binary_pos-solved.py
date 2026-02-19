# ΑΣΚΗΣΗ: Δυαδική Αναζήτηση — Επιστροφή Θέσης - ΛΥΣΗ

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
data = [2, 5, 8, 12, 16, 23, 38, 56]

print("Θέση του 16:", binarySearchPos(data, 16))   # 4
print("Θέση του 99:", binarySearchPos(data, 99))   # -1
