import os
import openai
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate, MessagesPlaceholder
    )
from langchain.memory import ConversationBufferMemory
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

# Authenticate with OpenAI API key
openai.api_key = os.environ['OPENAI_API_KEY']
llm = ChatOpenAI(temperature=0.0, model="gpt-3.5-turbo-0301")

# Define schemas
response_schemas = [
    ResponseSchema(name="answer", description="Answer to the human's question. This is the only part that will be visible to the human."),
    ResponseSchema(name="human_query", description="A short phrase that can encapsulate what the human wants"),
    ResponseSchema(name="fashion_items", description="list of fashion items generated")
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
You should give some fashion item suggestions when the human tells you want he/she wants.
Limit your suggested fashion item types within coats, denims, dresses, jackets, knitwear, skirt, tops and trousers.
Your suggested fashion items should be detailed and concrete, at least three words each.
No shoes, bags or scarves for example.
Second, you need to summarize into a short phrase what the user wants. Keep it concise, less than 5 words.
Your response for this second part should go into the "human_query" part of the final json output format.
Third, if you have included any fashion item suggestions in the "answer" section, make a list out of them, separated by commas.
If you haven't given any fashion items to the human, you put the null value here.
Put this into the "fashion_items" part of the final json output format.
Your output should always be of a json format with the three keys "answer", "human_query" and "fashion_items" as specified below, no matter the human input.
"""

human_template = """{question}"""
ai_template = """"""
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
chain.predict(question="hi")
chain.predict(question="high school reunion")
last_response = chain.predict(question="Give me suggestions on what to wear for halloween to look like Christine Daae")
print(last_response)
output_dict = output_parser.parse(last_response)
print(f"answer: {output_dict.get('answer')}")
print(f"human_query: {output_dict.get('human_query')}")
print(f"fashion_items: {output_dict.get('fashion_items')}")


