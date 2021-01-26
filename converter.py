import sys,re,os,pandas,fileinput
path = input("input file path here : ")
path = path.rstrip()
xls = pandas.ExcelFile(path)
for sheet_name in xls.sheet_names:
    datafile = pandas.read_excel(path, sheet_name= sheet_name)
    datafile.to_csv(r'/Users/zhouyizhen/coursemap/data/csv_files/new_'+sheet_name+'.csv') 
