import random
import json
from collections import OrderedDict
import os

# 단련 원하는 부위 0개~15개
# 좋아하는 운동 5개
# 운동 함: 1, 운동 안함: 0

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

machine_list = [
    ['Machine', 'Cable'],                                                               # 머신
    ['Barbell', 'Kettlebell', 'Dumbbell', 'E-Z Curl Bar'],                              # 바벨, 덤벨류
    ['Band', 'Foam Roll', 'Medicine Ball', 'Other', 'Exercise Ball'],                   # 밴드, 폼룰러 등 기타 기구
    ['Body Only', 'None']                                                               # 기구 없음
]

exer_list = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: []
}  # 운동 이름 리스트

def make_exer_list() :
    with open('temp_upgarde_result.json', 'r') as read_file:
        json_data = json.load(read_file)

    # 근육 부위에 맞는 것을 exer_list에 삽입
    i=0
    json_element_num = len(json_data)       # json 파일 안의 객체 개수


    while i < json_element_num  :
        exer_list[json_data[i]['muscle']].append(json_data[i])
        i += 1

def find_duplicate(find_value, base_list) :
    j = 0
    while j < len(base_list) :
        if base_list[j] is find_value:
            return True
        j += 1
    return False

# 임시 배열(해당 값이 맞는) 인덱스 값을 append 한 list 만들어서 반환
def make_temp_array(input_array, match_value) :
    i = 0
    temp_array = []
    while i < len(input_array) :
        if input_array[i] in match_value :  # match_value 안에 input_array[i] 있는 경우
            temp_array.append(i)
        i += 1

    # 선호하는 것이 하나도 없는 경우
    if len(temp_array) == 0 :
        reset_num = random.randrange(1, len(input_array))
        j = 0
        while j < reset_num :
            input_array[random.randrange(0, len(input_array))] = random.randrange(0, 2)
            j += 1

        while i < len(input_array) :
            if input_array[i] in match_value :  # match_value 안에 input_array[i] 있는 경우
                temp_array.append(i)
            i += 1

    return temp_array

def filter_fun(pref_muscle, pref_machine, level):
    ret_data = []                   # 잠시 저장할 임시 배열
    for i in pref_muscle :
        for index_arr in exer_list[i] :
            if (index_arr['equipment'] in pref_machine) and (index_arr['level'] == level) :
                ret_data.append(index_arr)
    return ret_data

def make_user(id_num):

    prefer_pool = []
    # 사용자 선호하는 것이 5개 미만인 경우
    while (len(prefer_pool) < 5) :
        # 좋아하는 근육 설정 반복 수 설정
        user_like_muscle = [random.randrange(0, 2) for j in range(15)]    # 초기화
        temp_user_like_muscle = make_temp_array(user_like_muscle, [1])

        # -1 싫어요, 0 몰라요, 1 좋아요
        user_like_machine = [random.randrange(-1, 2) for j in range(4)]    # 초기화
        temp_user_like_machine = make_temp_array(user_like_machine, [1, 0])

        # 사용자 운동 경력  0: 0~1년 초보, 1: 1~3년 중급, 2: 3년 이상 고급
        user_level = random.randrange(0, 3)

        # 좋아하는 운동 설정
        user_like_exe = []

        # temp_user_like_muscle = [11]
        # temp_user_like_machine = [3]
        # user_years = 0

        # 사용자가 좋아하는 운동이 모두 있는 풀
        prefer_pool = filter_fun(temp_user_like_muscle, temp_user_like_machine, user_level)

    i = 0                   # 찾은 운동 수
    while i < 5 :           # 5개의 운동 설정
        temp_exer = prefer_pool[random.randrange(0, len(prefer_pool))]
        if find_duplicate(temp_exer, user_like_exe) :
            continue
        else :
            user_like_exe.append(temp_exer)
            i += 1

    return {
        'id' : id_num,
        'inf' : [user_level] + user_like_muscle + user_like_machine,
        'preferExe': user_like_exe
    }

make_exer_list()


people_num = 1000
process_index = 0

while process_index < people_num :
    data = make_user(process_index)

    with open('dataset.json', '+a') as write_file :
        json.dump(data, write_file, ensure_ascii=False, indent="\t") 
    process_index += 1