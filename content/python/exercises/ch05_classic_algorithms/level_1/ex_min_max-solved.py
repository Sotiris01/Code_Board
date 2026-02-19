# ΑΣΚΗΣΗ: Εύρεση Μέγιστου & Ελάχιστου σε Λίστα - ΛΥΣΗ

data = [23, 7, 45, 12, 89, 34, 2, 67]

megistos = data[0]
elaxistos = data[0]
thesi_meg = 0
thesi_elax = 0

for i in range(1, len(data)):
    if data[i] > megistos:
        megistos = data[i]
        thesi_meg = i
    if data[i] < elaxistos:
        elaxistos = data[i]
        thesi_elax = i

print("Μέγιστος:", megistos, "(θέση", str(thesi_meg) + ")")
print("Ελάχιστος:", elaxistos, "(θέση", str(thesi_elax) + ")")
