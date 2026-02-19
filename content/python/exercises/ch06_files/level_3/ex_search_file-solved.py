# ΑΣΚΗΣΗ: Αναζήτηση Λέξης σε Αρχείο - ΛΥΣΗ

# 1. Δημιουργία αρχείου
f = open("story.txt", "w")
f.write("Ο Νίκος πήγε στο σχολείο.\n")
f.write("Στο σχολείο είχε μάθημα Python.\n")
f.write("Η Python είναι εύκολη γλώσσα.\n")
f.write("Ο Νίκος αγαπά τον προγραμματισμό.\n")
f.close()

# 2. Εισαγωγή λέξης
key = input("Αναζήτηση: ")

# 3-4. Αναζήτηση γραμμή-γραμμή
f = open("story.txt", "r")
arithmos = 0
vrethike = 0

for line in f:
    arithmos = arithmos + 1
    if key in line:
        print("Γραμμή " + str(arithmos) + ": " + line, end="")
        vrethike = vrethike + 1

f.close()

print("\nΒρέθηκε σε", vrethike, "γραμμές.")
