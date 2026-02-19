# ΑΣΚΗΣΗ: Σύστημα Βαθμολογίας - ΛΥΣΗ

def read_grades():
    grades = []
    while True:
        b = int(input("Βαθμός (-1 τέλος): "))
        if b == -1:
            break
        if b >= 0 and b <= 20:
            grades.append(b)
        else:
            print("Λάθος! 0-20 μόνο.")
    return grades

def average(L):
    total = 0
    for x in L:
        total = total + x
    return total / len(L)

def find_max(L):
    m = L[0]
    for x in L:
        if x > m:
            m = x
    return m

def find_min(L):
    m = L[0]
    for x in L:
        if x < m:
            m = x
    return m

def count_pass(L):
    c = 0
    for x in L:
        if x >= 10:
            c = c + 1
    return c

def display_report(L):
    print("=== ΑΝΑΦΟΡΑ ΒΑΘΜΟΛΟΓΙΑΣ ===")
    print("Πλήθος μαθητών:", len(L))
    print("Μέσος Όρος:", round(average(L), 1))
    print("Μέγιστος:", find_max(L))
    print("Ελάχιστος:", find_min(L))
    print("Επιτυχία:", count_pass(L), "/", len(L))
    print("Αποτυχία:", len(L) - count_pass(L), "/", len(L))

# Κύριο πρόγραμμα
grades = read_grades()
if len(grades) > 0:
    display_report(grades)
else:
    print("Δεν δόθηκαν βαθμοί.")
