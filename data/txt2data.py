import json

f = open('data_text.txt','r').read()
f.encode("utf-8")
lines = f.splitlines()

groups = ['Breakfast','Lunch','Dinner','Dessert']

recipes = []
recipe = {}
recipe['quantities'] = []
recipe['ingredients'] = []
flags = 0
for line in lines:
	print(line)
	skip = 0
	if (line=="#RECIPE"):
		print("Found new recipe")
		if flags > 0:
			recipes.append(recipe)
			recipe = {}
			recipe['quantities'] = []
			recipe['ingredients'] = []
		flags = 1
		skip = 1
	elif (line=="#NAME"):
		flags = 2
		skip = 1
	elif (line=="#GROUP"):
		flags = 3
		skip = 1
	elif (line=="#TEXT"):
		flags = 4
		skip = 1
	elif (line=="#INGREDIENTS"):
		flags = 5
		skip = 1
	if skip==0:
		if flags==2:
			recipe['name'] = line
		elif flags==3:
			for i,group in enumerate(groups):
				if group==line:
					recipe['group'] = i
		elif flags==4:
			if 'text' in recipe.keys():
				recipe['text'] = recipe['text'] + '<br>' + line
			else:
				recipe['text'] = line
		elif flags==5:
			parts = line.split(' ',1)
			recipe['quantities'].append(float(parts[0]))
			recipe['ingredients'].append(parts[1])

recipes.append(recipe)
data = {}
data['recipes'] = recipes

print(data)
f = open('data.json','w')
json.dump(data,f)