# ΑΣΚΗΣΗ: Εγγραφή Αριθμών - ΛΥΣΗ

f = open("numbers.txt", "w")

for i in range(1, 11):
    f.write(str(i) + "\n")

f.close()

print("Γράφτηκαν οι αριθμοί 1-10 στο numbers.txt")
