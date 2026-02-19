# Άσκηση: Η Πρώτη μου Κλάση
# Δυσκολία: ⭐

class Dog:
    def __init__(self, breed, size, color):
        self.breed = breed
        self.size = size
        self.color = color

    def eat(self, food):
        print("I am eating", food)

    def bark(self):
        print("I am barking")


# Δημιουργία αντικειμένων
Max = Dog("terrier", "medium", "brown")
Rocky = Dog("labrador", "large", "light brown")

# Κλήση μεθόδων
Max.eat("bone")       # → I am eating bone
Rocky.bark()          # → I am barking

# Εκτύπωση ιδιοτήτων
print(Max.breed)      # → terrier
print(Rocky.color)    # → light brown
