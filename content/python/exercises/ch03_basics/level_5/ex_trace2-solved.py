# ΑΣΚΗΣΗ: Ιχνηλάτηση Κώδικα (2) — Τύποι & Παγίδες - ΛΥΣΗ

# 1)
x = "5"
y = 3
# print(x + y)                 # ERROR! TypeError: str + int δεν γίνεται

# 2)
print(x * y)                   # "555" — str * int = επανάληψη string

# 3)
print(int(x) + y)              # 8 — μετατροπή σε int πρώτα

# 4)
a = 10
b = "10"
print(a == b)                  # False — int != str (διαφορετικοί τύποι)

# 5)
print(str(a) == b)             # True — "10" == "10"

# 6)
c = True
d = 1
print(c == d)                  # True — True == 1 στην Python!

# 7)
print(type(c) == type(d))      # False — bool ≠ int (αν και True==1)

# 8)
e = 0
print(bool(e))                 # False — 0 = False
print(bool(""))                # False — κενό string = False
print(bool("False"))           # True! — ΜΗ ΚΕΝΟ string = True (η τιμή δεν μετράει!)
