# ΑΣΚΗΣΗ: Ορθογώνιο με Αστερίσκους - ΛΥΣΗ

platos = int(input("Δώσε πλάτος: "))
ypsos = int(input("Δώσε ύψος: "))

for i in range(ypsos):
    for j in range(platos):
        print("*", end="")
    print()
