# Άσκηση: Σχήματα — Πολυμορφισμός (Δρ.3 ΤΕΕ)
# Δυσκολία: ⭐⭐⭐⭐
#
# Δημιούργησε τις εξής κλάσεις:
#
# 1. Schema (γονική κλάση):
#    - __init__(name)
#    - getArea() → επιστρέφει 0 (θα αντικατασταθεί)
#
# 2. Square (κληρονομεί Schema):
#    - __init__(side) → super().__init__("Square") + self.side
#    - getArea() → side ** 2
#
# 3. Circle (κληρονομεί Schema):
#    - __init__(radius) → super().__init__("Circle") + self.radius
#    - getArea() → 3.14159 * radius ** 2
#
# s = Square(5)
# c = Circle(3)
# print(s.getArea())   → 25
# print(c.getArea())   → 28.27...
#
# ΠΟΛΥΜΟΡΦΙΣΜΟΣ: η ίδια μέθοδος getArea() συμπεριφέρεται
# διαφορετικά ανάλογα με τον τύπο αντικειμένου!

# Γράψε τον κώδικά σου εδώ
