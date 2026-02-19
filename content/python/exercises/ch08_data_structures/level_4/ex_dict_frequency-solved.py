# ΑΣΚΗΣΗ: Dictionary — Συχνότητα Χαρακτήρων - ΛΥΣΗ

def char_frequency(text):
    freq = {}
    for char in text:
        if char in freq:
            freq[char] += 1
        else:
            freq[char] = 1
    return freq

# Δοκιμή 1
text1 = "hello world"
freq1 = char_frequency(text1)
print("Κείμενο:", text1)
print("Dictionary:", freq1)
print()
for char in freq1:
    print("'" + char + "' →", freq1[char])

print()

# Δοκιμή 2
text2 = "abracadabra"
freq2 = char_frequency(text2)
print("Κείμενο:", text2)
for char in freq2:
    print("'" + char + "' →", freq2[char])
