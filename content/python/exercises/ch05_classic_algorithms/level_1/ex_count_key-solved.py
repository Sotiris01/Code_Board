# ΑΣΚΗΣΗ: Μέτρηση Εμφανίσεων - ΛΥΣΗ

grades = [8, 5, 10, 8, 3, 8, 10, 5, 8, 7]

key = int(input("Δώσε βαθμό: "))

metritis = 0
for i in range(len(grades)):
    if grades[i] == key:
        metritis = metritis + 1

print("Ο βαθμός", key, "εμφανίζεται", metritis, "φορές.")
