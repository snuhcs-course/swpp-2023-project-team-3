import json
import os
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate, MessagesPlaceholder
    )
from langchain.memory import ConversationSummaryBufferMemory
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from dotenv import load_dotenv
load_dotenv()

class GPT(object):
    import openai
        
    @classmethod
    def __init__(cls):
        
        cls.openai.api_key = os.getenv('OPENAI_API_KEY')
        cls.llm = ChatOpenAI(temperature=0.0, model="gpt-4")
        cls.system_context_template = """
            You are a helpful and friendly chatbot designed to help humans with shopping the fashion items they want.
            The human will talk to you in the hope that you will suggest detailed and concrete fashion items that suits his/her needs.
            Your output should be of a json format as follows.
            """
        cls.system_format_template = """
            First, you should interact with the human and answer his/her questions as this helpful chatbot assistant you are. 
            Your response for this first part should go into the "answer" part of the final json output format.
            You should give some fashion item suggestions or fashion related and detailed queries for searching, when the human tells you want he/she wants.
            Limit your suggested fashion item types within coats, denims, dresses, jackets, knitwear, skirt, tops and trousers.
            Your suggested fashion items' descriptions should be detailed, concrete and realistic, more than five words each.
            No shoes, no bags and no scarves. No shoes. And your items should not include specific brand names.
            Second, you need to summarize into a short phrase what the user wants. Keep it concise, less than 5 words.
            Your response for this second part should go into the "summary" part of the final json output format.
            Third, if you have included any fashion item suggestions or queries in the "answer" section, make a list out of them, separated by commas, surrounded by brackets.
            Add them to the list only if they belong to coats, denims, dresses, jackets, knitwear, skirt, tops or trousers.
            If you haven't given any fashion items to the human, you put the null value here.
            Put this into the "fashion_items" part of the final json output format. The items in the list should be separated by commas, surrounded by blanket.
            Your output should always be of a json format with the three keys "answer", "summary" and "fashion_items" as specified above, no matter the human input.
            Do not output anything other than the specified json markdown snippet code.
        """
        cls.system_limit_template = """
            Never give an answer if the user asks you questions other than Fashion domain!
            Your output should always be of a json format with the three keys "answer", "summary" and "fashion_items" as specified below, no matter the human input.
            Do not output anything other than the specified json markdown snippet code.
            You must output following the specified json format.
            The fashion item suggestions you give to the user:
            - will be used to search our fashion database (Farfetch).
            - Our Farfetch dataset only includes women's fashion items in the following categories: coats, denims, dresses, jackets, knitwear, skirts, tops, or trousers.
            - Prioritize general and relatable fashion items available on Farfetch; avoid specific brand names.
            - Exclude items that do not exist on Farfetch, fall outside the specified categories, or are not women's clothing for user relevance.
            - The goal is to provide practical and relevant fashion suggestions 
        """
        cls.human_template = "{question}"
        cls.ai_template = ""
        cls.format_template = "{format_instructions}"

        response_schemas = [
            ResponseSchema(name="answer", description="Answer to the human's question. This is the only part that will be visible to the human."),
            ResponseSchema(name="summary", description="A short phrase that can encapsulate what the human wants"),
            ResponseSchema(name="fashion_items", description="list of fashion items generated in your answer above to the human. separated by commas, surrounded with brackets.", type="list")
        ]
        cls.output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    
    @classmethod
    def get_response(cls, user_text, chat_history):
        memory = ConversationSummaryBufferMemory(llm=cls.llm, memory_key="chat_history", return_messages=True, max_token_limit=3000)
        if chat_history is not None:
            for user_chat in chat_history["user_chat"]:
                memory.chat_memory.add_user_message(user_chat["query"])
                gpt_chat = user_chat["gpt_chat"][0]
                gpt_response = dict.fromkeys(["answer", "summary", "fashion_items"])
                gpt_response["answer"] = gpt_chat["answer"]
                # gpt_response["summary"] = "this is summary" # TODO: gpt_chat["summary"]
                fashion_items = [gpt_chat["gpt_query1"], gpt_chat["gpt_query2"], gpt_chat["gpt_query3"]]
                gpt_response["fashion_items"] = fashion_items
                memory.chat_memory.add_ai_message(json.dumps(gpt_response))

        # Construct prompt from templates
        prompt = ChatPromptTemplate(
            messages = [
                SystemMessagePromptTemplate.from_template(cls.system_context_template),
                SystemMessagePromptTemplate.from_template(cls.format_template),
                SystemMessagePromptTemplate.from_template(cls.system_limit_template),
                MessagesPlaceholder(variable_name="chat_history"),
                HumanMessagePromptTemplate.from_template(cls.human_template),
                AIMessagePromptTemplate.from_template(cls.ai_template),
            ],
            input_variables={"question"},
            partial_variables={"format_instructions": cls.output_parser.get_format_instructions()}
        )

        chain = LLMChain(llm=cls.llm, prompt=prompt, verbose=True, memory=memory)
        llm_response = chain.predict(question=user_text)
        try : 
            response_dict = cls.output_parser.parse(llm_response)
            if response_dict.get('fashion_items') is not None:
                queries = [i for i in response_dict.get('fashion_items') if i is not None]
            else: queries = []
            
            response = {
                "answer" : response_dict.get('answer'),
                "summary" : response_dict.get('summary'),
                "gpt_queries" : queries
            }
            return response
        except:
            answer = "Apologies for the inconvenience. It appears there's a technical issue processing your input. Remember, I'm here exclusively for fashion-related questions. If you have another fashion inquiry or need style advice, please let me know, and I'll do my best to assist you!"
            response = {
                "answer" : answer,
                "summary" : user_text,
                "gpt_queries" : []
            }
            return response