# ΑΣΚΗΣΗ: Βαθμολογίες Μαθητών (ΘΕΜΑ Δ) - ΛΥΣΗ

def insertionSortDesc(array):
    for i in range(1, len(array)):
        value = array[i]
        j = i
        while j > 0 and array[j - 1] < value:
            array[j] = array[j - 1]
            j = j - 1
        array[j] = value

# Κύριο πρόγραμμα
grades = [15, 8, 19, 12, 6, 17, 10, 14, 3, 20]
print("Αρχικά:", grades)

# 1. Ταξινόμηση φθίνουσα
insertionSortDesc(grades)
print("Ταξινόμηση:", grades)

# 2-3. Μέγιστος & Ελάχιστος (μετά τη φθίνουσα ταξινόμηση)
print("Μέγιστος:", grades[0])
print("Ελάχιστος:", grades[len(grades) - 1])

# 4. Μέσος Όρος
athroisma = 0
for i in range(len(grades)):
    athroisma = athroisma + grades[i]
mesos = athroisma / len(grades)
print("Μέσος Όρος:", mesos)

# 5. Επιτυχίες (>= 10)
epitixies = 0
for i in range(len(grades)):
    if grades[i] >= 10:
        epitixies = epitixies + 1
print("Επιτυχίες:", epitixies)
