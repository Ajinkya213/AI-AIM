from crewai import Task
from core.rag_singleton import rag
from agents.agents import agent

def build_task(query: str):
    def task_logic(_):
        results = rag.generate_result(query) # Attempt to retrieve information from local documents using RAG
        print(results)
        if results['status'] == 'no_results' or "No relevant information found" in str(results):
            return f"fallback:{query}"
        return results

    return Task(
        description=f"Retrieve info about: {query}",
        expected_output="A response answering the query.",
        agent=agent,# Assign the agent
        steps=[task_logic]# Define the steps
    )