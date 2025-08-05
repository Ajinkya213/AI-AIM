from flask import Blueprint, request, jsonify
from services.query_service import process_query

agent_bp = Blueprint('agent', __name__)

@agent_bp.route("/query/", methods=['POST'])
async def query():
    data = request.get_json()
    query_text = data.get('query', '')
    return await process_query(query_text)