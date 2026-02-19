# ΑΣΚΗΣΗ: Βαθμολογία Μαθητή - ΛΥΣΗ

bathmos = int(input("Δώσε βαθμό (0-20): "))

if bathmos < 0 or bathmos > 20:
    print("Μη έγκυρος βαθμός")
elif bathmos <= 9:
    print("Βαθμός", bathmos, "— Ανεπαρκώς")
elif bathmos <= 12:
    print("Βαθμός", bathmos, "— Σχεδόν Καλά")
elif bathmos <= 15:
    print("Βαθμός", bathmos, "— Καλά")
elif bathmos <= 18:
    print("Βαθμός", bathmos, "— Πολύ Καλά")
else:
    print("Βαθμός", bathmos, "— Άριστα")
