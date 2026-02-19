# ΑΣΚΗΣΗ: Τι θα γίνει; (Σενάρια Αρχείων) - ΛΥΣΗ

# --- Σενάριο 1 ---
f = open("data.txt", "w")
f.write("Alpha\n")
f.write("Beta\n")
f.close()
f = open("data.txt", "w")    # "w" ΣΒΗΝΕΙ ΟΛΑ!
f.write("Gamma\n")
f.close()
f = open("data.txt", "r")
print(f.read())
f.close()
# Τυπώνεται ΜΟΝΟ:
# Gamma
# (τα Alpha και Beta σβήστηκαν με το δεύτερο "w")

print("---")

# --- Σενάριο 2 ---
f = open("data.txt", "w")
f.write("Hello\n")
f.close()
f = open("data.txt", "a")    # "a" ΚΡΑΤΑΕΙ τα υπάρχοντα!
f.write("World\n")
f.close()
f = open("data.txt", "r")
print(f.read())
f.close()
# Τυπώνεται:
# Hello
# World

# --- Σενάριο 3 ---
# f = open("nonexistent.txt", "r")
# ΣΦΑΛΜΑ: FileNotFoundError
# Το "r" δεν δημιουργεί αρχείο αν δεν υπάρχει.
print("Σενάριο 3: FileNotFoundError")
