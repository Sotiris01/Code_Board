# Άσκηση: Μεταβλητή Κλάσης — Μετρητής
# Δυσκολία: ⭐⭐

class Dog:
    no_inst = 0                          # μεταβλητή κλάσης

    def __init__(self, breed, size, color):
        self.breed = breed
        self.size = size
        self.color = color
        Dog.no_inst += 1                 # αυξάνεται σε ΚΑΘΕ δημιουργία

    def eat(self, food):
        print("I am eating", food)

    def bark(self):
        print("I am barking")

    @classmethod
    def get_no_of_dogs(cls):
        return cls.no_inst


# Δημιουργία αντικειμένων
Max = Dog("terrier", "medium", "brown")
Rocky = Dog("labrador", "large", "light brown")
Buddy = Dog("poodle", "small", "white")

# Πόσα σκυλιά δημιουργήθηκαν;
print(Dog.get_no_of_dogs())              # → 3
print(Dog.no_inst)                       # → 3 (απευθείας πρόσβαση)
