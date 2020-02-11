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
            data= { }
            img = title.find('img', {'class': ['ExImg', 'ExResult-img', 'lazyload']})['data-src']
            name = title.find('h3',{'class': 'ExResult-resultsHeading'}).find('a').text.strip()
            muscle = title.find('div',{'class': 'ExResult-muscleTargeted'}).find('a').text.strip()
            equipment = title.find('div',{'class': 'ExResult-equipmentType'}).find('a').text.strip()
            link = title.find('h3',{'class': 'ExResult-resultsHeading'}).find('a')["href"]
            rating = title.find('div',{'class': 'ExRating-badge'}).text.strip()

            data={'name':name, 'img':img, 'muscle':muscle, 'equipment':equipment, 'link':link, 'rating':rating }
            with open('result.json', '+a') as make_file:
                json.dump(data, make_file, ensure_ascii=False, indent="\t")    
        finder_num = finder_num + 1
        # print(str(finder_num))