# ΑΣΚΗΣΗ: Κρυπτογράφηση Caesar
#
# Η κρυπτογράφηση Caesar μετατοπίζει
# κάθε γράμμα κατά Ν θέσεις.
# Π.χ. μετατόπιση 3:
# A→D, B→E, C→F, ..., X→A, Y→B, Z→C
#
# 1. Δίνεται:
#    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
#
# 2. Φτιάξε τον κρυπτογραφημένο αλφάβητο:
#    cipherAlphabet = alphabet[3:] + alphabet[:3]
#    → "DEFGHIJKLMNOPQRSTUVWXYZABC"
#
# 3. Ορίσε encrypt(text, shift) που:
#    - Για κάθε χαρακτήρα βρίσκει τη θέση
#      στο κανονικό αλφάβητο
#    - Τον αντικαθιστά με αυτόν στην ίδια
#      θέση του cipher αλφαβήτου
#    - Αν ΔΕΝ είναι γράμμα, τον αφήνει
#
# 4. Δοκίμασε:
#    print(encrypt("HELLO", 3)) → "KHOOR"

# Γράψε τον κώδικά σου εδώ

