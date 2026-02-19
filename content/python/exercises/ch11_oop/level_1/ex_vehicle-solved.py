# Άσκηση: Κλάση Vehicle
# Δυσκολία: ⭐

class Vehicle:
    def __init__(self, color, price, wheels, speed):
        self.color = color
        self.price = price
        self.wheels = wheels
        self.speed = speed

    def accelerate(self, amount):
        self.speed += amount
        return self.speed

    def decelerate(self, amount):
        self.speed -= amount
        return self.speed


# Δημιουργία αντικειμένου
mybeetle = Vehicle("yellow", 2000.00, 4, 80)

# Επιτάχυνση
print(mybeetle.accelerate(20))    # → 100

# Επιβράδυνση
print(mybeetle.decelerate(30))    # → 70

# Τρέχουσα ταχύτητα
print("Ταχύτητα:", mybeetle.speed)  # → 70
