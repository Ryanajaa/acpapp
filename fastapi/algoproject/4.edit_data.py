import json, os

# Load the JSON data (replace with actual file loading if needed)
with open('./algoproject/compro_data/ebay_sort.json', 'r') as file:
	ebay = json.load(file)

# Remove specified keys and reorder
for item in ebay:
	del item["id"]
	del item["converted_price"]
	del item["seller_name"]
	del item["seller_url"]
	del item["description_url"]
	
	item["price"] = item["price"].replace("US ", "")
	item["price"] = item["price"].replace("/ea", "")
	# Reorder keys
	reordered_item = {
		"title": item["title"],
		"price": item["price"],
		"rating": None,  # Adding "rating": null
		"specs": item["specs"],
		"images": item["images"][0],
		"URL": item["url"]
	}
	# Replace the item with the reordered version
	item.clear()
	item.update(reordered_item)

# Save the modified data back to the file (or display the result)
with open("ebay_mod.json", "w") as file:
	json.dump(ebay, file, indent=4)

os.replace("ebay_mod" + '.json', "./algoproject/compro_data" + '/' + "ebay" + '.json')
# Output the result for visual confirmation

# Load the JSON data (replace with actual file loading if needed)
with open('./algoproject/compro_data/walmart_sort.json', 'r') as file:
	walmart = json.load(file)

# Remove specified keys and reorder
for item in walmart:
	del item["id"]
	del item["type"]
	del item["manufacturerName"]
	del item["shortDescription"]
	del item["currencyUnit"]
	
	item["price"] = "$" + str(item["price"])
	if item["rating"]:
		item["rating"] = str(item["rating"]) + " out of 5 stars"
	else:
		item["rating"] = "0 out of 5 stars"
	# Reorder keys
	reordered_item = {
		"title": item["title"],
		"price": item["price"],
		"rating": item["rating"],
		"specs": item["brand"],
		"images": item["image"],
		"URL": item["URL"]
	}
	# Replace the item with the reordered version
	item.clear()
	item.update(reordered_item)

# Save the modified data back to the file (or display the result)
with open("walmart_mod.json", "w") as file:
	json.dump(walmart, file, indent=4)

os.replace("walmart_mod" + '.json', "./algoproject/compro_data" + '/' + "walmart" + '.json')
# Output the result for visual confirmation

# Load the JSON data (replace with actual file loading if needed)
with open('./algoproject/compro_data/amazon_sort.json', 'r') as file:
	amazon = json.load(file)

# Remove specified keys and reorder
for item in amazon:
	# Reorder keys
	reordered_item = {
		"title": item["title"],
		"price": item["price"],
		"rating": item["rating"],
		"specs": item["specs"],
		"images": item["images"][0],
		"URL": item["URL"]
	}
	# Replace the item with the reordered version
	item.clear()
	item.update(reordered_item)

# Save the modified data back to the file (or display the result)
with open("amazon_mod.json", "w") as file:
	json.dump(amazon, file, indent=4)

os.replace("amazon_mod" + '.json', "./algoproject/compro_data" + '/' + "amazon" + '.json')


os.remove("./algoproject/compro_data/amazon_sort.json")
os.remove("./algoproject/compro_data/ebay_sort.json")
os.remove("./algoproject/compro_data/walmart_sort.json")