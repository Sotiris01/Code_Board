# ΑΣΚΗΣΗ: Συνάρτηση Αντιγραφής Αρχείου - ΛΥΣΗ

def copy(source, dest):
    inputFile = open(source, "r")
    outputFile = open(dest, "w")
    count = 0
    for line in inputFile:
        outputFile.write(line)
        count = count + 1
    inputFile.close()
    outputFile.close()
    return count

# Δημιουργία αρχείου
f = open("source.txt", "w")
f.write("Πρώτη γραμμή\n")
f.write("Δεύτερη γραμμή\n")
f.write("Τρίτη γραμμή\n")
f.write("Τέταρτη γραμμή\n")
f.write("Πέμπτη γραμμή\n")
f.close()

# Αντιγραφή
grammes = copy("source.txt", "backup.txt")
print("Αντιγράφηκαν", grammes, "γραμμές")

# Επιβεβαίωση
f = open("backup.txt", "r")
print("\nbackup.txt:")
print(f.read())
f.close()
