from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import openai  # Import OpenAI library

# Initialize FastAPI app
app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load JSON data for patents and company products
with open("./patents.json") as f:
    patents = json.load(f)

with open("./company_products.json") as f:
    company_products = json.load(f)

openai.api_key = ""

# Request model
class CheckRequest(BaseModel):
    publication_number: str
    company_name: str

async def analyze_infringement(claim, product_description):
    prompt = f"""
    Compare the following product description and patent claim to detect potential infringement:
    Product Description: "{product_description}"
    Patent Claim: "{claim}"

    Does the product potentially infringe on the claim? If yes, explain why.
    """
    response = openai.ChatCompletion.create(
        model="gpt-3.5", 
        messages=[{"role": "user", "content": prompt}],
    )
    return response["choices"][0]["message"]["content"].strip()

@app.post("/check")
async def check_infringement(data: CheckRequest):
    patent_claims, products = [], []
    for patent in patents:
        if patent["publication_number"] == data.publication_number:
            patent_claims = patent["claims"]

    for company in company_products["companies"]:
        if company["name"] == data.company_name:
            products = company["products"]

    # Analyze products for infringement
    infringing_products = []
    for product in products:
        product_name = product["name"]
        product_description = product["description"]

        # Use OpenAI to analyze each claim
        for claim in patent_claims:
            analysis_result = await analyze_infringement(claim, product_description)
            if "Yes" in analysis_result:
                infringing_products.append({
                    "name": product_name,
                    "claim": claim,
                    "reason": analysis_result,
                })

    infringing_products = infringing_products[:2]

    return {"infringing_products": infringing_products}
