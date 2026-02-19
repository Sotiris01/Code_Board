# ΑΣΚΗΣΗ: Σύνθετο — Κατάστημα Προϊόντων - ΛΥΣΗ

def bubbleSort(A):
    N = len(A)
    for i in range(N - 1):
        for j in range(N - 1, i, -1):
            if A[j] < A[j - 1]:
                A[j], A[j - 1] = A[j - 1], A[j]

# Κύριο πρόγραμμα
prices = [29.99, 5.50, 12.75, 45.00, 8.25, 19.90, 3.50, 37.80]
print("Αρχικές τιμές:", prices)

# 1. Ταξινόμηση
bubbleSort(prices)
print("Ταξινομημένες:", prices)

# 2. Εισαγωγή προϋπολογισμού
budget = float(input("Δώσε προϋπολογισμό: "))

# 3. Greedy: αγόρασε τα φθηνότερα
agorases = []
synolo = 0

for i in range(len(prices)):
    if synolo + prices[i] <= budget:
        agorases.append(prices[i])
        synolo = synolo + prices[i]
    else:
        break   # ξεπεράστηκε ο προϋπολογισμός

# 4. Αποτελέσματα
resta = budget - synolo
print("Μπορείς να αγοράσεις:", agorases)
print("Σύνολο:", round(synolo, 2))
print("Ρέστα:", round(resta, 2))
