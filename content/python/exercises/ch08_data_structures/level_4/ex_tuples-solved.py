# ΑΣΚΗΣΗ: Πλειάδες (Tuples) - ΛΥΣΗ

# 1. Δημιουργία tuples
coords = (10, 20)
colors = ("red", "green", "blue")
print("coords:", coords)
print("colors:", colors)

# 2. Tuple unpacking
x, y = coords
print("x:", x, "y:", y)

# 3. Swap
a = 5
b = 10
print("Πριν: a =", a, "b =", b)
a, b = b, a
print("Μετά: a =", a, "b =", b)

# 4. Συνάρτηση → tuple
def min_max(L):
    lo = L[0]
    hi = L[0]
    for x in L:
        if x < lo:
            lo = x
        if x > hi:
            hi = x
    return (lo, hi)

lo, hi = min_max([4, 8, 2, 9, 1])
print("Min:", lo, "Max:", hi)

# 5. Αλλαγή tuple → ΣΦΑΛΜΑ!
# t = (1, 2, 3)
# t[0] = 10
# → TypeError: 'tuple' object does not support item assignment
# Τα tuples είναι ΑΜΕΤΑΒΛΗΤΑ!
