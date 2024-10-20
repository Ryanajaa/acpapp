import requests
from bs4 import BeautifulSoup
import json
import os
from urllib.parse import urlencode
import sys

# Initial setup
keyword = sys.argv[1]
print(f"start ebay: {keyword}")

sort = "best_match"
items_per_page = 10
SORTING_MAP = {
	"best_match": 12,
	"ending_soonest": 1,
	"newly_listed": 10,
}

# Create eBay request URL
base_url = "https://www.ebay.com/sch/i.html?"
query_params = {
	"_nkw": keyword,
	"_ipg": items_per_page,
	"_sop": SORTING_MAP[sort],
}
current_url = base_url + urlencode(query_params)

# Main scraping process
product_url_list = []

for i in range(1, 2):
	response = requests.get(current_url)
	soup = BeautifulSoup(response.text, "html.parser")
	url_on_page = []

	for item in soup.find_all("li", class_="s-item"):
		url = item.find("a", class_="s-item__link")
		product_url = url["href"].split("?")[0] if url else "Not available"
		if product_url != "https://ebay.com/itm/123456" and product_url not in url_on_page: #Fake link generated by ebay //Exclude it out
			url_on_page.append(product_url)

	product_url_list.extend(url_on_page)
	product_url_list = list(set(product_url_list))
	# print(url_on_page)

	next_page_button = soup.select_one("a.pagination__next")
	next_page_url = next_page_button["href"] if next_page_button else None
	current_url = next_page_url
	# print(next_page_url)

# Write results to JSON
with open("ebay_url.json", 'w') as file:
	json.dump(product_url_list, file, indent=4)
print(f"Scraped data saved to 'ebay_url.json'.")

directory_name = "./algoproject/url"
try:
	os.mkdir(directory_name)
	# print(f"Directory '{directory_name}' created successfully.")
except FileExistsError:
	# print(f"Directory '{directory_name}' already exists.")
	print('.')
	
os.replace('ebay_url.json', './algoproject/url/ebay_url.json')
# print("moved to url/")