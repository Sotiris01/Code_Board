// Try-Catch Exception Handling

#include <iostream>
#include <stdexcept>
using namespace std;

double divide(double a, double b) {
    if (b == 0) {
        throw runtime_error("Division by zero!");
    }
    return a / b;
}

int main() {
    try {
        double result = divide(10, 2);
        cout << "Result: " << result << endl;
        
        result = divide(10, 0);  // This will throw
        cout << "Result: " << result << endl;
    }
    catch (const runtime_error& e) {
        cout << "Error: " << e.what() << endl;
    }
    catch (const exception& e) {
        cout << "Exception: " << e.what() << endl;
    }
    
    cout << "Program continues..." << endl;
    
    return 0;
}
