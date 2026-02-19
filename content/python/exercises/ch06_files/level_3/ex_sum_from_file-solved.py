# ΑΣΚΗΣΗ: Αριθμοί από Αρχείο → Άθροισμα - ΛΥΣΗ

# 1. Δημιουργία αρχείου αριθμών
f = open("values.txt", "w")
f.write("15\n")
f.write("22\n")
f.write("8\n")
f.write("31\n")
f.write("45\n")
f.write("10\n")
f.close()

# 2. Ανάγνωση + υπολογισμοί
f = open("values.txt", "r")
athroisma = 0
plithos = 0

for line in f:
    ar = int(line.strip())
    athroisma = athroisma + ar
    plithos = plithos + 1

f.close()

# 3. Αποτελέσματα
mesos = athroisma / plithos
print("Πλήθος:", plithos)
print("Άθροισμα:", athroisma)
print("Μέσος Όρος:", mesos)
