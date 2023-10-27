from PyInstaller.utils.hooks import collect_all, collect_data_files

data = collect_all('numpy')
datas = data[0]
binaries = data[1]
hiddenimports = data[2]

data = collect_all('whisper')
datas += data[0]
binaries += data[1]
hiddenimports += data[2]