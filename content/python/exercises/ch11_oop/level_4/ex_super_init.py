# Άσκηση: Κατανόηση super().__init__()
# Δυσκολία: ⭐⭐⭐⭐
#
# Δίνεται:
# class Vehicle:
#     def __init__(self, make, year):
#         ...
#     def info(self):
#         ...
#
# Δημιούργησε δύο υποκλάσεις:
#
# 1. Car(Vehicle):
#    - __init__(make, year, doors) → super().__init__(make, year)
#      + self.doors = doors
#    - info() → τυπώνει make, year, doors
#
# 2. Motorcycle(Vehicle):
#    - __init__(make, year, engine_cc) → super().__init__(make, year)
#      + self.engine_cc = engine_cc
#    - info() → τυπώνει make, year, engine_cc
#
# car = Car("Toyota", 2020, 4)
# moto = Motorcycle("Honda", 2022, 600)
# car.info()
# moto.info()

# Γράψε τον κώδικά σου εδώ
