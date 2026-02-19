# ΑΣΚΗΣΗ: Μέτρηση Εμφανίσεων σε Λίστα - ΛΥΣΗ

def count(sequence, item):
    c = 0
    for x in sequence:
        if x == item:
            c = c + 1
    return c

# Δοκιμή με λίστα
L = [1, 3, 5, 3, 7, 3, 9, 1, 3]
print(count(L, 3))
print(count(L, 1))
print(count(L, 10))

# Δοκιμή με string
print(count("abracadabra", "a"))
