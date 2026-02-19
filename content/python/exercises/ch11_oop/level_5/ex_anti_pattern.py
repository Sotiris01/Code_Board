# Άσκηση: Αντιπαράδειγμα — Διόρθωσε το Σφάλμα!
# Δυσκολία: ⭐⭐⭐⭐⭐
#
# Ο παρακάτω κώδικας έχει ΣΦΑΛΜΑΤΑ.
# Βρες τα, εξήγησε γιατί υπάρχουν, και διόρθωσέ τα.
#
# ΣΦΑΛΜΑ 1: Μη αρχικοποιημένη ιδιότητα στο __init__
# ΣΦΑΛΜΑ 2: Ξεχασμένο self
# ΣΦΑΛΜΑ 3: Κληρονομικότητα χωρίς super()
#
# --- Προβληματικός κώδικας ---
#
# class Vehicle1:
#     def __init__(self, color, price, wheels):
#         self.color = color
#         self.price = price
#         self.wheels = wheels
#         # speed ΔΕΝ αρχικοποιείται!
#
#     def accelerate(self, amount):
#         self.speed += amount
#         return self.speed
#
# class Car1(Vehicle1):
#     def __init__(self, color, price, wheels, doors):
#         # Ξέχασε super().__init__()!
#         self.doors = doors
#
#     def honk(self):
#         print("Μπιπ! Μπιπ!")
#
#     def info(self):
#         # Ξέχασε self!
#         print("Χρώμα:", color, "Πόρτες:", doors)
#
# --- Δοκίμασε ---
# betty = Vehicle1("yellow", 2000, 4)
# betty.accelerate(10)           # ← AttributeError!
#
# mycar = Car1("red", 15000, 4, 5)
# print(mycar.color)             # ← AttributeError!
# mycar.info()                   # ← NameError!
#
# Διόρθωσε τα παραπάνω ώστε να λειτουργούν σωστά.

# Γράψε τον κώδικά σου εδώ
