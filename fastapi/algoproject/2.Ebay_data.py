import json
import httpx
import os
from parsel import Selector

# Read URLs from JSON file
with open('./algoproject/url/ebay_url.json', 'r') as file:
	urls = json.load(file)

# Establish our HTTP2 client with browser-like headers
session = httpx.Client(
	headers={
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35",
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
		"Accept-Language": "en-US,en;q=0.9",
		"Accept-Encoding": "gzip, deflate, br",
	},
	http2=True,
	follow_redirects=True
)

def parse_product(response: httpx.Response) -> dict:
	"""Parse eBay's product listing page for core product data"""
	sel = Selector(response.text)
	css_join = lambda css: "".join(sel.css(css).getall()).strip()  # join all selected elements
	css = lambda css: sel.css(css).get("").strip()  # take first selected element and strip of leading/trailing spaces
	item = {}
	item["url"] = css('link[rel="canonical"]::attr(href)')
	item["id"] = item["url"].split("/itm/")[1].split("?")[0]  # we can take ID from the URL
	item["price"] = css(".x-price-primary>span::text")
	item["converted_price"] = css(".x-price-approx__price ::text")  # eBay automatically converts price for some regions
	item["title"] = css_join("h1 span::text")
	item["seller_name"] = sel.xpath("//div[contains(@class,'info__about-seller')]/a/span/text()").get()
	item["seller_url"] = sel.xpath("//div[contains(@class,'info__about-seller')]/a/@href").get().split("?")[0]
	item["images"] = sel.css('.ux-image-filmstrip-carousel-item.image img::attr("src")').getall()  # carousel images
	item["images"].extend(sel.css('.ux-image-carousel-item.image img::attr("src")').getall())  # main image
	item["description_url"] = css("iframe#desc_ifr::attr(src)")

	# feature details from the description table:
	features = {}
	feature_table = sel.css("div.ux-layout-section--features")
	for feature in feature_table.css("dl.ux-labels-values"):
		label = "".join(feature.css(".ux-labels-values__labels-content > div > span::text").getall()).strip(":\n ")
		value = "".join(feature.css(".ux-labels-values__values-content > div > span *::text").getall()).strip(":\n ")
		features[label] = value
	item["specs"] = features

	return item

# Fetch and parse product data for each URL in the list
all_product_data = []
for url in urls:
	response = session.get(url)
	product_data = parse_product(response)
	if product_data["price"][:3] == "US " :
		all_product_data.append(product_data)

	if len(all_product_data) >= 20:
		break
	print("loading...")

# Write the results to a JSON file
with open('ebay_product_list.json', 'w') as file:
	json.dump(all_product_data, file, indent=4)
print(f"Data has been written to ebay_product_list.json")

directory_name = "./algoproject/result"
try:
	os.mkdir(directory_name)
	print(f"Directory '{directory_name}' created successfully.")
except FileExistsError:
	print(f"Directory '{directory_name}' already exists.")

os.replace('ebay_product_list.json', './algoproject/result/ebay_product_list.json')
print("moved to result/")