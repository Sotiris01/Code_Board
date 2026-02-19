# ΑΣΚΗΣΗ: Ψηφία Αριθμού - ΛΥΣΗ

n = int(input("Δώσε θετικό αριθμό: "))

psifia = 0
athroisma = 0
temp = n

while temp > 0:
    psifio = temp % 10
    athroisma = athroisma + psifio
    psifia = psifia + 1
    temp = temp // 10

print("Ψηφία:", psifia)
print("Άθροισμα ψηφίων:", athroisma)
