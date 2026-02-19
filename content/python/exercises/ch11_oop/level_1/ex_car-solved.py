# Άσκηση: Κλάση Car — Τροποποίηση
# Δυσκολία: ⭐

class Car:
    def __init__(self, make, color, year):
        self.make = make
        self.color = color
        self.year = year
        self.speed = 60           # αρχική ταχύτητα

    def speed_up(self, speed):
        self.speed = speed
        print("Driving at", self.speed, "km/h")

    def turn(self, direction):
        print("Turning", direction)


# Δημιουργία αντικειμένων
convertible = Car("bmw", "black", 2013)
sedan = Car("Toyota", "red", 2009)

# Κλήση μεθόδων
convertible.turn("right")    # → Turning right
sedan.speed_up(90)           # → Driving at 90 km/h

# Εκτύπωση ιδιοτήτων
print(convertible.make)      # → bmw
print(sedan.year)            # → 2009
print(sedan.speed)           # → 90
