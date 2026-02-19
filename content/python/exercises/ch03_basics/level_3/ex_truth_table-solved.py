# ΑΣΚΗΣΗ: Πίνακας Αληθείας - ΛΥΣΗ

print("P     | Q     | P and Q | P or Q | not P")
print("-" * 50)

P = True
Q = True
print(P, "  |", Q, "  |", P and Q, "   |", P or Q, "  |", not P)

P = True
Q = False
print(P, "  |", Q, " |", P and Q, "  |", P or Q, "  |", not P)

P = False
Q = True
print(P, " |", Q, "  |", P and Q, "  |", P or Q, "  |", not P)

P = False
Q = False
print(P, " |", Q, " |", P and Q, "  |", P or Q, " |", not P)
