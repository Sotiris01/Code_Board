# ΑΣΚΗΣΗ: Έλεγχος Email - ΛΥΣΗ

def is_valid_email(email):
    # α) Μέτρα "@"
    at_count = 0
    at_pos = -1
    for i in range(len(email)):
        if email[i] == "@":
            at_count += 1
            at_pos = i

    # Πρέπει ακριβώς 1 "@"
    if at_count != 1:
        return False

    # β) Πριν το "@" τουλάχιστον 1 χαρακτήρας
    if at_pos == 0:
        return False

    # γ) Μετά το "@" τουλάχιστον 1 char + "."
    after = email[at_pos + 1:]
    if len(after) == 0:
        return False

    has_dot = False
    for char in after:
        if char == ".":
            has_dot = True
    if not has_dot:
        return False

    return True

# Δοκιμές
print(is_valid_email("user@mail.com"))
print(is_valid_email("test@gmail.gr"))
print(is_valid_email("invalid"))
print(is_valid_email("@mail.com"))
print(is_valid_email("user@"))
print(is_valid_email("a@@b.com"))
