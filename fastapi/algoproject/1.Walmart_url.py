import json
import requests
import os
from bs4 import BeautifulSoup
from urllib.parse import urlencode
import sys

## Walmart Search Keyword
keyword = sys.argv[1]
print(f"start walmart: {keyword}")

def create_walmart_product_url(product):
	return 'https://www.walmart.com' + product.get('canonicalUrl', '').split('?')[0]

headers={"User-Agent": "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"}
product_url_list = []

## Loop Through Walmart Pages Until No More Products
for page in range(1, 3):
	try:
		payload = {'q': keyword, 'sort': 'best_seller', 'page': page, 'affinityOverride': 'default'}
		walmart_search_url = 'https://www.walmart.com/search?' + urlencode(payload)
		# print("searching from URL : " + walmart_search_url)
		response = requests.get(walmart_search_url, headers=headers)

		if response.status_code == 200:
			html_response = response.text
			soup = BeautifulSoup(html_response, "html.parser")
			script_tag = soup.find("script", {"id": "__NEXT_DATA__"})
			if script_tag is not None:
				json_blob = json.loads(script_tag.get_text())
				product_list = json_blob["props"]["pageProps"]["initialData"]["searchResult"]["itemStacks"][0]["items"]
				product_urls = [create_walmart_product_url(product) for product in product_list]
				product_url_list.extend(product_urls)
				product_url_list = list(set(product_url_list))
				if len(product_urls) == 0:
					break
					
	except Exception as e:
		print('Error', e)
			
# print(product_url_list)

with open('walmart_url.json', 'w') as file:
	json.dump(product_url_list, file, indent=4)
print(f"Scraped data saved to 'walmart_url.json'.")

directory_name = "./algoproject/url"
try:
	os.mkdir(directory_name)
	print(f"Directory '{directory_name}' created successfully.")
except FileExistsError:
	# print(f"Directory '{directory_name}' already exists.")
	print('.')

os.replace('walmart_url.json', './algoproject/url/walmart_url.json')
# print("moved to url/")