# ΑΣΚΗΣΗ: Ισοδυναμία for ↔ while - ΛΥΣΗ

# --- Αρχικός κώδικας (for) ---
# athroisma = 0
# for i in range(1, 11):
#     if i % 2 == 0:
#         athroisma = athroisma + i
# print("Άθροισμα ζυγών:", athroisma)

# --- Ισοδύναμος κώδικας (while) ---
athroisma = 0
i = 1                   # αρχικοποίηση μετρητή
while i <= 10:          # συνθήκη (αντί range(1,11))
    if i % 2 == 0:
        athroisma = athroisma + i
    i = i + 1           # αύξηση μετρητή
print("Άθροισμα ζυγών:", athroisma)

# Αποτέλεσμα: Άθροισμα ζυγών: 30
