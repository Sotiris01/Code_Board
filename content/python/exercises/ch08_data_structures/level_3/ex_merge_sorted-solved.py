# ΑΣΚΗΣΗ: Συγχώνευση Ταξινομημένων Λιστών - ΛΥΣΗ

def merge(A, B):
    # Αντίγραφα για να μη χαλάσουμε τα αρχικά
    a = []
    for x in A:
        a.append(x)
    b = []
    for x in B:
        b.append(x)

    L = []
    while a != [] and b != []:
        if a[0] < b[0]:
            L.append(a.pop(0))
        else:
            L.append(b.pop(0))
    # Πρόσθεσε ό,τι απέμεινε
    for x in a:
        L.append(x)
    for x in b:
        L.append(x)
    return L

# Δοκιμές
A = [1, 3, 5, 7, 9]
B = [2, 4, 6, 8, 10]
print(merge(A, B))

C = [1, 5, 10]
D = [2, 3, 4, 6, 7]
print(merge(C, D))

# Έλεγχος ότι τα αρχικά δεν άλλαξαν
print("A:", A)
print("B:", B)
