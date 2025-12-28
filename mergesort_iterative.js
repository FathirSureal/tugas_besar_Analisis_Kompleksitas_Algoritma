function mergeIterative(arr, l, m, r) {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }

    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}

function mergeSortIterative(arr) {
    let n = arr.length;

    for (let size = 1; size < n; size *= 2) {
        for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * size) {
            let mid = Math.min(leftStart + size - 1, n - 1);
            let rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);

            mergeIterative(arr, leftStart, mid, rightEnd);
        }
    }

    return arr;
}
