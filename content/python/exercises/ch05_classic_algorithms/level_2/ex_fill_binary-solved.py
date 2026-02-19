# ΑΣΚΗΣΗ: Συμπλήρωση Κενών — Binary Search - ΛΥΣΗ

# Τα κενά συμπληρωμένα:
# first = 0
# while first <= last        (<=)
# mid = (first + last) // 2  (//)
# if array[mid] == key       (key)
# elif array[mid] < key      (mid)
# first = mid + 1            (+)
# last = mid - 1             (-)
# return found               (found)

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

# Δοκιμή
data = [3, 7, 11, 15, 20, 28, 35]
print("Αναζήτηση 15:", binarySearch(data, 15))   # True
print("Αναζήτηση 22:", binarySearch(data, 22))   # False
