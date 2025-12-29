
#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <chrono>

#include "httplib.h"

using namespace std;
using namespace httplib;

/* =========================
   MERGE SORT REKURSIF
========================= */
void mergeRecursive(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);

    int i = 0, j = 0, k = l;

    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j])
            arr[k++] = left[i++];
        else
            arr[k++] = right[j++];
    }

    while (i < left.size())
        arr[k++] = left[i++];

    while (j < right.size())
        arr[k++] = right[j++];
}

void mergeSortRecursive(vector<int>& arr, int l, int r) {
    if (l >= r) return;

    int m = l + (r - l) / 2;
    mergeSortRecursive(arr, l, m);
    mergeSortRecursive(arr, m + 1, r);
    mergeRecursive(arr, l, m, r);
}

/* =========================
   MERGE SORT ITERATIF
========================= */
void mergeIterative(vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;

    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (int i = 0; i < n2; i++)
        R[i] = arr[m + 1 + i];

    int i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j])
            arr[k++] = L[i++];
        else
            arr[k++] = R[j++];
    }

    while (i < n1)
        arr[k++] = L[i++];

    while (j < n2)
        arr[k++] = R[j++];
}

void mergeSortIterative(vector<int>& arr) {
    int n = arr.size();

    for (int curr = 1; curr <= n - 1; curr *= 2) {
        for (int left = 0; left < n - 1; left += 2 * curr) {
            int mid = min(left + curr - 1, n - 1);
            int right = min(left + 2 * curr - 1, n - 1);
            mergeIterative(arr, left, mid, right);
        }
    }
}

/* =========================
   DATA GENERATOR
========================= */
vector<int> generateData(int n) {
    vector<int> data(n);
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> dist(1, 100000);

    for (int i = 0; i < n; i++)
        data[i] = dist(gen);

    return data;
}

/* =========================
   MAIN SERVER
========================= */
int main() {
    Server server;

    server.Post("/sort", [](const Request& req, Response& res) {
        int n = stoi(req.body);

        if (n <= 0 || n > 100000) {
            res.status = 400;
            res.set_content("Invalid input", "text/plain");
            return;
        }

        vector<int> data = generateData(n);
        vector<int> dataRek = data;
        vector<int> dataIter = data;

        /* Rekursif */
        auto startRek = chrono::high_resolution_clock::now();
        mergeSortRecursive(dataRek, 0, n - 1);
        auto endRek = chrono::high_resolution_clock::now();

        /* Iteratif */
        auto startIter = chrono::high_resolution_clock::now();
        mergeSortIterative(dataIter);
        auto endIter = chrono::high_resolution_clock::now();

        long long timeRek =
            chrono::duration_cast<chrono::microseconds>(endRek - startRek).count();

        long long timeIter =
            chrono::duration_cast<chrono::microseconds>(endIter - startIter).count();

        string json =
            "{ \"rekursif\": " + to_string(timeRek) +
            ", \"iteratif\": " + to_string(timeIter) + " }";

        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(json, "application/json");
    });

    cout << "Server running at http://localhost:8080\n";
    server.listen("localhost", 8080);
}
