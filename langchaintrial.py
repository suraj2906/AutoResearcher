from langchain_tavily import TavilySearch
from langchain.chat_models import init_chat_model
from langgraph.prebuilt import create_react_agent
import os  
from dotenv import load_dotenv

load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

llm = init_chat_model("gpt-4o-mini", model_provider="openai")

tavily_search_tool = TavilySearch(
    max_results = 5,
    topic = "general"
)


agent = create_react_agent(llm, [tavily_search_tool])

user_input = "What is the ipl match that will take place today?"

for step in agent.stream(
    {"messages" : user_input},
    stream_mode="values"
):
    step["messages"][-1].pretty_print()