# ΑΣΚΗΣΗ: Υπολογιστής ΔΜΣ (BMI) - ΛΥΣΗ

varos = float(input("Δώσε βάρος (kg): "))
ypsos = float(input("Δώσε ύψος (m): "))

bmi = varos / (ypsos ** 2)

# Στρογγυλοποίηση σε 2 δεκαδικά
bmi = round(bmi, 2)

if bmi < 18.5:
    katigoria = "Λιποβαρής"
elif bmi < 25:
    katigoria = "Κανονικό βάρος"
elif bmi < 30:
    katigoria = "Υπέρβαρος"
else:
    katigoria = "Παχύσαρκος"

print("BMI:", bmi, "—", katigoria)
