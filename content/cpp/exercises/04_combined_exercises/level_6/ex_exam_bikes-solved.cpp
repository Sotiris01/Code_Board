/*
 * ΘΕΜΑ Ε - ΛΥΣΗ
 */

#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    const int MAX_BIKES = 20;
    const int MAX_HOURS = 8;
    
    int available = MAX_BIKES;
    int totalRentals = 0;
    double totalRevenue = 0;
    int totalHours = 0;
    int hoursCount[9] = {0};  // 1-8 ώρες
    
    int choice;
    int bikes, startHour, endHour;
    
    do {
        cout << "\n=== BIKE RENTAL ===" << endl;
        cout << "Διαθέσιμα: " << available << "/" << MAX_BIKES << endl;
        cout << "1. Νέα ενοικίαση" << endl;
        cout << "2. Επιστροφή" << endl;
        cout << "3. Διαθεσιμότητα" << endl;
        cout << "4. Κλείσιμο ημέρας" << endl;
        cout << "0. Έξοδος" << endl;
        cout << "Επιλογή: ";
        cin >> choice;
        
        if (choice == 1) {
            // Νέα ενοικίαση
            if (available == 0) {
                cout << "Δεν υπάρχουν διαθέσιμα ποδήλατα!" << endl;
                continue;
            }
            
            do {
                cout << "Πόσα ποδήλατα (1-3): ";
                cin >> bikes;
            } while (bikes < 1 || bikes > 3);
            
            if (bikes > available) {
                cout << "Διαθέσιμα μόνο " << available << endl;
                continue;
            }
            
            do {
                cout << "Ώρα έναρξης (8-20): ";
                cin >> startHour;
            } while (startHour < 8 || startHour > 20);
            
            available -= bikes;
            cout << "Ενοικίαση " << bikes << " ποδηλάτων από " << startHour << ":00" << endl;
            
        } else if (choice == 2) {
            // Επιστροφή
            if (available == MAX_BIKES) {
                cout << "Όλα τα ποδήλατα είναι εδώ!" << endl;
                continue;
            }
            
            do {
                cout << "Πόσα ποδήλατα επιστρέφονται: ";
                cin >> bikes;
            } while (bikes < 1 || bikes > (MAX_BIKES - available));
            
            do {
                cout << "Ώρα έναρξης ενοικίασης: ";
                cin >> startHour;
            } while (startHour < 8 || startHour > 20);
            
            do {
                cout << "Ώρα επιστροφής: ";
                cin >> endHour;
            } while (endHour <= startHour || endHour > 22);
            
            int hours = endHour - startHour;
            if (hours > MAX_HOURS) hours = MAX_HOURS;
            
            // Υπολογισμός κόστους
            double cost = 0;
            if (hours <= 3) {
                cost = hours * 3.0;
            } else {
                cost = 3 * 3.0 + (hours - 3) * 2.0;
            }
            cost = cost * bikes;
            
            // Έκπτωση
            if (cost > 15) {
                cout << "Έκπτωση 10%!" << endl;
                cost = cost * 0.9;
            }
            
            available += bikes;
            totalRentals++;
            totalRevenue += cost;
            totalHours += hours * bikes;
            if (hours >= 1 && hours <= 8) hoursCount[hours]++;
            
            cout << "\n=== ΑΠΟΔΕΙΞΗ ===" << endl;
            cout << "Ποδήλατα: " << bikes << endl;
            cout << "Διάρκεια: " << hours << " ώρες" << endl;
            cout << fixed << setprecision(2);
            cout << "Κόστος: " << cost << "€" << endl;
            
        } else if (choice == 3) {
            // Διαθεσιμότητα
            cout << "\n=== ΔΙΑΘΕΣΙΜΟΤΗΤΑ ===" << endl;
            cout << "Διαθέσιμα: " << available << endl;
            cout << "Ενοικιασμένα: " << (MAX_BIKES - available) << endl;
            
        } else if (choice == 4) {
            // Κλείσιμο ημέρας
            cout << "\n=== ΚΛΕΙΣΙΜΟ ΗΜΕΡΑΣ ===" << endl;
            cout << "Συνολικές ενοικιάσεις: " << totalRentals << endl;
            cout << fixed << setprecision(2);
            cout << "Συνολικά έσοδα: " << totalRevenue << "€" << endl;
            
            if (totalRentals > 0) {
                cout << "Έσοδα/ενοικίαση: " << (totalRevenue / totalRentals) << "€" << endl;
            }
            
            cout << "Συνολικές ώρες: " << totalHours << endl;
            
            // Δημοφιλέστερη διάρκεια
            int maxH = 0, popularDuration = 0;
            for (int h = 1; h <= 8; h++) {
                if (hoursCount[h] > maxH) {
                    maxH = hoursCount[h];
                    popularDuration = h;
                }
            }
            
            if (maxH > 0) {
                cout << "Δημοφιλέστερη διάρκεια: " << popularDuration << " ώρες" << endl;
            }
        }
        
    } while (choice != 0);
    
    cout << "Ευχαριστούμε!" << endl;
    
    return 0;
}
