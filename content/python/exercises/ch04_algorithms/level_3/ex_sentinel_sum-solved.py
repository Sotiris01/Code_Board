# ΑΣΚΗΣΗ: Άθροισμα μέχρι 0 (Sentinel) - ΛΥΣΗ

plithos = 0
athroisma = 0

x = int(input("Δώσε αριθμό (0 για τέλος): "))

while x != 0:
    athroisma = athroisma + x
    plithos = plithos + 1
    x = int(input("Δώσε αριθμό (0 για τέλος): "))

print("Πλήθος:", plithos)
print("Άθροισμα:", athroisma)
