import os
import openai
# client = OpenAI()
openai.api_key = os.getenv("OPENAI_API_KEY")

from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
)
# 
print(completion.choices[0].message)
