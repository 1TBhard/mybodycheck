import json


all_of_them = []

def find_all_of_them(insert_item):
    for index in all_of_them:
        if index is insert_item:
            return True
    return False

with open('result.json', "r") as json_file:
    json_data = json.load(json_file)
    print(json_data)

