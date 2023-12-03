from openai import OpenAI
import json
import pandas as pd
import time

hashtag_df = pd.read_csv("item_df.csv", usecols=['id'], sep=',')
prompt = """
Give me a comma-separated list of three short descriptions, that best captures the style of the given clothing.
Use abstract and high-level everyday language keywords rather than nitty-gritty fashion jargons.
I am essentially trying to create hashtag fashion keywords for these clothings, and need your help to create those labels.
So try to generate meaningful keywords, not too simple yet not too detailed.
"""

def load_api_key(api_file="openai-api.json"):
    with open(api_file) as f:
        key = json.load(f)
    return key["OPENAI_API_KEY"]

client = OpenAI()
client.api_key = load_api_key()

def process_id_with_retry(id):
    image_url = f"https://tryot.s3.ap-northeast-2.amazonaws.com/item_img/{id}.jpg"
    max_retry_attempts = 3
    retry_delay_seconds = 100  # Adjust this based on your needs

    for attempt in range(max_retry_attempts):
        try:
            print(f"ID: {id}, Attempt: {attempt+1}")
            response = client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_url,
                                },
                            },
                        ],
                    }
                ],
                max_tokens=500,
            )
            return response.choices[0].message.content

        except Exception as e:
            error_message = str(e)
            if "rate limit" in error_message.lower():
                print(f"Rate limit error. Retrying after {retry_delay_seconds} seconds...")
                time.sleep(retry_delay_seconds)
            else:
                print(f"Other error: {error_message}")
                break  # Break the loop for non-rate-limit errors

    return None  # Return None if all retry attempts fail

# Create a new CSV file for writing
with open("hashtag.csv", "a") as f:
    # f.write("id, hashtags\n")  # Write header
    for id in hashtag_df["id"][286:]:
        content = process_id_with_retry(id)

        if content is not None:
            f.write(f"{id}, {content}\n")
        else:
            print("Failed to process after multiple retry attempts. Finish writing to file.")
            f.close()