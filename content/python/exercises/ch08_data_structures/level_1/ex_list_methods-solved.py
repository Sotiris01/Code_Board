# ΑΣΚΗΣΗ: Λίστα — Βασικές Μέθοδοι - ΛΥΣΗ

# 1. Κενή λίστα
L = []

# 2. append
L.append(10)
L.append(20)
L.append(30)
L.append(40)
L.append(50)
print("Μετά append:", L)

# 3. insert
L.insert(1, 15)
print("Μετά insert(1, 15):", L)

# 4. pop() — τελευταίο
item = L.pop()
print("pop():", item, "→ L:", L)

# 5. pop(0) — πρώτο
item = L.pop(0)
print("pop(0):", item, "→ L:", L)

# 6. len
print("Μήκος:", len(L))

# ΣΥΝΟΨΗ:
# append(x)   → προσθέτει στο ΤΕΛΟΣ
# insert(i,x) → εισάγει στη θέση i
# pop()       → αφαιρεί ΤΕΛΕΥΤΑΙΟ
# pop(0)      → αφαιρεί ΠΡΩΤΟ
# len(L)      → μήκος λίστας
