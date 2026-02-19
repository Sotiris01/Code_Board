# Άσκηση: Ιεραρχία Οχημάτων
# Δυσκολία: ⭐⭐⭐⭐⭐

class Vehicle:
    count = 0

    def __init__(self, make, year, speed=0):
        self.make = make
        self.year = year
        self.speed = speed
        Vehicle.count += 1

    def accelerate(self, amount):
        self.speed += amount
        print(self.make, "→ Ταχύτητα:", self.speed, "km/h")

    def brake(self, amount):
        self.speed -= amount
        if self.speed < 0:
            self.speed = 0
        print(self.make, "→ Φρενάρισμα:", self.speed, "km/h")

    def info(self):
        print(self.make, "-", self.year, "- Ταχύτητα:", self.speed, "km/h")

    @classmethod
    def get_count(cls):
        return cls.count


class Car(Vehicle):
    def __init__(self, make, year, doors, fuel_type):
        super(Car, self).__init__(make, year)
        self.doors = doors
        self.fuel_type = fuel_type

    def info(self):
        print("Αυτοκίνητο:", self.make, "-", self.year,
              "- Πόρτες:", self.doors, "- Καύσιμο:", self.fuel_type,
              "- Ταχύτητα:", self.speed, "km/h")


class Motorcycle(Vehicle):
    def __init__(self, make, year, engine_cc):
        super(Motorcycle, self).__init__(make, year)
        self.engine_cc = engine_cc

    def info(self):
        print("Μοτοσικλέτα:", self.make, "-", self.year,
              "- Κυβικά:", self.engine_cc, "cc",
              "- Ταχύτητα:", self.speed, "km/h")

    def wheelie(self):
        if self.speed > 30:
            print(self.make, "κάνει wheelie!")
        else:
            print("Πολύ αργά για wheelie...")


# --- Δοκιμή ---
car1 = Car("Toyota", 2020, 4, "Βενζίνη")
car2 = Car("Tesla", 2023, 4, "Ηλεκτρικό")
moto = Motorcycle("Honda", 2022, 600)

# Πληροφορίες
print("=== Οχήματα ===")
car1.info()
car2.info()
moto.info()

# Κίνηση
print("\n=== Δοκιμή ===")
car1.accelerate(80)
car1.brake(30)

moto.accelerate(50)
moto.wheelie()       # → wheelie!
moto.brake(40)
moto.wheelie()       # → πολύ αργά

# Μετρητής
print("\nΣύνολο οχημάτων:", Vehicle.get_count())  # → 3
