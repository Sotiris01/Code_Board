# ΑΣΚΗΣΗ: Τηλεφωνικός Κατάλογος (Dictionary) - ΛΥΣΗ

def add_contact(catalog, name, phone):
    catalog[name] = phone
    print("Προστέθηκε:", name, "→", phone)

def find_contact(catalog, name):
    if name in catalog:
        return catalog[name]
    else:
        return "Δεν βρέθηκε"

def delete_contact(catalog, name):
    if name in catalog:
        del catalog[name]
        print("Διαγράφηκε:", name)
        return True
    else:
        print("Δεν βρέθηκε:", name)
        return False

def show_all(catalog):
    print("=== Κατάλογος ===")
    for name in catalog:
        print("  " + name + ": " + catalog[name])
    print("Σύνολο:", len(catalog), "επαφές")

def search_by_phone(catalog, phone):
    for name in catalog:
        if catalog[name] == phone:
            return name
    return "Δεν βρέθηκε"

# Δημιουργία καταλόγου
catalog = {
    "Νίκος": "6981234567",
    "Μαρία": "6949876543",
    "Γιώργος": "6971112233",
    "Ελένη": "6934445566",
    "Κώστας": "6967778899"
}

# Δοκιμές
show_all(catalog)

print("\nΑναζήτηση Μαρία:", find_contact(catalog, "Μαρία"))
print("Αναζήτηση Πέτρος:", find_contact(catalog, "Πέτρος"))

print()
add_contact(catalog, "Σοφία", "6955551234")
delete_contact(catalog, "Νίκος")

print()
show_all(catalog)

print("\nΑναζήτηση τηλ. 6949876543:", search_by_phone(catalog, "6949876543"))
