# ΑΣΚΗΣΗ: Ανάλυση Κειμένου - ΛΥΣΗ

def count_words(text):
    words = text.split(" ")
    return len(words)

def word_frequency(text):
    words = text.split(" ")
    freq = {}
    for word in words:
        w = word.lower()
        if w in freq:
            freq[w] += 1
        else:
            freq[w] = 1
    return freq

def most_common(freq_dict):
    max_word = ""
    max_count = 0
    for word in freq_dict:
        if freq_dict[word] > max_count:
            max_count = freq_dict[word]
            max_word = word
    return max_word

def unique_words(text):
    words = text.split(" ")
    result = []
    for word in words:
        w = word.lower()
        found = False
        for r in result:
            if r == w:
                found = True
        if not found:
            result.append(w)
    return result

# Κύριο πρόγραμμα
text = "To be or not to be that is the question"

print("Κείμενο:", text)
print("Λέξεις:", count_words(text))

uniq = unique_words(text)
print("Μοναδικές:", len(uniq), "→", uniq)

freq = word_frequency(text)
common = most_common(freq)
print("Συχνότερη:", common, "(" + str(freq[common]) + " φορές)")

print("\nΣυχνότητα:")
for word in freq:
    print("  " + word + ": " + str(freq[word]))
