/*
 * ΘΕΜΑ Γ - ΛΥΣΗ
 */

#include <iostream>
using namespace std;

int main() {
    const int MAX_SPOTS = 50;
    int occupied = 0;
    int totalCars = 0;
    double totalRevenue = 0;
    int totalTime = 0;
    int exitCount = 0;
    
    // Για ώρα αιχμής (0-24)
    int entriesPerHour[25] = {0};
    
    int choice;
    int entryHour, exitHour;
    
    do {
        cout << "\n=== PARKING SYSTEM ===" << endl;
        cout << "Θέσεις: " << occupied << "/" << MAX_SPOTS << endl;
        cout << "1. Είσοδος οχήματος" << endl;
        cout << "2. Έξοδος οχήματος" << endl;
        cout << "3. Κατάσταση" << endl;
        cout << "4. Στατιστικά" << endl;
        cout << "0. Τερματισμός" << endl;
        cout << "Επιλογή: ";
        cin >> choice;
        
        if (choice == 1) {
            // Είσοδος
            if (occupied >= MAX_SPOTS) {
                cout << "PARKING ΠΛΗΡΕΣ!" << endl;
            } else {
                do {
                    cout << "Ώρα εισόδου (0-24): ";
                    cin >> entryHour;
                } while (entryHour < 0 || entryHour > 24);
                
                occupied++;
                totalCars++;
                entriesPerHour[entryHour]++;
                
                cout << "Καταχωρήθηκε. Θέση: " << occupied << endl;
            }
            
        } else if (choice == 2) {
            // Έξοδος
            if (occupied <= 0) {
                cout << "Το parking είναι άδειο!" << endl;
            } else {
                do {
                    cout << "Ώρα εισόδου (0-24): ";
                    cin >> entryHour;
                } while (entryHour < 0 || entryHour > 24);
                
                do {
                    cout << "Ώρα εξόδου (0-24): ";
                    cin >> exitHour;
                } while (exitHour < entryHour || exitHour > 24);
                
                int hours = exitHour - entryHour;
                if (hours == 0) hours = 1;  // Ελάχιστη 1 ώρα
                
                double cost = hours * 2.0;
                
                occupied--;
                totalRevenue += cost;
                totalTime += hours;
                exitCount++;
                
                cout << "Διάρκεια: " << hours << " ώρες" << endl;
                cout << "Χρέωση: " << cost << "€" << endl;
            }
            
        } else if (choice == 3) {
            // Κατάσταση
            cout << "\n=== ΚΑΤΑΣΤΑΣΗ ===" << endl;
            cout << "Κατειλημμένες: " << occupied << endl;
            cout << "Διαθέσιμες: " << (MAX_SPOTS - occupied) << endl;
            cout << "Ποσοστό πληρότητας: " << (occupied * 100 / MAX_SPOTS) << "%" << endl;
            
        } else if (choice == 4) {
            // Στατιστικά
            cout << "\n=== ΣΤΑΤΙΣΤΙΚΑ ΗΜΕΡΑΣ ===" << endl;
            cout << "Συνολικές εισόδοι: " << totalCars << endl;
            cout << "Συνολικά έσοδα: " << totalRevenue << "€" << endl;
            
            if (exitCount > 0) {
                cout << "Μέσος χρόνος παραμονής: " << ((double)totalTime / exitCount) << " ώρες" << endl;
            }
            
            // Ώρα αιχμής
            int peakHour = 0;
            int maxEntries = 0;
            for (int h = 0; h <= 24; h++) {
                if (entriesPerHour[h] > maxEntries) {
                    maxEntries = entriesPerHour[h];
                    peakHour = h;
                }
            }
            
            if (maxEntries > 0) {
                cout << "Ώρα αιχμής: " << peakHour << ":00 (" << maxEntries << " εισόδοι)" << endl;
            }
        }
        
    } while (choice != 0);
    
    cout << "Τέλος λειτουργίας." << endl;
    
    return 0;
}
