import os
import openai
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate, MessagesPlaceholder
    )
from langchain.memory import ConversationBufferMemory
from langchain.output_parsers import ResponseSchema
from langchain.output_parsers import StructuredOutputParser

# Authenticate with OpenAI API key
openai.api_key = os.environ['OPENAI_API_KEY']
llm = ChatOpenAI(temperature=0.0, model="gpt-3.5-turbo-0301")

# Define schemas
response_schemas = [
    ResponseSchema(name="answer", description="Answer to the human's question. This is the only part that will be visible to the human."),
    ResponseSchema(name="human_query", description="A short phrase that can encapsulate what the human wants"),
    ResponseSchema(name="fashion_items", description="list of fashion items generated"),
    ResponseSchema(name="new_fashion_items_flag", description="A binary flag that indicates whether the output for fashion_items has been updated or not")
]

output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()

# Define templates
system_template = """
You are a helpful and friendly chatbot designed to help humans with shopping the fashion items they want.
The human will talk to you to in the hope that you will suggest detailed and concrete fashion items that suits his/her needs.
Your output should be of a json format. More infomation will follow later about how to format your output.

First, you should interact with the human and answer his/her questions as this helpful chatbot assistant you are. 
Your response for this first part should go into the "answer" part of the final json output format.
Second, you need to summarize into a short phrase what the user wants.
Your response for this second part should go into the "human_query" part of the final json output format.
Third, once you have collected enough information about what the user needs, you should give a list of fashion items that suits the human's needs.
Put this into the "fashion_items" part of the final json output format.
Fourth, if you have generated a new list of fashion items because what the user wants has changed, set the binary flag to 1. The default value if 0.
This binary value goes into the "new_fashion_items_flag" part of the final json output format.
"""

human_template = """
{question}
"""

ai_template = """
"""

format_template = """{format_instructions}"""

# Construct prompt from templates
prompt = ChatPromptTemplate(
    messages = [
        SystemMessagePromptTemplate.from_template(system_template),
        MessagesPlaceholder(variable_name="chat_history"),
        HumanMessagePromptTemplate.from_template(human_template),
        AIMessagePromptTemplate.from_template(ai_template),
        SystemMessagePromptTemplate.from_template(format_template)
    ],
    input_variables={"question"},
    partial_variables={"format_instructions": format_instructions}
)

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
chain = LLMChain(llm=llm, prompt=prompt, verbose=True, memory=memory)
output_dict = output_parser.parse(chain.predict(question="what should i wear for high school reunion"))
print(f"answer: {output_dict.get('answer')}")
print(f"human_query: {output_dict.get('human_query')}")
print(f"fashion_items: {output_dict.get('fashion_items')}")
print(f"flag: {output_dict.get('new_fashion_items_flag')}")