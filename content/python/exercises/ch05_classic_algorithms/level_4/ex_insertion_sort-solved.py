# ΑΣΚΗΣΗ: Insertion Sort — Βασική Υλοποίηση - ΛΥΣΗ

def insertionSort(array):
    for i in range(1, len(array)):
        value = array[i]
        j = i
        while j > 0 and array[j - 1] > value:
            array[j] = array[j - 1]
            j = j - 1
        array[j] = value

# Κύριο πρόγραμμα
data = [7, 2, 9, 4, 1, 5]
print("Πριν:", data)
insertionSort(data)
print("Μετά:", data)
# → [1, 2, 4, 5, 7, 9]
