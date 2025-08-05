"""
Agents Module

This module contains the configuration and initialization of CrewAI agents
for multimodal document retrieval and web search capabilities.
"""
from crewai import Agent
from agents.tools import search_web,retrive_from_document
import os
import google.generativeai as genai

# Configure Google Generative AI with API key from environment variables
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the multimodal retrieval agent
agent = Agent(
    role="Multimodal Retrieval Agent",
    goal="Answer queries using local data or fallback to web",
    backstory="You are a research assistant trained in visual document understanding. "
              "Your job is to retrieve relevant pages from internal documents (including the document name and the page number for the document) and fall back to the internet if needed.",
    tools=[search_web,retrive_from_document],# Tools available for the agent to use
    verbose=True,# Enable verbose logging for debugging and monitoring #remove this
    llm='gemini/gemini-2.5-flash' # Use Gemini 2.5 Flash as the underlying language model
)