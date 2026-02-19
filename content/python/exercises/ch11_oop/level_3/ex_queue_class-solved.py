# Άσκηση: Ουρά ως Κλάση
# Δυσκολία: ⭐⭐⭐

class Queue:
    def __init__(self):
        self.items = []

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        if not self.isEmpty():
            return self.items.pop(0)
        else:
            print("Η ουρά είναι κενή!")
            return None

    def isEmpty(self):
        return self.items == []

    def size(self):
        return len(self.items)

    def front(self):
        if not self.isEmpty():
            return self.items[0]
        else:
            return None


# Χρήση ουράς
q = Queue()
q.enqueue("Α")
q.enqueue("Β")
q.enqueue("Γ")

print("Μέγεθος:", q.size())     # → 3
print("Πρώτο:", q.front())      # → Α

print(q.dequeue())               # → Α (FIFO)
print(q.dequeue())               # → Β
print(q.dequeue())               # → Γ
print("Κενή;", q.isEmpty())     # → True
