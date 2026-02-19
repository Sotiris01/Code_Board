# ΑΣΚΗΣΗ: Ταξινόμηση Βαθμών σε Αρχείο - ΛΥΣΗ

# 1. Δημιουργία αρχείου
f = open("students.txt", "w")
f.write("Νίκος,15\n")
f.write("Μαρία,19\n")
f.write("Γιώργος,8\n")
f.write("Ελένη,17\n")
f.write("Κώστας,12\n")
f.write("Αθηνά,20\n")
f.write("Δημήτρης,6\n")
f.write("Σοφία,14\n")
f.close()

# 2. Ανάγνωση σε λίστες
f = open("students.txt", "r")
onomata = []
bathmoi = []
for line in f:
    parts = line.strip().split(",")
    onomata.append(parts[0])
    bathmoi.append(int(parts[1]))
f.close()

# 3. Bubble Sort φθίνουσα
n = len(bathmoi)
for i in range(n - 1):
    for j in range(n - 1 - i):
        if bathmoi[j] < bathmoi[j + 1]:
            # Αντιμετάθεση βαθμών
            temp = bathmoi[j]
            bathmoi[j] = bathmoi[j + 1]
            bathmoi[j + 1] = temp
            # Αντιμετάθεση ονομάτων
            temp = onomata[j]
            onomata[j] = onomata[j + 1]
            onomata[j + 1] = temp

# 4. Εγγραφή ταξινομημένων
out = open("sorted_students.txt", "w")
for i in range(n):
    out.write(onomata[i] + "," + str(bathmoi[i]) + "\n")
out.close()

# 5. Εμφάνιση
f = open("sorted_students.txt", "r")
print("=== Ταξινομημένα (φθίνουσα) ===")
for line in f:
    print(line, end="")
f.close()
