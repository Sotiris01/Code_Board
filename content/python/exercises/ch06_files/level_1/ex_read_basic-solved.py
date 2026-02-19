# ΑΣΚΗΣΗ: Ανάγνωση Αρχείου - ΛΥΣΗ

# Πρώτα δημιουργούμε το αρχείο (αν δεν υπάρχει)
f = open("hello.txt", "w")
f.write("Γεια σου Κόσμε!\n")
f.write("Αυτό είναι η Python.\n")
f.write("Μαθαίνω αρχεία!\n")
f.close()

# Τώρα διαβάζουμε το αρχείο
f = open("hello.txt", "r")
content = f.read()
print(content)
f.close()
