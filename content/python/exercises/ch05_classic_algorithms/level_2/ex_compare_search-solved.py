# ΑΣΚΗΣΗ: Σύγκριση Γραμμικής vs Δυαδικής - ΛΥΣΗ

def linearSearch(array, key):
    sygkriseis = 0
    for i in range(len(array)):
        sygkriseis = sygkriseis + 1
        if array[i] == key:
            return (True, sygkriseis)
    return (False, sygkriseis)

def binarySearch(array, key):
    first = 0
    last = len(array) - 1
    sygkriseis = 0
    found = False
    while first <= last and not found:
        mid = (first + last) // 2
        sygkriseis = sygkriseis + 1
        if array[mid] == key:
            found = True
        elif array[mid] < key:
            first = mid + 1
        else:
            last = mid - 1
    return (found, sygkriseis)

# Κύριο πρόγραμμα
data = [3, 7, 12, 15, 18, 22, 25, 31, 35, 40,
        44, 48, 53, 57, 62, 68, 71, 79, 85, 93]

key = 79

result_lin = linearSearch(data, key)
result_bin = binarySearch(data, key)

print("Γραμμική: Βρέθηκε =", result_lin[0], ", Συγκρίσεις =", result_lin[1])
print("Δυαδική:  Βρέθηκε =", result_bin[0], ", Συγκρίσεις =", result_bin[1])

# Αποτέλεσμα:
# Γραμμική: Βρέθηκε = True , Συγκρίσεις = 18
# Δυαδική:  Βρέθηκε = True , Συγκρίσεις = 4
# Η δυαδική χρειάστηκε πολύ λιγότερες!
