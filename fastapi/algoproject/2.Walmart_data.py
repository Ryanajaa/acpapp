import json
import requests
import os
from bs4 import BeautifulSoup
from urllib.parse import urlencode


SCRAPEOPS_API_KEY = '92729694-e01a-4372-8d95-b09f8885ac41'

def scrapeops_url(url):
	payload = {'api_key': SCRAPEOPS_API_KEY, 'url': url, 'country': 'us'}
	proxy_url = 'https://proxy.scrapeops.io/v1/?' + urlencode(payload)
	return proxy_url

# Load JSON data from a file
with open('./algoproject/url/walmart_url.json', 'r') as file:
	product_url_list = json.load(file)

product_data_list = []

## Loop Through Walmart Product URL List
for url in product_url_list:
	try:
		response = requests.get(scrapeops_url(url))

		if response.status_code == 200:
			html_response = response.text
			soup = BeautifulSoup(html_response, "html.parser")
			script_tag = soup.find("script", {"id": "__NEXT_DATA__"})
			if script_tag is not None:
				json_blob = json.loads(script_tag.get_text())
				raw_product_data = json_blob["props"]["pageProps"]["initialData"]["data"]["product"]
				product_data_list.append({
					'id':  raw_product_data.get('id'),
					'type':  raw_product_data.get('type'),
					'title':  raw_product_data.get('name'),
					'brand':  raw_product_data.get('brand'),
					'rating':  raw_product_data.get('averageRating'),
					'manufacturerName':  raw_product_data.get('manufacturerName'),
					'shortDescription':  raw_product_data.get('shortDescription'),
					'image':  raw_product_data['imageInfo'].get('thumbnailUrl'),
					'price':  raw_product_data['priceInfo']['currentPrice'].get('price'), 
					'currencyUnit':  raw_product_data['priceInfo']['currentPrice'].get('currencyUnit'),  
					'URL': url
				})
				print("loaded..")
			else:
				print("scrip tag not found")
		# Break the loop when we have 10 elements
		if len(product_data_list) >= 20:
			break

	except Exception as e:
		print('Error', e)
			
	
# print(product_data_list)
with open('walmart_product_list.json', 'w') as file:
	json.dump(product_data_list, file, indent=4)
print(f"Scraped data saved to 'walmart_product_list.json'.")


directory_name = "./algoproject/result"
try:
	os.mkdir(directory_name)
	print(f"Directory '{directory_name}' created successfully.")
except FileExistsError:
	print(f"Directory '{directory_name}' already exists.")

os.replace('walmart_product_list.json', './algoproject/result/walmart_product_list.json')
print("moved to result/")