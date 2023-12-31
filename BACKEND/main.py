from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from textblob import TextBlob

import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
import string
# nltk.download('punkt')
# openai
import os
import openai
# client = OpenAI()
openai.api_key = os.getenv("OPENAI_API_KEY")

from openai import OpenAI
client = OpenAI()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_texte(texte :str):
    mot_cle=nltk.word_tokenize(texte)
    return {"sujet":"vide","sentiments":[],"mot_cles":mot_cle}

def generer_reponse(texte: str):
    return {"reponse":"reponse vide"}

def formater_reponse(texte: str):
    return {"reponse_formater":"reponse vide formater"}



class AnalyseTexteInput(BaseModel):
    texte: str



@app.post("/analyse")
def analyse_endpoint(analyse_input: AnalyseTexteInput):
    print(analyse_input)
    #miniscule
    texte=(analyse_input.texte).lower()
    #ponctuation
    texte = ''.join([char for char in texte if char not in string.punctuation])
    #texte.translate(str.maketrans("", "", string.punctuation))
    print(texte)
 
 

    #tokenisation
    tokens=nltk.word_tokenize(texte)
    

    #stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
 
 
    #porter = PorterStemmer()
    lemmatizer = WordNetLemmatizer()
    lemmatized_words = [lemmatizer.lemmatize(word) for word in tokens]
    print(lemmatized_words)
    
  

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a computer science university "},
        {"role": "assistant", "content": "you are speicalized in AI, machine learning and deeplearnning..."},
        {"role": "user", "content": " ".join(lemmatized_words)},
    ]
    )


    
    return {"msg": completion.choices[0].message}
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)