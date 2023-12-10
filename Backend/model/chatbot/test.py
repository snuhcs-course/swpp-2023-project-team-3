from inference import ClipTextEmbedding
from gpt import GPT
import json

# fclip = ClipTextEmbedding()
# queries = ["Black midi skirt", "White blouse with high collar", "rainy cloudy jeans"]
# ret_dict, _ = fclip.ret_queries(queries)

# print(ret_dict)

gpt = GPT()

json_file = "chat_history_example.json"
with open(json_file) as json_data:
    chat_history = json.load(json_data)

gpt.get_response("suggest me what to wear for halloween", chat_history)
# gpt.get_response("suggest me what to wear for halloween", None)