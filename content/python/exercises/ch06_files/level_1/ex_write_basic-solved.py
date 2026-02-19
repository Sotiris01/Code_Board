# ΑΣΚΗΣΗ: Εγγραφή σε Αρχείο (Βασική) - ΛΥΣΗ

f = open("hello.txt", "w")
f.write("Γεια σου Κόσμε!\n")
f.write("Αυτό είναι η Python.\n")
f.write("Μαθαίνω αρχεία!\n")
f.close()

print("Το αρχείο hello.txt δημιουργήθηκε!")
