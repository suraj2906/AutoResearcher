from fastapi import FastAPI, Request
from pydantic import BaseModel
from langchain_tavily import TavilySearch
from langchain.chat_models import init_chat_model
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage
import os
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
import asyncio

# Load environment variables
load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

# Init LangChain agent
llm = init_chat_model("gpt-4o-mini", model_provider="openai")
researchValidatorModel = init_chat_model("gpt-3.5-turbo", model_provider="openai")
tavily_search_tool = TavilySearch(max_results=5, topic="general")
agent = create_react_agent(llm, [tavily_search_tool])

sections = ["Abstract", "Introduction", "Background", "Current Developments", "Future Directions", "Conclusion"]


# Init FastAPI
app = FastAPI()

# Request model
class Query(BaseModel):
    prompt: str

@app.post("/research")
async def research(query: Query):
    system_prompt = (
        "You are an assistant that classifies whether a user query is a valid research topic. "
        "A valid topic should be complex, informative, and suitable for generating a detailed research paper. "
        "Respond only with 'Yes' or 'No'."
    )
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Is the following topic research worthy? {query.prompt}")
    ]
    response = researchValidatorModel.invoke(messages)
    async def event_stream():
        try:
            for section in sections:
                yield f"\n## {section}\n"
                prompt = f"Write the {section} of a research paper on the topic: {query.prompt}. Do not include the subtitle"
                result = agent.invoke({"messages": prompt})
                yield result["messages"][-1].content + "\n"
                await asyncio.sleep(0.1)
        except Exception as e:
            yield f"Error: {str(e)}"

    if "yes" in response.content.lower():
        return StreamingResponse(event_stream(), media_type="text/plain")
    else:
        return "This Topic is not complex enough to be researched about."
