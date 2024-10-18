import json
import os
import re

# Load JSON data from files
with open('./algoproject/result/amazon_product_list.json', 'r') as am, open('./algoproject/result/ebay_product_list.json', 'r') as eb, open('./algoproject/result/walmart_product_list.json', 'r') as wal:
	amazon = json.load(am)
	ebay = json.load(eb)
	walmart = json.load(wal)

def parse_price(price):
	if isinstance(price, str):
		# Remove currency symbols and non-numeric characters
		price = re.sub(r'[^\d.]', '', price)
		try:
			price = float(price)
		except ValueError:
			price = 0.0
	return price

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
sort_price_amazon = merge_sort(amazon)
sort_price_ebay = merge_sort(ebay)
sort_price_walmart = merge_sort(walmart)
print('Sorted by Price (Merge Sort)')

with open("amazon_sort" + '.json', 'w') as file:
	json.dump(sort_price_amazon, file, indent=4)
print(f"Sorted data saved to '" + "amazon_sort" + ".json'.")

with open("ebay_sort" + '.json', 'w') as file:
	json.dump(sort_price_ebay, file, indent=4)
print(f"Sorted data saved to '" + "ebay_sort" + ".json'.")

with open("walmart_sort" + '.json', 'w') as file:
	json.dump(sort_price_walmart, file, indent=4)
print(f"Sorted data saved to '" + "walmart_sort" + ".json'.")

# Create directory if it doesn't exist and move files
directory_name = "./algoproject/compro_data"
try:
	os.mkdir(directory_name)
	print(f"Directory '{directory_name}' created successfully.")
except FileExistsError:
	print(f"Directory '{directory_name}' already exists.")

os.replace("amazon_sort" + '.json', directory_name + '/' + "amazon_sort" + '.json')
os.replace("ebay_sort" + '.json', directory_name + '/' + "ebay_sort" + '.json')
os.replace("walmart_sort" + '.json', directory_name + '/' + "walmart_sort" + '.json')
print(f"Moved all files to '/{directory_name}'")
