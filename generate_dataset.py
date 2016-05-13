import os
import json

cd = os.path.dirname(os.path.realpath(__file__))
# Get all the groups
allgroups = ['Breakfast','Lunch','Dinner','Dessert']
groups = os.listdir(os.path.join(cd,'recipes'))

allrecipes = []
for group in groups:
	recipes = os.listdir(os.path.join(cd,'recipes',group))
	for recipe in recipes:
		name,ext = os.path.splitext(recipe)
		f = open(os.path.join(cd,'recipes',group,recipe),'r').read()
		f.encode('utf-8')
		lines = f.splitlines()

		# make an empty template
		cur = {}
		cur['ingredients'] = []
		cur['quantities'] = []
		cur['name'] = name
		# group
		for i,cg in enumerate(allgroups):
			if cg==group:
				cur['group'] = i

		flags = 0

		for line in lines:
			skip = 0
			if (line=="#TEXT"):
				flags = 4
				skip = 1
			elif (line=="#INGREDIENTS"):
				flags = 5
				skip = 1
			if skip==0:
				if flags==4:
					if 'text' in cur.keys():
						cur['text'] = cur['text'] + '<br>' + line
					else:
						cur['text'] = line
				elif flags==5:
					parts = line.split(' ',1)
					cur['quantities'].append(float(parts[0]))
					cur['ingredients'].append(parts[1])

		# append
		allrecipes.append(cur)

data = {}
data['recipes'] = allrecipes

f = open('data.json','w')
json.dump(data,f)