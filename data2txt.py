import json
import pprint

json_data=open('data.json').read()

data = json.loads(json_data)
data = data['recipes']

f = open('data_text.txt','w')

for recipe in data:
	name = recipe['name']
	qs = recipe['quantities']
	ings = recipe['ingredients']
	text = recipe['text']
	# do the actual printing
	f.write('#RECIPE\n')
	f.write('#NAME:'+name+'\n')
	f.write('#TEXT:'+text+'\n')
	f.write('#INGREDIENTS:\n')
	for i in range(0,len(ings)):
		f.write(str(qs[i]) + ' ' + ings[i]+'\n')