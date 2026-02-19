# Άσκηση: Κληρονομικότητα — Person → Student + Teacher
# Δυσκολία: ⭐⭐⭐⭐

class Person(object):
    def __init__(self, name):
        self._name = name

    def get_name(self):
        return self._name


class Student(Person):
    def __init__(self, name, classatt):
        super(Student, self).__init__(name)
        self.classatt = classatt

    def display(self):
        print("Μαθητής:", self._name, "- Τάξη:", self.classatt)


class Teacher(Person):
    def __init__(self, name, field, years):
        super(Teacher, self).__init__(name)
        self.field = field
        self.years = years

    def display(self):
        print("Καθηγητής:", self._name, "- Ειδικ.:", self.field, "- Έτη:", self.years)


# Δημιουργία αντικειμένων
student1 = Student("Γιάννης", "Β")
student2 = Student("Μαρία", "Γ")
teacher1 = Teacher("Αναστασίου", "ΠΕ02", 11)

# Πρόσβαση σε ιδιότητες
print(student1._name)           # → Γιάννης
print(student1.classatt)        # → Β
print(teacher1._name)           # → Αναστασίου
print(teacher1.field)           # → ΠΕ02
print(teacher1.years)           # → 11

# Μέθοδοι
student1.display()    # → Μαθητής: Γιάννης - Τάξη: Β
teacher1.display()    # → Καθηγητής: Αναστασίου - Ειδικ.: ΠΕ02 - Έτη: 11
