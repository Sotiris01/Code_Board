// File Input/Output

#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    // Write to file
    ofstream outFile("output.txt");
    if (outFile.is_open()) {
        outFile << "Hello, World!" << endl;
        outFile << "This is a test." << endl;
        outFile.close();
    }
    
    // Read from file
    ifstream inFile("output.txt");
    string line;
    
    if (inFile.is_open()) {
        cout << "File contents:" << endl;
        while (getline(inFile, line)) {
            cout << line << endl;
        }
        inFile.close();
    }
    
    return 0;
}
