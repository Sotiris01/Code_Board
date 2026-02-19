# ΑΣΚΗΣΗ: Ημερολόγιο (Log File) - ΛΥΣΗ

def log(message):
    # Μέτρησε υπάρχουσες γραμμές
    try:
        f = open("log.txt", "r")
        lines = f.readlines()
        f.close()
        num = len(lines) + 1
    except:
        num = 1
    # Πρόσθεσε τη νέα γραμμή
    f = open("log.txt", "a")
    f.write("[" + str(num) + "] " + message + "\n")
    f.close()

def show_log():
    f = open("log.txt", "r")
    print("=== Ημερολόγιο ===")
    for line in f:
        print(line, end="")
    f.close()
    print()

def search_log(word):
    f = open("log.txt", "r")
    print("Αναζήτηση:", word)
    vrethike = False
    for line in f:
        if word in line:
            print(line, end="")
            vrethike = True
    if not vrethike:
        print("(δεν βρέθηκε)")
    f.close()
    print()

# Δοκιμή - ξεκινάμε με νέο αρχείο
f = open("log.txt", "w")
f.close()

log("Εκκίνηση προγράμματος")
log("Φόρτωση δεδομένων")
log("Σφάλμα σύνδεσης")
log("Επανασύνδεση επιτυχής")
log("Σφάλμα αρχείου")

show_log()
search_log("Σφάλμα")
