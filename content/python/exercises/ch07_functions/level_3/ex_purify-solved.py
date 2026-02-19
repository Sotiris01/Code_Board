# ΑΣΚΗΣΗ: Φιλτράρισμα Ζυγών (purify) - ΛΥΣΗ

def purify(L):
    result = []
    for x in L:
        if x % 2 == 0:
            result.append(x)
    return result

print(purify([1, 2, 3]))
print(purify([1, 2, 3, 4]))
print(purify([1, 3, 5]))
print(purify([2, 4, 6]))

# Έλεγχος ότι η αρχική δεν αλλάζει
original = [1, 2, 3, 4, 5]
filtered = purify(original)
print("Αρχική:", original)
print("Φιλτραρισμένη:", filtered)
