# Άσκηση: Κλάση BankAccount — Τραπεζικός Λογαριασμός
# Δυσκολία: ⭐⭐

class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print("Κατάθεση " + str(amount) + "€. Υπόλοιπο: " + str(self.balance) + "€")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Ανεπαρκές υπόλοιπο!")
        else:
            self.balance -= amount
            print("Ανάληψη " + str(amount) + "€. Υπόλοιπο: " + str(self.balance) + "€")

    def get_balance(self):
        return self.balance


# Δημιουργία λογαριασμού
acc = BankAccount("Μαρία", 100)

# Κατάθεση
acc.deposit(50)          # → Κατάθεση 50€. Υπόλοιπο: 150€

# Ανάληψη — αποτυχία
acc.withdraw(200)        # → Ανεπαρκές υπόλοιπο!

# Ανάληψη — επιτυχία
acc.withdraw(80)         # → Ανάληψη 80€. Υπόλοιπο: 70€

# Υπόλοιπο
print("Τελικό υπόλοιπο:", acc.get_balance())  # → 70
