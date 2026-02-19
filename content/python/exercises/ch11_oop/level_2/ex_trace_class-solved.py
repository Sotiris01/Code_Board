# Άσκηση: Ιχνηλάτηση Κλάσης
# Δυσκολία: ⭐⭐

class Counter:
    total = 0

    def __init__(self, name):
        self.name = name
        self.value = 0
        Counter.total += 1

    def increment(self):
        self.value += 1

    def reset(self):
        self.value = 0

    @classmethod
    def get_total(cls):
        return cls.total


c1 = Counter("Α")        # total = 1, c1.value = 0
c2 = Counter("Β")        # total = 2, c2.value = 0
c1.increment()            # c1.value = 1
c1.increment()            # c1.value = 2
c2.increment()            # c2.value = 1
c1.increment()            # c1.value = 3

print(c1.name)                # → Α
print(c1.value)               # → 3
print(c2.value)               # → 1
print(Counter.get_total())    # → 2
c1.reset()                    # c1.value = 0
print(c1.value)               # → 0
print(Counter.total)          # → 2 (δεν αλλάζει με reset)
