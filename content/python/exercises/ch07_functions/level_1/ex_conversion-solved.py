# ΑΣΚΗΣΗ: Συνάρτηση Μετατροπής - ΛΥΣΗ

def celsius_to_fahrenheit(c):
    return c * 9 / 5 + 32

def fahrenheit_to_celsius(f):
    return (f - 32) * 5 / 9

# Δοκιμές
print(celsius_to_fahrenheit(0))
print(celsius_to_fahrenheit(100))
print(fahrenheit_to_celsius(98.6))

print()

# Βρόχος μετατροπών
for c in [0, 20, 37, 100]:
    f = celsius_to_fahrenheit(c)
    print(c, "°C =", f, "°F")
