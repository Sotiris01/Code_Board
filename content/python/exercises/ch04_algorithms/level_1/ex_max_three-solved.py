# ΑΣΚΗΣΗ: Μεγαλύτερος από 3 - ΛΥΣΗ

a = int(input("Δώσε a: "))
b = int(input("Δώσε b: "))
c = int(input("Δώσε c: "))

if a >= b and a >= c:
    megistos = a
elif b >= a and b >= c:
    megistos = b
else:
    megistos = c

print("Μεγαλύτερος:", megistos)
