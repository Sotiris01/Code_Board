# ΑΣΚΗΣΗ: Συνδυασμός Λιστών & Συναρτήσεων - ΛΥΣΗ

def separate(L):
    positives = []
    negatives = []
    for x in L:
        if x > 0:
            positives.append(x)
        elif x < 0:
            negatives.append(x)
    return positives, negatives

def merge(A, B):
    # Αντίγραφα για να μη χαλάσουμε τα αρχικά
    a = []
    for x in A:
        a.append(x)
    b = []
    for x in B:
        b.append(x)

    result = []
    while len(a) > 0 and len(b) > 0:
        if a[0] < b[0]:
            result.append(a.pop(0))
        else:
            result.append(b.pop(0))
    # Πρόσθεσε ό,τι απέμεινε
    for x in a:
        result.append(x)
    for x in b:
        result.append(x)
    return result

def remove_duplicates(L):
    result = []
    for x in L:
        found = False
        for y in result:
            if x == y:
                found = True
        if not found:
            result.append(x)
    return result

# Δοκιμές
L = [3, -1, 4, -5, 0, 2, -3, 7]
pos, neg = separate(L)
print("Θετικοί:", pos)
print("Αρνητικοί:", neg)

A = [1, 3, 5, 7]
B = [2, 4, 6, 8]
print("Merge:", merge(A, B))

D = [1, 3, 3, 5, 5, 5, 7]
print("Χωρίς διπλά:", remove_duplicates(D))
