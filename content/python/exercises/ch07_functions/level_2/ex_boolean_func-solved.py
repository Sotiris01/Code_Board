# ΑΣΚΗΣΗ: Συνάρτηση is_even & is_positive - ΛΥΣΗ

def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False

def is_positive(n):
    if n > 0:
        return True
    else:
        return False

numbers = [4, -3, 7, 0, -2, 8, 1, -5]

print("Ζυγοί:")
for n in numbers:
    if is_even(n):
        print(" ", n)

print("Θετικοί:")
for n in numbers:
    if is_positive(n):
        print(" ", n)

print("Ζυγοί ΚΑΙ Θετικοί:")
for n in numbers:
    if is_even(n) and is_positive(n):
        print(" ", n)
