# ΑΣΚΗΣΗ: Συνάρτηση Ταξινόμησης - ΛΥΣΗ

def my_sort(L):
    # Αντιγραφή
    result = []
    for x in L:
        result.append(x)

    # Bubble Sort
    n = len(result)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if result[j] > result[j + 1]:
                temp = result[j]
                result[j] = result[j + 1]
                result[j + 1] = temp
    return result

def my_reverse(L):
    result = []
    for i in range(len(L) - 1, -1, -1):
        result.append(L[i])
    return result

# Δοκιμές
L = [5, 2, 8, 1, 9, 3]
print("Αρχική:", L)
print("Ταξιν.:", my_sort(L))
print("Αντίστ.:", my_reverse(L))
print("Αρχική:", L)    # ΔΕΝ άλλαξε!
