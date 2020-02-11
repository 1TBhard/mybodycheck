## parser.py
import requests
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.request import HTTPError
import json
from collections import OrderedDict
import os

machine_list = [
    ['Machine', 'Cable'],                                                               # 머신
    ['Barbell', 'Kettlebell', 'Dumbbell', 'E-Z Curl Bar'],                              # 바벨, 덤벨류
    ['Band', 'Foam Roll', 'Medicine Ball', 'Other', 'Exercise Ball'],                   # 밴드, 폼룰러 등 기타 기구
    ['Body Only', 'None']                                                               # 기구 없음
]

muscle_list = [
    'Chest',
    'Forearms',
    'Lats',
    'Middle Back',
    'Lower Back',
    'Neck',
    'Quadriceps',
    'Hamstrings',
    'Calves',
    'Triceps',
    'Traps',
    'Shoulders',
    'Abdominals',
    'Glutes',
    'Biceps'
]


base_html = "https://www.bodybuilding.com" 

fp = open("name_result.txt", "r")

while True:
    fp_link = fp.readline().rstrip('\n')
    if fp_link is '':
        fp.close()
        break

    html = urlopen(base_html + fp_link)
    soup = BeautifulSoup(html, "html.parser")

    #운동명
    exer_name = soup.select(
        '#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.flexo-between > div.grid-8.grid-12-s.grid-12-m > h2'
    )

    #정보
    exer_titles = soup.select(
        '#js-ex-content > div > section > div.grid-3.grid-12-s.grid-8-m > ul > li'
        )

    #점수
    rating = soup.select(
        '#js-ex-content > div > section:nth-child(2) > div.grid-3.grid-12-s.grid-4-m > div > div.ExRating-badge'
    )

    # 이미지
    image = soup.select(
        '#js-ex-content > div > section.ExDetail-section.ExDetail-photos > div.flexo-container.flexo-around > div:nth-child(1)'
    )

    
    name = exer_name[0].text.strip()
    # muscle = exer_titles[1].find('a').text.strip()

    muscle = muscle_list.index(exer_titles[1].find('a').text.strip())


    exeType = exer_titles[0].find('a').text.strip()

    
    level_index_sub = 0
    try:
        equipment = exer_titles[2].find('a').text.strip()
    except:
        equipment = 'None'
        level_index_sub = 1

    # temp_upgarde_result 을 위한 곳  equipment를 정수로 표현 ##############
    i = 0
    for k in machine_list :
        for h in k :
            if h == equipment :
                equipment = i
                break
        i += 1
    # =====================================================================

    img = image[0].find('img')['src']
    
    link = fp_link
    level = exer_titles[3 - level_index_sub].text.strip().replace('Level:\n          ', '')

     # temp_upgarde_result 을 위한 곳 level을 정수로 표현 ##############
    if level == 'Beginner':
        level = 0
    elif level == 'Intermediate':
        level = 1
    else :
        level = 2
    # =====================================================================

    rate = rating[0].text.strip()

    data = {'name':name, 'muscle':muscle, 'exeType':exeType, 'equipment':equipment, 'img':img, 'link':link, 'level':level, 'rate':rate}
    with open('temp_upgarde_result.json', '+a') as make_file:
         json.dump(data, make_file, ensure_ascii=False, indent="\t")    