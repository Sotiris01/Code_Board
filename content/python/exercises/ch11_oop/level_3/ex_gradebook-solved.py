# Άσκηση: Κλάση GradeBook — Βαθμολόγιο
# Δυσκολία: ⭐⭐⭐

class GradeBook:
    def __init__(self, subject):
        self.subject = subject
        self.grades = []

    def add_grade(self, grade):
        if 0 <= grade <= 20:
            self.grades.append(grade)
        else:
            print("Μη έγκυρος βαθμός!")

    def average(self):
        if len(self.grades) == 0:
            return 0
        return sum(self.grades) / len(self.grades)

    def highest(self):
        if len(self.grades) == 0:
            return 0
        return max(self.grades)

    def lowest(self):
        if len(self.grades) == 0:
            return 0
        return min(self.grades)

    def pass_count(self):
        count = 0
        for g in self.grades:
            if g >= 10:
                count += 1
        return count

    def display(self):
        print("Μάθημα:", self.subject)
        print("Βαθμοί:", self.grades)
        print("ΜΟ:", self.average())
        print("Μέγιστος:", self.highest())
        print("Ελάχιστος:", self.lowest())
        print("Επιτυχίες:", self.pass_count(), "/", len(self.grades))


# Δημιουργία βαθμολογίου
gb = GradeBook("Πληροφορική")
gb.add_grade(18)
gb.add_grade(15)
gb.add_grade(8)
gb.add_grade(20)
gb.add_grade(5)
gb.add_grade(25)     # → Μη έγκυρος βαθμός!

# Εμφάνιση αποτελεσμάτων
gb.display()
# Μάθημα: Πληροφορική
# Βαθμοί: [18, 15, 8, 20, 5]
# ΜΟ: 13.2
# Μέγιστος: 20
# Ελάχιστος: 5
# Επιτυχίες: 3 / 5
