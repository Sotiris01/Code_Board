# ΑΣΚΗΣΗ: Μέγιστος Ν αριθμών - ΛΥΣΗ

n = int(input("Πόσους αριθμούς θα δώσεις; "))

megistos = int(input("Δώσε αριθμό: "))

for i in range(n - 1):
    x = int(input("Δώσε αριθμό: "))
    if x > megistos:
        megistos = x

print("Μέγιστος:", megistos)
