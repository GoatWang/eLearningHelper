from PyInstaller.utils.hooks import collect_all, collect_data_files

data = collect_all('spacy')
datas = data[0]
binaries = data[1]
hiddenimports = data[2]

data = collect_all('en_core_web_sm')
datas += data[0]
binaries += data[1]
hiddenimports += data[2]