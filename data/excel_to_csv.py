
import os
import pandas

script_path = os.path.abspath(__file__)
folder_path = os.path.dirname(script_path)
data_path = os.path.join(folder_path,"data.xlsx")
xls = pandas.ExcelFile(data_path)
if not os.path.isdir("csv"):
    os.mkdir(os.path.join(folder_path,"csv"))
for sheet_name in xls.sheet_names:
    datafile = pandas.read_excel(data_path,sheet_name=sheet_name)
    save_path = os.path.join(folder_path,"csv",sheet_name + ".csv")
    datafile.to_csv(save_path,index=False)
