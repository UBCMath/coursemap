import pandas as pd
import numpy as np

pd_layoutcourse = pd.read_excel('data/data.xlsx',sheet_name='LayoutCourses')
pd_prerequisite = pd.read_excel('data/data.xlsx',sheet_name='CoursesRequisites')
pd_layoutprere = pd.DataFrame(columns=['requisite_id','course_number','requisite_number','course_x','course_y','requisite_x','requisite_y'])

for index,row in pd_prerequisite.iterrows():
    course_x = pd_layoutcourse.loc[pd_layoutcourse['course_number']==row['course_number'],'x'].values
    course_y = pd_layoutcourse.loc[pd_layoutcourse['course_number']==row['course_number'],'y'].values
    pre_x = pd_layoutcourse.loc[pd_layoutcourse['course_number']==row['requisite_number'],'x'].values
    pre_y = pd_layoutcourse.loc[pd_layoutcourse['course_number']==row['requisite_number'],'y'].values
    if course_x.size != 0 and pre_x.size != 0:
        pd_layoutprere = pd_layoutprere.append([{'requisite_id':row['requisite_id'],'course_number':row['course_number'],'requisite_number':row['requisite_number'],
            'course_x':np.around(course_x,4)[0],'course_y':np.around(course_y,4)[0],
        'requisite_x':np.around(pre_x,4)[0] ,'requisite_y':np.around(pre_y,4)[0]}],ignore_index=True)
print(pd_layoutprere)
pd_layoutprere.to_csv('data/LayoutRequisites.csv')