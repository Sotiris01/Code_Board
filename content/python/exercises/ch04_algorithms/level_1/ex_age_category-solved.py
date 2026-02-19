# ΑΣΚΗΣΗ: Κατηγορία Ηλικίας - ΛΥΣΗ

ilikia = int(input("Δώσε ηλικία: "))

if ilikia < 0 or ilikia > 120:
    print("Μη έγκυρη ηλικία!")
elif ilikia <= 12:
    print("Κατηγορία: Παιδί")
elif ilikia <= 17:
    print("Κατηγορία: Έφηβος")
elif ilikia <= 64:
    print("Κατηγορία: Ενήλικας")
else:
    print("Κατηγορία: Ηλικιωμένος")
