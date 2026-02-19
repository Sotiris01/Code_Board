# ΑΣΚΗΣΗ: Ιχνηλάτηση — Τι θα τυπωθεί; - ΛΥΣΗ

def mystery(a, b):
    if a > b:
        return a - b
    else:
        return b - a

x = mystery(10, 3)
# a=10, b=3 → 10>3 True → return 10-3 = 7
# x = 7

y = mystery(3, 10)
# a=3, b=10 → 3>10 False → return 10-3 = 7
# y = 7

z = mystery(x, y)
# a=7, b=7 → 7>7 False → return 7-7 = 0
# z = 0

print(x, y, z)
# ΕΚΤΥΠΩΣΗ: 7 7 0

# ΣΥΜΠΕΡΑΣΜΑ: Η mystery υπολογίζει
# την ΑΠΟΛΥΤΗ τιμή της διαφοράς |a - b|!
