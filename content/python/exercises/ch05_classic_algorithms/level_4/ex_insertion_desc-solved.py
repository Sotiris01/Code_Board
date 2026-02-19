# ΑΣΚΗΣΗ: Insertion Sort — Φθίνουσα - ΛΥΣΗ

def insertionSortDesc(array):
    for i in range(1, len(array)):
        value = array[i]
        j = i
        while j > 0 and array[j - 1] < value:   # < αντί >
            array[j] = array[j - 1]
            j = j - 1
        array[j] = value

# Κύριο πρόγραμμα
data = [3, 8, 1, 9, 4, 6]
print("Πριν:", data)
insertionSortDesc(data)
print("Μετά:", data)
# → [9, 8, 6, 4, 3, 1]

# ΕΞΗΓΗΣΗ:
# Αλλάζουμε ΜΟΝΟ τη σύγκριση:
# array[j-1] < value (αντί >)
# Τώρα μετακινεί δεξιά τα ΜΙΚΡΟΤΕΡΑ
# αντί τα μεγαλύτερα.
