// ArrayList Operations (Dynamic Array)

import java.util.ArrayList;

public class ArrayListDemo {
    public static void main(String[] args) {
        // Create ArrayList
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(1);
        numbers.add(2);
        numbers.add(3);
        numbers.add(4);
        numbers.add(5);
        
        // Add elements
        numbers.add(6);
        numbers.add(0, 0);  // Insert at beginning
        
        // Remove elements
        numbers.remove(numbers.size() - 1);  // Remove last
        
        // Access elements
        System.out.println("First: " + numbers.get(0));
        System.out.println("Last: " + numbers.get(numbers.size() - 1));
        System.out.println("Size: " + numbers.size());
        
        // Print all elements
        System.out.print("ArrayList: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
