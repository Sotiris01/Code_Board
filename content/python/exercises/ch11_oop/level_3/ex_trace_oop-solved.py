# Άσκηση: Ιχνηλάτηση OOP — Τι θα τυπωθεί;
# Δυσκολία: ⭐⭐⭐

class Box:
    count = 0

    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.items = []
        Box.count += 1

    def add(self, item):
        self.items.append(item)

    def area(self):
        return self.width * self.height

    def num_items(self):
        return len(self.items)


b1 = Box(5, 3)              # count = 1
b2 = Box(4, 4)              # count = 2
b1.add("βιβλίο")            # b1.items = ["βιβλίο"]
b1.add("στυλό")             # b1.items = ["βιβλίο", "στυλό"]
b2.add("τετράδιο")          # b2.items = ["τετράδιο"]

print(b1.area())            # → 15
print(b2.area())            # → 16
print(b1.num_items())       # → 2
print(b2.num_items())       # → 1
print(Box.count)            # → 2
b1.add("γόμα")              # b1.items = ["βιβλίο", "στυλό", "γόμα"]
print(b1.items)             # → ['βιβλίο', 'στυλό', 'γόμα']
