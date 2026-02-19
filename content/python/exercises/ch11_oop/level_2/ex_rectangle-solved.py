# Άσκηση: Κλάση Rectangle — Εμβαδόν & Περίμετρος
# Δυσκολία: ⭐⭐

class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height

    def display(self):
        print("Ορθογώνιο", str(self.width) + "x" + str(self.height))


# Δημιουργία αντικειμένων
r1 = Rectangle(5, 3)
r2 = Rectangle(4, 4)

# Εμβαδόν & Περίμετρος
print("Εμβαδόν r1:", r1.area())          # → 15
print("Περίμετρος r1:", r1.perimeter())  # → 16

print("Εμβαδόν r2:", r2.area())          # → 16
print("Περίμετρος r2:", r2.perimeter())  # → 16

# Έλεγχος τετραγώνου
print("r1 τετράγωνο;", r1.is_square())   # → False
print("r2 τετράγωνο;", r2.is_square())   # → True

# Εμφάνιση
r1.display()    # → Ορθογώνιο 5x3
r2.display()    # → Ορθογώνιο 4x4
