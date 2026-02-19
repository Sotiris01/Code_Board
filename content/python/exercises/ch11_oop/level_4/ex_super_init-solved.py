# Άσκηση: Κατανόηση super().__init__()
# Δυσκολία: ⭐⭐⭐⭐

class Vehicle:
    def __init__(self, make, year):
        self.make = make
        self.year = year

    def info(self):
        print(self.make, "-", self.year)


class Car(Vehicle):
    def __init__(self, make, year, doors):
        super(Car, self).__init__(make, year)
        self.doors = doors

    def info(self):
        print(self.make, "-", self.year, "- Πόρτες:", self.doors)


class Motorcycle(Vehicle):
    def __init__(self, make, year, engine_cc):
        super(Motorcycle, self).__init__(make, year)
        self.engine_cc = engine_cc

    def info(self):
        print(self.make, "-", self.year, "- Κυβικά:", self.engine_cc, "cc")


# Δημιουργία αντικειμένων
car = Car("Toyota", 2020, 4)
moto = Motorcycle("Honda", 2022, 600)

# Χρήση info() — πολυμορφισμός
car.info()      # → Toyota - 2020 - Πόρτες: 4
moto.info()     # → Honda - 2022 - Κυβικά: 600 cc

# Πρόσβαση σε ιδιότητες γονικής κλάσης
print(car.make)          # → Toyota (κληρονομημένη)
print(moto.year)         # → 2022 (κληρονομημένη)
print(car.doors)         # → 4 (δική της)
print(moto.engine_cc)    # → 600 (δική της)
