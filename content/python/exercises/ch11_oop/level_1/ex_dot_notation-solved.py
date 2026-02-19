# Άσκηση: Dot Notation — Πρόσβαση σε Ιδιότητες
# Δυσκολία: ⭐

class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity

    def total_cost(self):
        return self.price * self.quantity

    def display(self):
        print(self.name, "-", self.price, "€ x", self.quantity)


# 1. Δημιουργία αντικειμένων
p1 = Product("Μολύβι", 0.50, 10)
p2 = Product("Τετράδιο", 1.20, 5)
p3 = Product("Γόμα", 0.30, 8)

# 2. Πρόσβαση σε ιδιότητες με dot notation
print(p1.name, "→", p1.price, "€")     # → Μολύβι → 0.5 €
print(p2.name, "→", p2.price, "€")     # → Τετράδιο → 1.2 €
print(p3.name, "→", p3.price, "€")     # → Γόμα → 0.3 €

# 3. Κλήση total_cost()
print("Συνολικό κόστος μολυβιών:", p1.total_cost())   # → 5.0
print("Συνολικό κόστος τετραδίων:", p2.total_cost())  # → 6.0
print("Συνολικό κόστος γομών:", p3.total_cost())      # → 2.4

# 4. Κλήση display()
p1.display()    # → Μολύβι - 0.5 € x 10
p2.display()    # → Τετράδιο - 1.2 € x 5
p3.display()    # → Γόμα - 0.3 € x 8
