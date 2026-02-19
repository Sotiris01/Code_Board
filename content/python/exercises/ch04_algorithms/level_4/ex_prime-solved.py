# ΑΣΚΗΣΗ: Πρώτος Αριθμός - ΛΥΣΗ

n = int(input("Δώσε αριθμό (>1): "))

protos = True

for i in range(2, n):
    if n % i == 0:
        protos = False

if protos:
    print("Ο", n, "είναι πρώτος!")
else:
    print("Ο", n, "ΔΕΝ είναι πρώτος.")
