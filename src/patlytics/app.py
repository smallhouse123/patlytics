from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json

app = FastAPI()

# Load data from JSON files
with open("../../patents.json") as f:
    patents = json.load(f)

with open("../../company_products.json") as f:
    company_products = json.load(f)

# Request model
class CheckRequest(BaseModel):
    patentId: str
    companyName: str

@app.post("/check")
async def check_infringement(data: CheckRequest):
    # Validate patent ID
    if data.patentId not in patents:
        raise HTTPException(status_code=404, detail="Patent ID not found")
    patent_claims = patents[data.patentId]["claims"]

    # Validate company name
    if data.companyName not in company_products:
        raise HTTPException(status_code=404, detail="Company not found")
    products = company_products[data.companyName]["products"]

    # Analyze products for infringement
    infringing_products = []
    for product in products:
        matches = [
            claim for claim in patent_claims if claim in product["summary"]
        ]
        if matches:
            infringing_products.append({
                "name": product["name"],
                "reason": f"Infringes on claims: {', '.join(matches)}",
                "claims": matches,
            })

    # Return top two infringing products
    infringing_products = sorted(
        infringing_products, key=lambda x: len(x["claims"]), reverse=True
    )[:2]

    return {"products": infringing_products}
