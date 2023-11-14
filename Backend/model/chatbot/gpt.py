import json
import os
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate, MessagesPlaceholder
    )
from langchain.memory import ConversationTokenBufferMemory
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

class GPT(object):
    import openai
        
    @classmethod
    def __init__(cls):
        
        cls.openai.api_key = os.environ['OPENAI_API_KEY']
        cls.llm = ChatOpenAI(temperature=0.0, model="gpt-3.5-turbo-0301")
        cls.system_context_template = """
            You are a helpful and friendly chatbot designed to help humans with shopping the fashion items they want.
            The human will talk to you to in the hope that you will suggest detailed and concrete fashion items that suits his/her needs.
            Your output should be of a json format as follows.
            """
        cls.system_format_template = """
            First, you should interact with the human and answer his/her questions as this helpful chatbot assistant you are. 
            Your response for this first part should go into the "answer" part of the final json output format.
            You should give some fashion item suggestions when the human tells you want he/she wants.
            Limit your suggested fashion item types within coats, denims, dresses, jackets, knitwear, skirt, tops and trousers.
            Your suggested fashion items' descriptions should be detailed, concrete and realistic, more than five words each.
            No shoes, bags or scarves for example.
            Second, you need to summarize into a short phrase what the user wants. Keep it concise,  ess than 5 words.
            Your response for this second part should go into the "summary" part of the final json output format.
            Third, if you have included any fashion item suggestions in the "answer" section, make a list out of them, separated by commas, surrounded by brackets.
            Add them to the list only if they belong to coats, denims, dresses, jackets, knitwear, skirt, tops or trousers. No shoes nor necklaces nor bags.
            If you haven't given any fashion items to the human, you put the null value here.
            Put this into the "fashion_items" part of the final json output format. The items in the list should be separated by commas, surrounded by blanket.
            Your output should always be of a json format with the three keys "answer", "summary" and "fashion_items" as specified above, no matter the human input.
            Do not output anything other than the specified json markdown snippet code.
        """
        cls.system_limit_template = """
            Don't suggest fashion item types outside of coats, denims, dresses, jackets, knitwear, skirt, tops and trousers.
            Your output should always be of a json format with the three keys "answer", "summary" and "fashion_items" as specified below, no matter the human input.
            Do not output anything other than the specified json markdown snippet code.
            You must output following the specified json format.
        """
        cls.human_template = "{question}"
        cls.ai_template = ""
        cls.format_template = "{format_instructions}"

        response_schemas = [
            ResponseSchema(name="answer", description="Answer to the human's question. This is the only part that will be visible to the human."),
            ResponseSchema(name="summary", description="A short phrase that can encapsulate what the human wants"),
            ResponseSchema(name="fashion_items", description="list of fashion items generated in your answer above to the human. separated by commas, surrounded with brackets", type="list")
        ]
        cls.output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    
    @classmethod
    def get_response(cls, user_text, chat_history):
        memory = ConversationTokenBufferMemory(llm=cls.llm, memory_key="chat_history", return_messages=True, max_token_limit=3000)
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
        response = dict.fromkeys(["answer", "summary", "gpt_query1", "gpt_query2", "gpt_query3", "gpt_query_flag"])
        try:
            response_dict = cls.output_parser.parse(llm_response)
            response["answer"] = response_dict.get('answer')
            response["summary"] = response_dict.get('summary')
            fashion_items = response_dict.get('fashion_items')
            if fashion_items[0] is not None and fashion_items[1] is not None and fashion_items[2] is not None:
                response["gpt_query1"] = fashion_items[0]
                response["gpt_query2"] = fashion_items[1]
                response["gpt_query3"] = fashion_items[2]
                response["gpt_query_flag"] = 1 # gpt returned specified json format
            else:
                raise NullItemException()     
        except NullItemException:
            response["gpt_query_flag"] = 0
        except Exception as e: # parsing into json error
            response["gpt_query_flag"] = 0
            if isinstance(llm_response, str): 
                response["answer"] = llm_response
            else:
                print(e)
        return response
    
class NullItemException(Exception):
    pass