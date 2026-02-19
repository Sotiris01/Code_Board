# Άσκηση: Κληρονομικότητα — Person → Student + Teacher
# Δυσκολία: ⭐⭐⭐⭐
#
# Δημιούργησε τις εξής κλάσεις:
#
# 1. Person (γονική κλάση):
#    - __init__(name) → self._name = name
#
# 2. Student (κληρονομεί Person):
#    - __init__(name, classatt) → καλεί super().__init__(name)
#      + self.classatt = classatt
#
# 3. Teacher (κληρονομεί Person):
#    - __init__(name, field, years) → καλεί super().__init__(name)
#      + self.field = field, self.years = years
#
# student1 = Student("Γιάννης", "Β")
# teacher1 = Teacher("Αναστασίου", "ΠΕ02", 11)
# print(student1._name)    → Γιάννης
# print(teacher1.field)    → ΠΕ02

# Γράψε τον κώδικά σου εδώ
