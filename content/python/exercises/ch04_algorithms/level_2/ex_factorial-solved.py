# ΑΣΚΗΣΗ: Παραγοντικό (Ν!) - ΛΥΣΗ

n = int(input("Δώσε Ν: "))

fact = 1
for i in range(1, n + 1):
    fact = fact * i

print(str(n) + "! =", fact)
