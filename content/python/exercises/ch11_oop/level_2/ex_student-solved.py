# Άσκηση: Κλάση Student — Βαθμοί & Μέσος Όρος
# Δυσκολία: ⭐⭐

class Student:
    students_count = 0

    def __init__(self, name, grades):
        self.name = name
        self.grades = grades
        Student.students_count += 1

    def greet(self):
        print("Καλημέρα", self.name)

    def average(self):
        return sum(self.grades) / len(self.grades)

    @classmethod
    def get_count(cls):
        return cls.students_count


# Δημιουργία μαθητών
s1 = Student("Μαρία", [18, 19, 20, 17])
s2 = Student("Γιώργος", [15, 16, 14, 17])

# Χαιρετισμός
s1.greet()                        # → Καλημέρα Μαρία

# Μέσοι όροι
print("ΜΟ Μαρίας:", s1.average())     # → 18.5
print("ΜΟ Γιώργου:", s2.average())    # → 15.5

# Πλήθος μαθητών
print("Σύνολο:", Student.get_count())  # → 2
