/*
 * Άσκηση: Κόστος ανάπτυξης λογισμικού
 * Επίπεδο: 5
 * 
 * Περιγραφή:
 * Μια εταιρεία Πληροφορικής θέλει να υπολογίσει το μηνιαίο κόστος ανάπτυξης.
 * Κόστος ανά κατηγορία:
 * - Πληροφορικοί (κωδικός 0): 2500€
 * - Λοιπό προσωπικό (κωδικός 1): 1800€
 * 
 * Για 40 άτομα:
 * α) Διαβάζει επαναληπτικά τον κωδικό κατηγορίας (0 ή 1)
 * β) Εμφανίζει το πλήθος των Πληροφορικών
 * γ) Εμφανίζει το συνολικό κόστος του μήνα
 */

#include <iostream>
using namespace std;

int main() {
    int code;
    int countIT = 0;        // Πλήθος Πληροφορικών
    int totalCost = 0;
    
    const int IT_SALARY = 2500;      // Μισθός Πληροφορικού
    const int OTHER_SALARY = 1800;   // Μισθός λοιπού προσωπικού
    const int TOTAL_EMPLOYEES = 40;
    
    cout << "Εισάγετε κωδικό κατηγορίας για 40 υπαλλήλους:" << endl;
    cout << "0 = Πληροφορικός, 1 = Λοιπό προσωπικό" << endl;
    cout << endl;
    
    // Βρόχος for για 40 υπαλλήλους
    for (int i = 1; i <= TOTAL_EMPLOYEES; i++) {
        cout << "Υπάλληλος " << i << " (0/1): ";
        cin >> code;
        
        // Έλεγχος κατηγορίας και υπολογισμός κόστους
        if (code == 0) {
            countIT = countIT + 1;
            totalCost = totalCost + IT_SALARY;
        } else {
            totalCost = totalCost + OTHER_SALARY;
        }
    }
    
    cout << "\n=== ΑΠΟΤΕΛΕΣΜΑΤΑ ===" << endl;
    cout << "Πλήθος Πληροφορικών: " << countIT << endl;
    cout << "Πλήθος Λοιπού προσωπικού: " << TOTAL_EMPLOYEES - countIT << endl;
    cout << "Συνολικό μηνιαίο κόστος: " << totalCost << "€" << endl;
    
    return 0;
}
