# ΑΣΚΗΣΗ: Μάντεψε τον Αριθμό - ΛΥΣΗ

mystikos = 42
prospatheies = 0

protasi = int(input("Μάντεψε τον αριθμό: "))
prospatheies = prospatheies + 1

while protasi != mystikos:
    if protasi < mystikos:
        print("Πάνω!")
    else:
        print("Κάτω!")
    protasi = int(input("Μάντεψε ξανά: "))
    prospatheies = prospatheies + 1

print("Μπράβο! Προσπάθειες:", prospatheies)
