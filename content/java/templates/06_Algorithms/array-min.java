// Find Minimum in Array

public class ArrayMin {
    public static int findMin(int[] arr) {
        if (arr.length <= 0) return 0;
        
        int minVal = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < minVal) {
                minVal = arr[i];
            }
        }
        return minVal;
    }
    
    public static void main(String[] args) {
        int[] numbers = {3, 7, 2, 9, 1, 5};
        
        System.out.println("Minimum: " + findMin(numbers));
    }
}
