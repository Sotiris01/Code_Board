# ΑΣΚΗΣΗ: Συνάρτηση ΜΚΔ (GCD) - ΛΥΣΗ

def mkd(a, b):
    while b != 0:
        temp = b
        b = a % b
        a = temp
    return a

# Κύριο πρόγραμμα
a = int(input("Δώσε πρώτο αριθμό: "))
b = int(input("Δώσε δεύτερο αριθμό: "))

apot = mkd(a, b)
print("ΜΚΔ(" + str(a) + ", " + str(b) + ") =", apot)
