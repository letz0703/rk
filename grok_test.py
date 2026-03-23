from openai import OpenAI
client = OpenAI(
    api_key="xai-UGVSPYiMlUd5zjhZ2vNj2WUtACIkjotnzcoMlrgCFeZeDTerDvWm1uQXRVTfzQjGNodJ3Uo20sAP3oqy",
    base_url="https://api.x.ai/v1"
)
response = client.chat.completions.create(
    model="grok-3",
    messages=[{"role": "user", "content": "hi"}]
)
print(response.choices[0].message.content)
