# ΑΣΚΗΣΗ: Ένωση Δύο Αρχείων - ΛΥΣΗ

# 1. Δημιουργία αρχείων
f = open("part1.txt", "w")
f.write("Μέρος Πρώτο\n")
f.write("Γραμμή 1Α\n")
f.write("Γραμμή 1Β\n")
f.close()

f = open("part2.txt", "w")
f.write("Μέρος Δεύτερο\n")
f.write("Γραμμή 2Α\n")
f.write("Γραμμή 2Β\n")
f.close()

# 2. Ένωση
outputFile = open("merged.txt", "w")

f1 = open("part1.txt", "r")
for line in f1:
    outputFile.write(line)
f1.close()

f2 = open("part2.txt", "r")
for line in f2:
    outputFile.write(line)
f2.close()

outputFile.close()

# 3. Εμφάνιση
f = open("merged.txt", "r")
print(f.read())
f.close()
