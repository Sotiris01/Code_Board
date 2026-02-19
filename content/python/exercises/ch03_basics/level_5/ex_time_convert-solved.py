# ΑΣΚΗΣΗ: Αριθμητική με Χρόνο - ΛΥΣΗ

total = int(input("Δώσε δευτερόλεπτα: "))

if total < 0:
    print("Σφάλμα: αρνητικός χρόνος")
elif total == 0:
    print("Δεν δόθηκε χρόνος")
else:
    ores = total // 3600
    lepta = (total % 3600) // 60
    deut = total % 60

    print(ores, "ώρες,", lepta, "λεπτά,", deut, "δευτερόλεπτα")

    if ores > 0:
        print("Πάνω από μία ώρα!")
