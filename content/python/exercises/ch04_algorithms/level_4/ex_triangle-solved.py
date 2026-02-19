# ΑΣΚΗΣΗ: Τρίγωνο Αστερίσκων - ΛΥΣΗ

n = int(input("Δώσε Ν: "))

for i in range(1, n + 1):
    for j in range(i):
        print("*", end="")
    print()
