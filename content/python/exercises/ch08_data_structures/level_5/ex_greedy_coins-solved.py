# ΑΣΚΗΣΗ: Αλγόριθμος Ρέστων (Greedy) - ΛΥΣΗ

values = [200, 100, 50, 20, 10, 5, 2, 1]

cost = int(input("Κόστος (λεπτά): "))
payment = int(input("Πληρωμή (λεπτά): "))
change = payment - cost

print("\nΡέστα:", change, "λεπτά")
print("(" + str(change / 100) + " €)")
print()

total_coins = 0
for value in values:
    count = change // value
    change = change % value
    if count > 0:
        print(str(count) + " × " + str(value) + " λεπτά")
        total_coins += count

print("\nΣύνολο κερμάτων:", total_coins)
