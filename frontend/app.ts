// Define the types for the API request and response
interface CheckRequest {
  publication_number: string;
  company_name: string;
}

interface CheckResponse {
  infringing_products: {
    name: string;
    claim: string;
    reason: string;
  }[];
}

// Function to send a POST request to the backend
async function checkInfringement(data: CheckRequest): Promise<CheckResponse> {
  const response = await fetch("http://127.0.0.1:8000/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error: ${response.status} - ${errorMessage}`);
  }

  return response.json();
}

// Handle form submission
document.getElementById("infringementForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const patentId = (document.getElementById("patentId") as HTMLInputElement).value;
  const companyName = (document.getElementById("companyName") as HTMLInputElement).value;

  const resultsDiv = document.getElementById("results")!;
  resultsDiv.innerHTML = "Checking infringement...";

  try {
    const requestData: CheckRequest = {
      publication_number: patentId,
      company_name: companyName,
    };

    const response = await checkInfringement(requestData);

    if (response.infringing_products.length > 0) {
      const productsHTML = response.infringing_products
        .map(
          (product) =>
            `<div>
              <strong>Product Name:</strong> ${product.name}<br/>
              <strong>Claim:</strong> ${product.claim}<br/>
              <strong>Reason:</strong> ${product.reason}
            </div><hr/>`
        )
        .join("");
      resultsDiv.innerHTML = `<h3>Potential Infringing Products:</h3>${productsHTML}`;
    } else {
      resultsDiv.innerHTML = "<h3>No infringement detected.</h3>";
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color: red;">${error}</p>`;
  }
});
