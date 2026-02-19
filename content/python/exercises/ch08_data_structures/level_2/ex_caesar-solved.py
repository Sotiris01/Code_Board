# ΑΣΚΗΣΗ: Κρυπτογράφηση Caesar - ΛΥΣΗ

def encrypt(text, shift):
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    cipherAlphabet = alphabet[shift:] + alphabet[:shift]

    result = ""
    for char in text:
        # Ψάξε τη θέση στο κανονικό αλφάβητο
        found = False
        for i in range(len(alphabet)):
            if char == alphabet[i]:
                result += cipherAlphabet[i]
                found = True
                break
        if not found:
            result += char    # κενά, σημεία κλπ.
    return result

def decrypt(text, shift):
    # Αποκρυπτογράφηση = κρυπτογράφηση με 26-shift
    return encrypt(text, 26 - shift)

# Δοκιμές
print(encrypt("HELLO", 3))
print(encrypt("HELLO WORLD", 3))
print(decrypt("KHOOR", 3))

# ΕΞΗΓΗΣΗ:
# alphabet:       ABCDEFGHIJKLMNOPQRSTUVWXYZ
# cipherAlphabet: DEFGHIJKLMNOPQRSTUVWXYZABC
# H(7)→K, E(4)→H, L(11)→O, L(11)→O, O(14)→R
# "HELLO" → "KHOOR"
