# Άσκηση: Αντιπαράδειγμα — Διόρθωσε το Σφάλμα!
# Δυσκολία: ⭐⭐⭐⭐⭐

# === ΠΡΙΝ (Προβληματικός κώδικας) ===
#
# class Vehicle1:
#     def __init__(self, color, price, wheels):
#         self.color = color
#         self.price = price
#         self.wheels = wheels
#         # self.speed = 0   ← ΕΛΕΙΠΕ!
#
#     def accelerate(self, amount):
#         self.speed += amount    # ← AttributeError αν speed δεν υπάρχει
#         return self.speed
#
# class Car1(Vehicle1):
#     def __init__(self, color, price, wheels, doors):
#         # super().__init__(...)   ← ΕΛΕΙΠΕ!
#         self.doors = doors
#
#     def info(self):
#         print("Χρώμα:", color)   # ← NameError, λείπει self.

# === ΜΕΤΑ (Διορθωμένος κώδικας) ===

class Vehicle1:
    def __init__(self, color, price, wheels):
        self.color = color
        self.price = price
        self.wheels = wheels
        self.speed = 0              # ΔΙΟΡΘΩΣΗ 1: αρχικοποίηση speed

    def accelerate(self, amount):
        self.speed += amount
        return self.speed

    def decelerate(self, amount):
        self.speed -= amount
        if self.speed < 0:
            self.speed = 0
        return self.speed


class Car1(Vehicle1):
    def __init__(self, color, price, wheels, doors):
        super(Car1, self).__init__(color, price, wheels)  # ΔΙΟΡΘΩΣΗ 2: super()
        self.doors = doors

    def honk(self):
        print("Μπιπ! Μπιπ!")

    def info(self):
        print("Χρώμα:", self.color, "Πόρτες:", self.doors)  # ΔΙΟΡΘΩΣΗ 3: self.


# --- Δοκιμή ---
betty = Vehicle1("yellow", 2000, 4)
print(betty.accelerate(10))    # → 10 (δουλεύει γιατί speed = 0 αρχικά)
print(betty.accelerate(20))    # → 30

mycar = Car1("red", 15000, 4, 5)
print(mycar.color)             # → red (δουλεύει γιατί super().__init__ κλήθηκε)
mycar.info()                   # → Χρώμα: red Πόρτες: 5 (self.color αντί color)
mycar.honk()                   # → Μπιπ! Μπιπ!

# Μάθημα:
# 1. ΠΑΝΤΑ αρχικοποιούμε ΟΛΕΣ τις ιδιότητες στο __init__
# 2. ΠΑΝΤΑ καλούμε super().__init__() σε υποκλάσεις
# 3. ΠΑΝΤΑ χρησιμοποιούμε self. για πρόσβαση σε ιδιότητες
