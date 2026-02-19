# Άσκηση: Κληρονομικότητα — Animal → Dog + Cat
# Δυσκολία: ⭐⭐⭐⭐
#
# Δημιούργησε:
#
# 1. Animal (γονική κλάση):
#    - __init__(name, age)
#    - speak() → τυπώνει "..." (γενικός ήχος)
#    - display() → τυπώνει όνομα + ηλικία
#
# 2. Dog (κληρονομεί Animal):
#    - __init__(name, age, breed)
#    - speak() → τυπώνει "Γαβ! Γαβ!"  (override)
#
# 3. Cat (κληρονομεί Animal):
#    - __init__(name, age, indoor)
#      indoor = True/False (εσωτερικού χώρου)
#    - speak() → τυπώνει "Νιάου!"  (override)
#
# d = Dog("Ρεξ", 5, "Λαμπραντόρ")
# c = Cat("Μίτσα", 3, True)
# d.speak()     → "Γαβ! Γαβ!"
# c.speak()     → "Νιάου!"

# Γράψε τον κώδικά σου εδώ
