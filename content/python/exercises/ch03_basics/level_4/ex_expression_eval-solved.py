# ΑΣΚΗΣΗ: Αποτίμηση Σύνθετων Εκφράσεων - ΛΥΣΗ

a = 10
b = 3
c = 2.0

print(a + b * c)                # 16.0  (b*c=6.0, 10+6.0=16.0)
print((a + b) * c)              # 26.0  (13*2.0=26.0)
print(a / b)                    # 3.3333...  (πραγματική διαίρεση → float)
print(a // b)                   # 3     (ακέραια διαίρεση)
print(a % b)                    # 1     (10 = 3*3 + 1)
print(a ** b % 7)               # 6     (1000 % 7 = 6)
print(2 * (a % b) + 4 // (1 + b))  # 3  (2*1 + 4//4 = 2+1 = 3)
print(a > 5 and b < 5)         # True  (True and True)
print(not (a == 10) or b > 2)  # True  (False or True)
print(a != b and not c == 2)   # False (True and not True = True and False)
