import os
import pandas
import json

script_path = os.path.abspath(__file__)
folder_path = os.path.dirname(script_path)
data_path = os.path.join(folder_path,"data.xlsx")
xls = pandas.ExcelFile(data_path)
data = {}
for sheet_name in xls.sheet_names:
    datafile = pandas.read_excel(data_path,sheet_name=sheet_name)
    datafile.fillna('',inplace=True)
    data[sheet_name] = datafile.to_dict(orient="records")
f = open("data.json","w")
f.write(json.dumps(data))
f.close()
