import sys,re,os,pandas,fileinput
script_path = os.path.abspath(__file__)
folder_path = os.path.dirname(script_path)
path = os.path.join(folder_path,"data.xlsx")
xls = pandas.ExcelFile(path)
for sheet_name in xls.sheet_names:
    datafile = pandas.read_excel(path, sheet_name= sheet_name)
    savepath = os.path.join(folder_path,"csv_files","new_"+sheet_name+".csv")
    datafile.to_csv(savepath) 
