# ΑΣΚΗΣΗ: Λειτουργίες os Module - ΛΥΣΗ

import os

# 1. Τρέχων φάκελος
print("Τρέχων φάκελος:", os.getcwd())

# 2. Δημιουργία αρχείου
f = open("test_os.txt", "w")
f.write("Δοκιμή os module\n")
f.close()
print("Δημιουργήθηκε: test_os.txt")

# 3. Μετονομασία
os.rename("test_os.txt", "renamed.txt")
print("Μετονομάστηκε σε: renamed.txt")

# 4. Έλεγχος ύπαρξης
if os.path.exists("renamed.txt"):
    print("Το renamed.txt ΥΠΑΡΧΕΙ")
else:
    print("Το renamed.txt ΔΕΝ υπάρχει")

# 5. Λίστα αρχείων
print("\nΑρχεία στον φάκελο:")
for item in os.listdir("."):
    print(" ", item)

# 6. Διαγραφή
os.remove("renamed.txt")
print("\nΔιαγράφηκε: renamed.txt")

# 7. Επιβεβαίωση
if os.path.exists("renamed.txt"):
    print("Ακόμα υπάρχει!")
else:
    print("Επιβεβαίωση: δεν υπάρχει πια")
