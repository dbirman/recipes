import json

json_data=open('data.json').read()

data = json.loads(json_data)
data = data['recipes']

f = open('data_text.txt','w')

groups = ['Breakfast','Lunch','Dinner','Dessert']

for recipe in data:
	group = recipe['group']
	name = recipe['name']
	qs = recipe['quantities']
	ings = recipe['ingredients']
	text = recipe['text']
	# do the actual printing
	f.write('#RECIPE\n')
	f.write("#GROUP\n"+groups[int(group)]+"\n")
	f.write('#NAME\n'+name+'\n')
	f.write('#TEXT\n')
	for line in text.split("<br>"):
		f.write(line+'\n')
	f.write('#INGREDIENTS\n')
	for i in range(0,len(ings)):
		f.write(str(qs[i]) + ' ' + ings[i]+'\n')