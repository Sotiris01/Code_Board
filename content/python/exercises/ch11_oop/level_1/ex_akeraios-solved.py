# Άσκηση: Κλάση Akeraios (Δρ.1 §11.5)
# Δυσκολία: ⭐

class Akeraios:
    def __init__(self):
        self.timi = 0

    def Anathese_timi(self, timi):
        self.timi = timi

    def Emfanise_timi(self):
        print(self.timi)


# Δημιουργία αντικειμένου — άρτιος αριθμός
Artios = Akeraios()
Artios.Anathese_timi(14)
Artios.Emfanise_timi()       # → 14

# Δημιουργία αντικειμένου — περιττός αριθμός
Perittos = Akeraios()
Perittos.Anathese_timi(7)
Perittos.Emfanise_timi()     # → 7

# Έλεγχος αρχικής τιμής
Tritos = Akeraios()
Tritos.Emfanise_timi()       # → 0 (αρχική τιμή)
