# Άσκηση: Στοίβα ως Κλάση (Δρ.1 ΤΕΕ)
# Δυσκολία: ⭐⭐⭐

class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.isEmpty():
            return self.items.pop()
        else:
            print("Η στοίβα είναι κενή!")
            return None

    def isEmpty(self):
        return self.items == []

    def size(self):
        return len(self.items)

    def peek(self):
        if not self.isEmpty():
            return self.items[-1]
        else:
            return None


# Χρήση — dot notation αντί function call
s = Stack()
s.push(10)
s.push(20)
s.push(30)

print("Μέγεθος:", s.size())      # → 3
print("Κορυφή:", s.peek())       # → 30

print(s.pop())                    # → 30 (LIFO)
print(s.pop())                    # → 20
print(s.pop())                    # → 10
print("Κενή;", s.isEmpty())      # → True
