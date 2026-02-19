# ΑΣΚΗΣΗ: Βαθμολόγιο Μαθητών - ΛΥΣΗ

# 1. Δημιουργία αρχείου
f = open("bathmi.txt", "w")
f.write("Νίκος,18\n")
f.write("Μαρία,15\n")
f.write("Γιώργος,9\n")
f.write("Ελένη,20\n")
f.write("Κώστας,7\n")
f.write("Αθηνά,12\n")
f.close()

# 2. Ανάγνωση + επεξεργασία
f = open("bathmi.txt", "r")

athroisma = 0
plithos = 0
perasmenoi = 0
apotixia = 0
megistos_bathmos = -1
megistos_onoma = ""

for line in f:
    parts = line.strip().split(",")
    onoma = parts[0]
    bathmos = int(parts[1])

    athroisma = athroisma + bathmos
    plithos = plithos + 1

    if bathmos >= 10:
        perasmenoi = perasmenoi + 1
    else:
        apotixia = apotixia + 1

    if bathmos > megistos_bathmos:
        megistos_bathmos = bathmos
        megistos_onoma = onoma

f.close()

# 3. Υπολογισμοί
mesos = athroisma / plithos

# 4. Εγγραφή αποτελεσμάτων
out = open("results.txt", "w")
out.write("=== Αποτελέσματα ===\n")
out.write("Μέσος Όρος: " + str(round(mesos, 1)) + "\n")
out.write("Επιτυχία: " + str(perasmenoi) + "\n")
out.write("Αποτυχία: " + str(apotixia) + "\n")
out.write("Πρώτος: " + megistos_onoma + " (" + str(megistos_bathmos) + ")\n")
out.close()

# Εμφάνιση
f = open("results.txt", "r")
print(f.read())
f.close()
