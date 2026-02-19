# Άσκηση: Κληρονομικότητα — Animal → Dog + Cat
# Δυσκολία: ⭐⭐⭐⭐

class Animal(object):
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def speak(self):
        print("...")

    def display(self):
        print(self.name, "- Ηλικία:", self.age)


class Dog(Animal):
    def __init__(self, name, age, breed):
        super(Dog, self).__init__(name, age)
        self.breed = breed

    def speak(self):
        print("Γαβ! Γαβ!")

    def display(self):
        super(Dog, self).display()
        print("  Ράτσα:", self.breed)


class Cat(Animal):
    def __init__(self, name, age, indoor):
        super(Cat, self).__init__(name, age)
        self.indoor = indoor

    def speak(self):
        print("Νιάου!")

    def display(self):
        super(Cat, self).display()
        where = "εσωτερικού" if self.indoor else "εξωτερικού"
        print("  Χώρος:", where)


# Δημιουργία αντικειμένων
d = Dog("Ρεξ", 5, "Λαμπραντόρ")
c = Cat("Μίτσα", 3, True)

# Πολυμορφισμός — speak()
d.speak()       # → Γαβ! Γαβ!
c.speak()       # → Νιάου!

# Εμφάνιση
d.display()
# Ρεξ - Ηλικία: 5
#   Ράτσα: Λαμπραντόρ

c.display()
# Μίτσα - Ηλικία: 3
#   Χώρος: εσωτερικού

# Πολυμορφισμός σε λίστα
animals = [d, c]
for a in animals:
    a.speak()
