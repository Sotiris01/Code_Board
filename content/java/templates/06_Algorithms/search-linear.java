// Linear Search

public class SearchLinear {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
    
    public static void main(String[] args) {
        int[] numbers = {3, 7, 2, 9, 1, 5};
        int target = 9;
        
        int index = linearSearch(numbers, target);
        
        if (index != -1) {
            System.out.println("Found " + target + " at index " + index);
        } else {
            System.out.println(target + " not found");
        }
    }
}
