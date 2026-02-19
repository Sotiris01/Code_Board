# ΑΣΚΗΣΗ: Βιβλιοθήκη Μαθηματικών Συναρτήσεων - ΛΥΣΗ

def my_abs(x):
    if x < 0:
        return -x
    else:
        return x

def my_power(base, exp):
    result = 1
    for i in range(exp):
        result = result * base
    return result

def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result = result * i
    return result

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

# Δοκιμές
print("my_abs(-5) =", my_abs(-5))
print("my_abs(3) =", my_abs(3))

print("my_power(2, 3) =", my_power(2, 3))
print("my_power(5, 0) =", my_power(5, 0))

print("factorial(5) =", factorial(5))
print("factorial(0) =", factorial(0))

print("is_prime(7) =", is_prime(7))
print("is_prime(4) =", is_prime(4))
print("is_prime(2) =", is_prime(2))
print("is_prime(1) =", is_prime(1))
