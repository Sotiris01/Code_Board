# ΑΣΚΗΣΗ: Εγγραφή Εισόδου Χρήστη - ΛΥΣΗ

f = open("notes.txt", "w")

for i in range(1, 4):
    frasi = input("Δώσε φράση " + str(i) + ": ")
    f.write(frasi + "\n")

f.close()

# Επιβεβαίωση
print("\nΠεριεχόμενο αρχείου:")
f = open("notes.txt", "r")
print(f.read())
f.close()
