# ΑΣΚΗΣΗ: Αρίθμηση Γραμμών Αρχείου - ΛΥΣΗ

# Δημιουργία αρχείου ποιήματος
f = open("poem.txt", "w")
f.write("Ήταν μια φορά\n")
f.write("κι έναν καιρό\n")
f.write("ένα παιδάκι\n")
f.write("πολύ μικρό\n")
f.close()

# Ανάγνωση + αρίθμηση + εγγραφή
inputFile = open("poem.txt", "r")
outputFile = open("poem_numbered.txt", "w")

linecounter = 1
for line in inputFile:
    outputFile.write(str(linecounter) + ". " + line)
    linecounter += 1

inputFile.close()
outputFile.close()

# Επιβεβαίωση
f = open("poem_numbered.txt", "r")
print(f.read())
f.close()
