# ΑΣΚΗΣΗ: Χριστουγεννιάτικο Δέντρο - ΛΥΣΗ

n = int(input("Δώσε ύψος δέντρου: "))

for i in range(1, n + 1):
    kena = " " * (n - i)
    asteria = "*" * (2 * i - 1)
    print(kena + asteria)

# Κορμός
kormos = " " * (n - 1) + "|"
print(kormos)
