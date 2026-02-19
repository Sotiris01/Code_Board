/*
 * ΑΣΚΗΣΗ: Το Μυστήριο του Καθηγητή
 * 
 * Ουσία: Weighted average με ειδικούς κανόνες (skip <4)
 */

#include <iostream>
using namespace std;

int main() {
    double p1, p2, p3, final_exam;
    double total = 0;
    double weight = 0;
    
    // Είσοδος με επικύρωση
    do {
        cout << "Πρόοδος 1 (0-10): ";
        cin >> p1;
    } while (p1 < 0 || p1 > 10);
    
    do {
        cout << "Πρόοδος 2 (0-10): ";
        cin >> p2;
    } while (p2 < 0 || p2 > 10);
    
    do {
        cout << "Πρόοδος 3 (0-10): ";
        cin >> p3;
    } while (p3 < 0 || p3 > 10);
    
    do {
        cout << "Τελική (0-10): ";
        cin >> final_exam;
    } while (final_exam < 0 || final_exam > 10);
    
    // Υπολογισμός με προσμέτρηση μόνο >= 4
    if (p1 >= 4) {
        total += p1 * 0.15;
        weight += 0.15;
    }
    if (p2 >= 4) {
        total += p2 * 0.15;
        weight += 0.15;
    }
    if (p3 >= 4) {
        total += p3 * 0.15;
        weight += 0.15;
    }
    
    // Αν καμία πρόοδος δεν μέτρησε, η τελική παίρνει 100%
    double finalWeight;
    if (weight == 0) {
        finalWeight = 1.0;
    } else {
        finalWeight = 1.0 - weight;
    }
    
    total += final_exam * finalWeight;
    
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑ ===" << endl;
    cout << "Τελικός βαθμός: " << total << endl;
    
    if (total < 5) {
        cout << "Αξιολόγηση: Απορρίπτεται" << endl;
    } else if (total < 6.5) {
        cout << "Αξιολόγηση: Επαρκώς" << endl;
    } else if (total < 8) {
        cout << "Αξιολόγηση: Λίαν Καλώς" << endl;
    } else {
        cout << "Αξιολόγηση: Άριστα" << endl;
    }
    
    return 0;
}
