import json
import os 

cwd = os.getcwd()
print(cwd)
api_dir = "openai-api.json"
API_FILES = os.path.join(cwd, api_dir)

prompt = '''[SYSTEM]: Your model is tasked with two primary goals: Classification and Fashion Translation.

1. Classification:
    - Determine whether the user input is fashion-relevant.
    - Output 1 for explicit fashion queries and also for seemingly abstract words that can be translated into fashion items; otherwise, output 0.
    - Precision in classification is crucial for meaningful responses.

2. Fashion Translation:
    - Translate the user input into a list of fashion items if the classification result is 1.
    - Include similar items for specific fashion mentions.
    - For abstract queries, capture the essence and style realistically.
    - Ensure the list reflects current fashion trends from Farfetch and is free from overly imaginative items.
    Important Note:
        - The generated list will be used to search our fashion database (Farfetch).
        - Our Farfetch dataset only includes women's fashion items in the following categories: coats, denims, dresses, jackets, knitwear, skirts, tops, or trousers.
        - Prioritize general and relatable fashion items available on Farfetch; avoid specific brand names.
        - Exclude items that do not exist on Farfetch, fall outside the specified categories, or are not women's clothing for user relevance.
        - The goal is to provide practical and relevant fashion suggestions aligned with Farfetchs inventory, enhancing the user's fashion experience.

Output Format:
    - Response format: [Classification Result], Fashion Item 1, Fashion Item 2, ...
    - Classification Result: 1 for fashion-relevant, 0 for not.
    - Each fashion item should be descriptive (more than 4 words, less than 70 tokens).
    - Adhering strictly to this format is vital for clarity and consistency.

Avoid Unnecessary Information:
    - Exclude phrases like 'Sorry, I don't understand.'
    - Keep the response focused on fashion-related content.

Examples:

[USER]: Timeless elegance in fashion
[ASSISTANT]: 1, Timeless Trench Coat, Structured Denim Jacket, Floral Print Midi Dress, Oversized Cashmere Knit Sweater, Pleated Hobble Skirt, Embellished Chiffon Blouse

[USER]: Striped T-shirt
[ASSISTANT]: 1, Striped Short-Sleeved T-shirt, Striped Long Sleeve Top, Striped Long-Sleeved Cropped T-shirt

[USER]: Astronomy and celestial phenomena
[ASSISTANT]: 0

[USER]: Taylor Swift
[ASSISTANT]: 1, Textured Silver Sequin Dress, Mesh Ruffles Frill Blouse, Distressed Skinny Denim Jeans, Layered Tulle Textured Skirts

Ensure precise classification and offer practical fashion suggestions to enhance the user's experience with the fashion database.
'''


def format_prompt(query):
    format_query = f"[USER]: {query}" \
    "\n[ASSISTANT]: "
    return prompt+format_query

class GPT(object):
    import openai
    key = None
    api_file = None
    
    @classmethod
    def __init__(cls):
        if cls.key == None :
            # print("key is none")
            if cls.api_file == None:
                cls.api_file = API_FILES
            cls.key = cls.load_api_key()
            cls.openai.api_key = cls.key["OPENAI_API_KEY"]

    @classmethod
    def load_api_key(cls):
        print(cls.api_file)
        if cls.api_file == None:
            raise ValueError("The API file for OpenAI does not exist.")
        else:
            with open(cls.api_file) as f:
                cls.key = json.load(f)
        
        return cls.key
    
    @classmethod
    def get_response(cls, query):
        response = cls.openai.Completion.create(
            model="gpt-3.5-turbo-instruct",
            prompt=format_prompt(query),
            max_tokens=50,
            temperature=1,
            n=1 # n만큼 choice를 줌...
        )

        return response