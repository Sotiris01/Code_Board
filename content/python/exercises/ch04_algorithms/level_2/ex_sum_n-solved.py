# ΑΣΚΗΣΗ: Άθροισμα Ν αριθμών - ΛΥΣΗ

n = int(input("Πόσους αριθμούς θα δώσεις; "))
athroisma = 0

for i in range(n):
    x = int(input("Δώσε αριθμό: "))
    athroisma = athroisma + x

print("Άθροισμα:", athroisma)
