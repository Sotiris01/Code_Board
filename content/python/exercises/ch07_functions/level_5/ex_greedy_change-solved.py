# ΑΣΚΗΣΗ: Αλγόριθμος Ρέστων (Greedy) - ΛΥΣΗ

def calculate_change(cost, payment):
    return payment - cost

def count_coins(amount):
    values = [100, 50, 20, 10, 5, 2, 1]
    counts = []
    for value in values:
        c = amount // value
        counts.append(c)
        amount = amount % value
    return counts

def display_coins(values, counts):
    total_coins = 0
    for i in range(len(values)):
        if counts[i] > 0:
            print(str(counts[i]) + " × " + str(values[i]) + " λεπτά")
            total_coins = total_coins + counts[i]
    print("Σύνολο κερμάτων:", total_coins)

# Κύριο πρόγραμμα
cost = 340
payment = 500
change = calculate_change(cost, payment)

print("Κόστος:", cost, "λεπτά")
print("Πληρωμή:", payment, "λεπτά")
print("Ρέστα:", change, "λεπτά")
print()

values = [100, 50, 20, 10, 5, 2, 1]
counts = count_coins(change)
display_coins(values, counts)

print()
print("--- Δοκιμή 2 ---")
change2 = calculate_change(175, 1000)
print("Ρέστα:", change2, "λεπτά")
counts2 = count_coins(change2)
display_coins(values, counts2)
