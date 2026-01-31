// Άσκηση: Πρόβλημα Λεωφορείων (Άσκηση 5 από PDF)
// Υπολόγισε πόσα λεωφορεία γεμίζουν και πόσοι μαθητές περισσεύουν

#include <iostream>
using namespace std;

int main() {
    int students, capacity;
    
    // Διάβασε τον αριθμό μαθητών
    cout << "Πόσοι μαθητές έχει το σχολείο; ";
    cin >> students;
    
    // Διάβασε τη χωρητικότητα του λεωφορείου
    cout << "Πόσες θέσεις έχει το λεωφορείο; ";
    cin >> capacity;
    
    // Υπολόγισε πόσα λεωφορεία γεμίζουν (ακέραια διαίρεση /)
    int full_buses = students / capacity;
    
    // Υπολόγισε πόσοι μαθητές θα μετακινηθούν με άλλο μέσο (υπόλοιπο %)
    int remaining = students % capacity;
    
    cout << "\n=== Αποτελέσματα ===" << endl;
    cout << "Λεωφορεία που γεμίζουν: " << full_buses << endl;
    cout << "Μαθητές με άλλο μέσο: " << remaining << endl;
    
    return 0;
}
