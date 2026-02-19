# ΑΣΚΗΣΗ: Ορθογώνιο Παραλληλόγραμμο - ΛΥΣΗ

platos = float(input("Δώσε πλάτος: "))
mikos = float(input("Δώσε μήκος: "))

if platos <= 0 or mikos <= 0:
    print("Λάθος τιμές!")
else:
    emvadon = platos * mikos
    perimetros = 2 * (platos + mikos)
    diagonios = (platos ** 2 + mikos ** 2) ** 0.5

    print("Εμβαδόν:", emvadon)
    print("Περίμετρος:", perimetros)
    print("Διαγώνιος:", diagonios)

    if platos == mikos:
        print("Είναι τετράγωνο!")
    else:
        print("Δεν είναι τετράγωνο")
