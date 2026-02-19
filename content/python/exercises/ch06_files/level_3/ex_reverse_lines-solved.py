# ΑΣΚΗΣΗ: Αντιστροφή Γραμμών - ΛΥΣΗ

# 1. Δημιουργία αρχείου
f = open("original.txt", "w")
f.write("Γραμμή A\n")
f.write("Γραμμή B\n")
f.write("Γραμμή C\n")
f.write("Γραμμή D\n")
f.close()

# 2. Ανάγνωση σε λίστα
f = open("original.txt", "r")
grammes = []
for line in f:
    grammes.append(line)
f.close()

# 3. Εγγραφή σε αντίστροφη σειρά
f = open("reversed.txt", "w")
for i in range(len(grammes) - 1, -1, -1):
    f.write(grammes[i])
f.close()

# Επιβεβαίωση
print("Αρχικό:")
f = open("original.txt", "r")
print(f.read())
f.close()

print("Αντεστραμμένο:")
f = open("reversed.txt", "r")
print(f.read())
f.close()
