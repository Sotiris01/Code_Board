# Άσκηση: Σχήματα — Πολυμορφισμός (Δρ.3 ΤΕΕ)
# Δυσκολία: ⭐⭐⭐⭐

class Schema(object):
    def __init__(self, name):
        self.name = name

    def getArea(self):
        return 0


class Square(Schema):
    def __init__(self, side):
        super(Square, self).__init__("Square")
        self.side = side

    def getArea(self):
        return self.side ** 2


class Circle(Schema):
    def __init__(self, radius):
        super(Circle, self).__init__("Circle")
        self.radius = radius

    def getArea(self):
        return 3.14159 * self.radius ** 2


class Triangle(Schema):
    def __init__(self, base, height):
        super(Triangle, self).__init__("Triangle")
        self.base = base
        self.height = height

    def getArea(self):
        return 0.5 * self.base * self.height


# Δημιουργία σχημάτων
s = Square(5)
c = Circle(3)
t = Triangle(6, 4)

# Πολυμορφισμός: ίδια μέθοδος, διαφορετική συμπεριφορά
shapes = [s, c, t]
for shape in shapes:
    print(shape.name, "→ Εμβαδόν:", shape.getArea())

# Square → Εμβαδόν: 25
# Circle → Εμβαδόν: 28.27431
# Triangle → Εμβαδόν: 12.0
