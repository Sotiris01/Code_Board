# ΑΣΚΗΣΗ: Έλεγχος Παρενθέσεων (Stack) - ΛΥΣΗ

def createStack():
    return []

def isEmpty(stack):
    return len(stack) == 0

def push(stack, item):
    stack.append(item)

def pop(stack):
    return stack.pop()

def check_brackets(expression):
    stack = createStack()
    openers = "([{"
    closers = ")]}"

    for char in expression:
        if char in openers:
            push(stack, char)
        elif char in closers:
            if isEmpty(stack):
                return False
            top = pop(stack)
            # Ελέγχει αν ταιριάζουν
            if char == ")" and top != "(":
                return False
            if char == "]" and top != "[":
                return False
            if char == "}" and top != "{":
                return False

    return isEmpty(stack)

# Δοκιμές
print(check_brackets("(a + b)"))
print(check_brackets("((a + b) * c)"))
print(check_brackets("(a + b"))
print(check_brackets("a + b)"))
print(check_brackets("{[()]}"))
print(check_brackets("{[(])}"))

# ΕΞΗΓΗΣΗ:
# "(a + b)":  push ( → pop για ) → ταιριάζει √
# "(a + b":   push ( → στοίβα ΟΧΙ κενή → False
# "a + b)":   pop σε κενή στοίβα → False
# "{[(])}":   push {, [, ( → pop για ] → ΔΕΝ ταιριάζει
