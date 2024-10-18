import json
import os
import re

# Load JSON data from files
with open('./algoproject/result/amazon_product_list.json', 'r') as f1, open('./algoproject/result/ebay_product_list.json', 'r') as f2, open('./algoproject/result/walmart_product_list.json', 'r') as f3:
	data1 = json.load(f1)
	data2 = json.load(f2)
	data3 = json.load(f3)

# Combine all data
all_data = data1 + data2 + data3

def parse_price(price):
	if isinstance(price, str):
		# Remove currency symbols and non-numeric characters
		price = re.sub(r'[^\d.]', '', price)
		try:
			price = float(price)
		except ValueError:
			price = 0.0
	return price

# Function to sort by name using Quick Sort
def quick_sort(arr):
	if len(arr) <= 1:
		return arr
	pivot = arr[len(arr) // 2]
	left = [x for x in arr if x['title'] < pivot['title']]
	middle = [x for x in arr if x['title'] == pivot['title']]
	right = [x for x in arr if x['title'] > pivot['title']]
	return quick_sort(left) + middle + quick_sort(right)

# Function to sort by price using Merge Sort
def merge_sort(arr):
	if len(arr) <= 1:
		return arr
	mid = len(arr) // 2
	left = merge_sort(arr[:mid])
	right = merge_sort(arr[mid:])
	return merge(left, right)

def merge(left, right):
	result = []
	while left and right:
		if parse_price(left[0]['price']) < parse_price(right[0]['price']):
			result.append(left.pop(0))
		else:
			result.append(right.pop(0))
	result.extend(left if left else right)
	return result

print("----------------------------------\n")
sorted_by_name = quick_sort(all_data)
print('Sorted by Name (Quick Sort)')
print("Explanation: Quick Sort is efficient for large datasets, having an average-case time complexity of O(n log n). It’s suitable for sorting by name due to its divide-and-conquer approach.")
sort_name = "Sorted_by_Name_(Quick Sort)"

with open(sort_name + '.json', 'w') as file:
	json.dump(sorted_by_name, file, indent=4)
print(f"Scraped data saved to '" + sort_name + ".json'.\n")

print("----------------------------------\n")
sorted_by_name_builtin = sorted(all_data, key=lambda x: x['title'])
print('Buildin - Sorted by Name (Tim Sort)')
print("Explanation: Tim Sort is a hybrid stable sorting algorithm derived from merge sort and insertion sort. It’s the algorithm behind Python’s built-in sort function, chosen for its efficiency and speed on real-world data.")
sort_name_builtin = "Buildin_Sorted_by_Name_(Tim_Sort)"

with open(sort_name_builtin + '.json', 'w') as file:
	json.dump(sorted_by_name_builtin, file, indent=4)
print(f"Scraped data saved to '" + sort_name_builtin + ".json'.\n")

print("----------------------------------\n")
sorted_by_price = merge_sort(all_data)
print('Sorted by Price (Merge Sort)')
print("Explanation: Merge Sort has a stable time complexity of O(n log n) and is beneficial for sorting by price because it consistently splits and merges arrays, ensuring all elements are in order.")
sort_name_price = "Sorted_by_Price_(Merge_Sort)"

with open(sort_name_price + '.json', 'w') as file:
	json.dump(sorted_by_price, file, indent=4)
print(f"Scraped data saved to '" + sort_name_price + ".json'.\n")

# Create directory if it doesn't exist and move files
directory_name = "./algoproject/sorted"
try:
	os.mkdir(directory_name)
	print(f"Directory '{directory_name}' created successfully.")
except FileExistsError:
	print(f"Directory '{directory_name}' already exists.")

os.replace(sort_name + '.json', directory_name + '/' + sort_name + '.json')
os.replace(sort_name_builtin + '.json', directory_name + '/' + sort_name_builtin + '.json')
os.replace(sort_name_price + '.json', directory_name + '/' + sort_name_price + '.json')
print(f"Moved all files to '/{directory_name}'")
