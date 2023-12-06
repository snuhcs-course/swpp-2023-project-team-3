import json
import os 

cwd = os.getcwd()
print(cwd)
api_dir = "openai-api.json"
API_FILES = os.path.join(cwd, api_dir)

class GPT(object):
    import openai
    key = None
    api_file = None
    
    @classmethod
    def __init__(cls):
        if cls.key == None :
            print("key is none")
            if cls.api_file == None:
                cls.api_file = API_FILES
            cls.key = cls.load_api_key()
            cls.openai.api_key = cls.key["OPENAI_API_KEY"]

    @classmethod
    def load_api_key(cls):
        print(cls.api_file)
        if cls.api_file == None:
            raise ValueError("The api file is none")
        else:
            with open(cls.api_file) as f:
                cls.key = json.load(f)
        
        return cls.key
    
    @classmethod
    def get_response(cls, query):
        prompt = '''
                [SYSTEM]: Develop upon user's input query and output relevant but more detailed, concrete and diverse fashion items.
                Do not output anything other than the list of fashion items.
                Depending on context, limit your output fashion item types within coats, denims, dresses, jackets, knitwear, skirt, tops and trousers.
                [SYSTEM]: If user query is a specific fashion item, you should return fashion items of the same type.
                [SYSTEM]: If user query is abstract, you outputs should encapsulate the essense and the style of the query.
                [SYSTEM]: If user query is totally fashion-irrelevant, you should still return fashion items while trying hard to relate to the query.
                [SYSTEM]: Even when the user query is impossible to understand, you should still output a list of fashion items at the expense of relevance to query.
                [SYSTEM]: When user query is fashion-relevant, put 1 at the start of the list. Keep in mind to classify seemingly fashion-unrelated user query as fashion-relevant
                as long as they can be smoothly and semantically well-translated into a list of fashion items.
                [SYSTEM]: When user query is totally random and virtually impossible to convert them into fashion items, put 0 at the start of the list. Keep in mind that
                even when the query does not include direct fashion items but is rather abstract, if it is a concept that can be translated into fashion, put 1 at the start of the list.
                [USER]: Timeless elegance in fashion
                [ASSISTANT]: 1, Timeless Trench Coat, Structured Denim Jacket, Floral Print Midi Dress, Oversized Cashmere Knit Sweater, Pleated Hobble Skirt, Embellished Chiffon Blouse
                [USER]: Striped T-shirt
                [ASSISTANT]: 1, striped short-sleeved T-shirt, striped long sleeve top, striped long-sleeved cropped T-shirt
                [USER]: 
                [USER]: Astronomy and celestial phenomena
                [ASSISTANT]: 0, Faux Fur Moon-Crescent Cardigan, Astronomical Print Denim Jeans, Siren of The Stars Suede Dress, Celestial Scene Embroidered Blazer
                [USER]: taylor swift
                [ASSISTANT]: 1, Textured Silver Sequin Dress, Embellished Cowboy Boots, Mesh Ruffles Frill Blouse, Distressed Skinny Denim Jeans, Layered Tulle Textured skirts
                Your output must be only a list of fashion items related to users query separated by commas, each more than 4 words and less than 70 tokens.
                Don't say unnecessary things like "Sorry, I don't understand.".
                Your list should be comprised of at least three fashion items.
                ''' \
                f"[USER]: {query}" \
                "[ASSISTANT]:"
        response = cls.openai.Completion.create(
            model="gpt-3.5-turbo-instruct",
            prompt=prompt,
            max_tokens=50,
            temperature=1,
            n=1 # n만큼 choice를 줌...
        )

        return response
