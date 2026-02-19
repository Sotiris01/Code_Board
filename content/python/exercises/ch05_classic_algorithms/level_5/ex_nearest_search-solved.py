# ΑΣΚΗΣΗ: Αναζήτηση Κοντινότερου - ΛΥΣΗ

def nearestSearch(array, target):
    first = 0
    last = len(array) - 1

    # Αν ο στόχος είναι εκτός εύρους
    if target <= array[first]:
        return array[first]
    if target >= array[last]:
        return array[last]

    # Δυαδική αναζήτηση
    while first <= last:
        mid = (first + last) // 2
        if array[mid] == target:
            return array[mid]
        elif array[mid] < target:
            first = mid + 1
        else:
            last = mid - 1

    # Μετά το while, first > last
    # Σύγκρινε τα δύο γειτονικά
    if first < len(array):
        diff_first = abs(array[first] - target)
        diff_last = abs(array[last] - target)
        if diff_first < diff_last:
            return array[first]
        else:
            return array[last]
    else:
        return array[last]

# Κύριο πρόγραμμα
temps = [12.5, 15.0, 18.3, 21.7, 25.0, 28.4, 32.1]

target = float(input("Δώσε θερμοκρασία-στόχο: "))
result = nearestSearch(temps, target)
diafora = abs(result - target)

print("Κοντινότερη:", result, "(διαφορά", str(round(diafora, 1)) + ")")
