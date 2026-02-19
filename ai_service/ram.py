import google.generativeai as genai

genai.configure(api_key="AIzaSyC7HPV5TL-pB9iBrghFKOaXmNc1XdOufZY")

for m in genai.list_models():
    print(m.name)
