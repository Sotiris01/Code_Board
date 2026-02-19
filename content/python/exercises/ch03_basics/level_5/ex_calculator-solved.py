# ΑΣΚΗΣΗ: Σύνθετη Αριθμομηχανή - ΛΥΣΗ

a = float(input("Δώσε αριθμό a: "))
b = float(input("Δώσε αριθμό b: "))
praxi = input("Δώσε πράξη (+, -, *, /, //, %, **): ")

if praxi == "+":
    print(a, "+", b, "=", a + b)
elif praxi == "-":
    print(a, "-", b, "=", a - b)
elif praxi == "*":
    print(a, "*", b, "=", a * b)
elif praxi == "/":
    if b == 0:
        print("Σφάλμα: Διαίρεση με μηδέν!")
    else:
        print(a, "/", b, "=", a / b)
elif praxi == "//":
    if b == 0:
        print("Σφάλμα: Διαίρεση με μηδέν!")
    else:
        print(a, "//", b, "=", a // b)
elif praxi == "%":
    if b == 0:
        print("Σφάλμα: Διαίρεση με μηδέν!")
    else:
        print(a, "%", b, "=", a % b)
elif praxi == "**":
    print(a, "**", b, "=", a ** b)
else:
    print("Άγνωστη πράξη!")
