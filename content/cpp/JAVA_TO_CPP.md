# Οδηγός Μετάβασης: Από Java σε C++
> Ένας πρακτικός οδηγός για προγραμματιστές Java που μαθαίνουν C++, βασισμένος στα διαθέσιμα templates του Code Board.

## 1. Βασική Δομή (01_Basics)
Στη Java, όλα είναι κλάσεις. Στη C++, ο κώδικας μπορεί να υπάρχει και εκτός κλάσεων (procedural programming).

### Main Function (`program`, `main`)
*   **Java**: `public static void main(String[] args)` μέσα σε μια κλάση.
*   **C++**: `int main()` είναι μια ανεξάρτητη συνάρτηση. Επιστρέφει `0` για επιτυχία.

| Χαρακτηριστικό | Java (`main.java`) | C++ (`main.cpp`) |
| :--- | :--- | :--- |
| **Είσοδος/Έξοδος** | `System.out.println("...")` | `cout << "..." << endl;` |
| **Imports** | `import java.util.*;` | `#include <iostream>` |
| **Namespaces** | `package my.package;` | `using namespace std;` (συνήθως) |

## 2. Ροή Ελέγχου (02_Flow_Control, 03_Loops)
Η σύνταξη είναι **σχεδόν πανομοιότυπη** (99%).
*   `if`, `else`, `switch`, `while`, `do-while`, `for` λειτουργούν ακριβώς το ίδιο.
*   Δείτε τα `if-else` και `loops` templates και στις δύο γλώσσες – δεν θα βρείτε διαφορές στη λογική.

## 3. Δομές Δεδομένων (04_Data_Structures)
Εδώ εντοπίζονται οι σημαντικότερες διαφορές στη διαχείριση μνήμης.

### Πίνακες (`array`)
*   **Java**: Οι πίνακες ξέρουν το μέγεθός τους (`arr.length`).
*   **C++**: Οι απλοί πίνακες (C-style arrays) **δεν** ξέρουν το μέγεθός τους. Πρέπει να το υπολογίζετε (`sizeof(arr)/sizeof(arr[0])`) ή να το περνάτε ως δεύτερη παράμετρο στις συναρτήσεις (δείτε το `array-max`).

### Δυναμικοί Πίνακες (`vector` vs `ArrayList`)
Αντί για `ArrayList`, η C++ χρησιμοποιεί `std::vector`.

| Λειτουργία | Java (`ArrayList`) | C++ (`vector`) |
| :--- | :--- | :--- |
| **Δήλωση** | `ArrayList<Integer> list = new ArrayList<>();` | `vector<int> list;` |
| **Προσθήκη** | `list.add(5);` | `list.push_back(5);` |
| **Πρόσβαση** | `list.get(0);` | `list[0]` ή `list.at(0)` |
| **Μέγεθος** | `list.size();` | `list.size()` |

### Pointers (`pointers.cpp`) - *New Concept!*
Στη Java, όλα τα αντικείμενα είναι references (δείκτες που διαχειρίζεται το σύστημα).
Στη C++, έχετε άμεση πρόσβαση στη μνήμη:
*   `&x`: Η διεύθυνση μνήμης του x.
*   `*ptr`: Η τιμή που βρίσκεται στη διεύθυνση ptr.
*   Δείτε το `04_Data_Structures/pointers.cpp` προσεκτικά, καθώς δεν υπάρχει αντίστοιχο στη Java.

### Structs (`struct.cpp`)
Η C++ έχει `struct`, το οποίο είναι ουσιαστικά μια `class` όπου όλα είναι `public` από προεπιλογή. Στη Java θα φτιάχνατε μια κλάση μόνο με πεδία (Data Class).

## 4. Συναρτήσεις (05_Functions)
*   **Java**: Μέθοδοι (Methods) που ανήκουν πάντα σε κλάση.
*   **C++**: Συναρτήσεις (Functions) που μπορεί να είναι αυτόνομες.
*   **Παράμετροι**:
    *   Στο `function-params.cpp` θα δείτε **Default Parameters** (`string s = "Hello"`), κάτι που η Java δεν υποστηρίζει (η Java χρησιμοποιεί Method Overloading για το ίδιο αποτέλεσμα).

## 5. Αλγόριθμοι (06_Algorithms)
Η λογική στα templates (`sort`, `search`, `factorial`) είναι ίδια.
**Προσοχή στο πέρασμα παραμέτρων**:
*   Στο `sort-bubble.cpp` (C++), αν θέλαμε να αλλάξουμε τιμές σε μεταβλητές (swap), χρησιμοποιούμε αναφορές (`&`) ή pointers.
*   Στη Java, τα primitives περνάνε by value, τα objects by reference-value.

## 6. Αντικειμενοστρέφεια (07_OOP)
Δείτε τη σύγκριση `class.cpp` vs `class.java`.

| Έννοια | Java | C++ |
| :--- | :--- | :--- |
| **Δήλωση** | `class Person { ... }` | `class Person { ... };` (Προσοχή στο `;` στο τέλος!) |
| **Modifiers** | `public String name;` | `public:` (section) |
| **Methods** | Υλοποίηση μέσα στην κλάση. | Μπορεί να είναι εκτός (με `Person::method`). |
| **Destructor** | Garbage Collector (αυτόματο). | `~Person()` (χειροκίνητο/RAII). |

## 7. Αρχεία & Σφάλματα (08_Files_Errors)

### Exceptions (`try-catch`)
*   Η δομή είναι ίδια.
*   Η Java έχει "Checked Exceptions" (πρέπει να τα δηλώσεις). Η C++ όχι.

### Αρχεία (`file-io`)
*   **Java**: `Scanner`, `BufferedReader`, `PrintWriter`.
*   **C++**: `ifstream` (Input File Stream), `ofstream` (Output File Stream).
*   Στη C++, τα streams κλείνουν αυτόματα όταν βγουν από το scope (RAII), αν και το `close()` είναι καλή πρακτική.
