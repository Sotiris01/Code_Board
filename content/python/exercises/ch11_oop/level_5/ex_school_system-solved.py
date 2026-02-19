# Άσκηση: Σχολείο — Person → Student + Teacher + Μετρητής
# Δυσκολία: ⭐⭐⭐⭐⭐

class Person(object):
    total = 0

    def __init__(self, name, age):
        self.name = name
        self.age = age
        Person.total += 1

    def display(self):
        print(self.name, "- Ηλικία:", self.age)

    @classmethod
    def get_total(cls):
        return cls.total


class Student(Person):
    def __init__(self, name, age, grade_class, grades):
        super(Student, self).__init__(name, age)
        self.grade_class = grade_class
        self.grades = grades

    def average(self):
        if len(self.grades) == 0:
            return 0
        return sum(self.grades) / len(self.grades)

    def is_passing(self):
        return self.average() >= 10

    def display(self):
        status = "ΠΕΡΝΑΕΙ" if self.is_passing() else "ΔΕΝ ΠΕΡΝΑΕΙ"
        print("Μαθητής:", self.name, "- Τάξη:", self.grade_class,
              "- ΜΟ:", self.average(), "-", status)


class Teacher(Person):
    def __init__(self, name, age, subject, years):
        super(Teacher, self).__init__(name, age)
        self.subject = subject
        self.years = years

    def is_senior(self):
        return self.years >= 10

    def display(self):
        level = "Senior" if self.is_senior() else "Junior"
        print("Καθηγητής:", self.name, "- Μάθημα:", self.subject,
              "- Έτη:", self.years, "-", level)


# --- Δημιουργία ---
students = [
    Student("Μαρία", 17, "Γ", [18, 19, 20, 17]),
    Student("Γιώργος", 16, "Β", [8, 7, 9, 6]),
    Student("Ελένη", 17, "Γ", [15, 14, 12, 16]),
]

teachers = [
    Teacher("Αναστασίου", 45, "Πληροφορική", 15),
    Teacher("Παπαδόπουλος", 30, "Μαθηματικά", 5),
]

# Εμφάνιση μαθητών
print("=== Μαθητές ===")
for s in students:
    s.display()

# Εμφάνιση καθηγητών
print("\n=== Καθηγητές ===")
for t in teachers:
    t.display()

# Σύνολο Person
print("\nΣυνολικά άτομα:", Person.get_total())  # → 5

# Ποιοι μαθητές περνούν;
print("\nΠερνούν:")
for s in students:
    if s.is_passing():
        print(" ", s.name, "- ΜΟ:", s.average())
