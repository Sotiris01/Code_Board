# ΑΣΚΗΣΗ: Τι θα γίνει; (Σενάρια Αρχείων)
#
# Για κάθε σενάριο γράψε τι θα τυπωθεί
# ή αν θα γίνει σφάλμα.
#
# --- Σενάριο 1 ---
# f = open("data.txt", "w")
# f.write("Alpha\n")
# f.write("Beta\n")
# f.close()
# f = open("data.txt", "w")
# f.write("Gamma\n")
# f.close()
# f = open("data.txt", "r")
# print(f.read())
# f.close()
# Τι τυπώνεται;
# Απάντηση:
#
# --- Σενάριο 2 ---
# f = open("data.txt", "w")
# f.write("Hello\n")
# f.close()
# f = open("data.txt", "a")
# f.write("World\n")
# f.close()
# f = open("data.txt", "r")
# print(f.read())
# f.close()
# Τι τυπώνεται;
# Απάντηση:
#
# --- Σενάριο 3 ---
# f = open("nonexistent.txt", "r")
# Τι θα γίνει;
# Απάντηση:

