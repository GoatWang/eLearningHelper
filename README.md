# Installation
## Usage
1. Install ffmpeg (https://phoenixnap.com/kb/ffmpeg-windows)

## Development
```
pip install pywebview
pip install moviepy
pip install openai
pip install langchain
pip install openai-whisper
pip install stable-ts
pip install spacy
pip install pandas
pip install pyinstaller
pip install packages/en_core_web_sm-3.7.0-py3-none-any.whl
```

# Package
1. create spec file
    1. `pyinstaller main.py -n eLearningHelper --additional-hooks-dir=.`
    2. `pyinstaller main.py -n eLearningHelper --onefile --additional-hooks-dir=.`

2. add datas in the spec file
    ```
    datas=[('weights/base.en.pt', 'weights'),
        ('demodata/*', 'demodata'),
        ('frontend/*', 'frontend'),
        ('key.txt', '.')],
    ```