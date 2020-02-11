# ## parser.py
# import requests
# from bs4 import BeautifulSoup
# from urllib.request import urlopen
# from urllib.request import HTTPError
# import json
# from collections import OrderedDict
# import os


# base_html = "https://www.bodybuilding.com/exercises/finder/" 

# finder_num = 1      # 운동 페이지

# text_file = open("Output.txt", "w")

# while True:
#     #try: 
#     html = urlopen(base_html + str(finder_num))                      # 어떤 운동인지 설정
#     soup = BeautifulSoup(html, "html.parser")
#     exer_titles = soup.select(
#         '.ExResult-row.flexo-container.flexo-between'
#         )
#     if not exer_titles:     # 스트링이나 리스트, 튜플이 비엇을 경우 false 값임
#         break
#     for title in exer_titles:
#         name = title.find('h3',{'class': 'ExResult-resultsHeading'}).find('a').text.strip()
#         with open('name_result.json', '+a') as make_file:
#             json.dump(name, make_file, ensure_ascii=False, indent="\t")
#         print(name)
#     finder_num = finder_num + 1

            
## parser.py
import requests
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.request import HTTPError
import json
from collections import OrderedDict
import os


base_html = "https://www.bodybuilding.com/exercises/finder/" 

finder_num = 1      # 운동 페이지

for number in range(1, 16):
    finder_num = 1
    while True:
        all_html = base_html + str(finder_num) + "/?muscleid="             # 운동 페이지 설정
        #try: 
        html = urlopen(all_html + str(number))                      # 어떤 운동인지 설정

        soup = BeautifulSoup(html, "html.parser")
        exer_titles = soup.select(
            '.ExResult-row.flexo-container.flexo-between'
            )
        if not exer_titles:     # 스트링이나 리스트, 튜플이 비엇을 경우 false 값임
            break

        for title in exer_titles:
            link = title.find('h3',{'class': 'ExResult-resultsHeading'}).find('a')["href"]

            with open('name_result.txt', '+a') as make_file:
                make_file.write(link + '\n')
        finder_num = finder_num + 1
        print(str(finder_num))