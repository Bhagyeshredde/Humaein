// src/services/ai.js

// 🔮 AI Prediction on NEW Claims Schema
export function predictClaimOutcome(claim) {
  let prediction = "";
  let riskScore = 0;

  if (!claim.eligibility) {
    prediction = "High Risk of Denial (Ineligible)";
    riskScore += 50;
  }

  if (!claim.priorAuth) {
    riskScore += 15;
  }

  if (claim.scrubbing !== "Passed") {
    riskScore += 20;
  }

  if (!claim.coding || claim.coding === "") {
    prediction = "High Risk of Denial (Missing Coding)";
    riskScore += 40;
  }

  switch (claim.status) {
    case "Approved":
    case "Paid":
      prediction = "Low Risk – Likely Paid";
      break;
    case "Denied":
      prediction = "High Risk – Already Denied";
      break;
    case "Pending":
    case "Resubmitted":
      prediction = "Medium Risk – Requires Attention";
      riskScore += 10;
      break;
  }

  if (claim.remittance === "Not Received" || claim.remittance === "Pending") {
    riskScore += 10;
  }

  if (!prediction) {
    if (riskScore <= 20) {
      prediction = "Low Risk – Likely to be Approved";
    } else if (riskScore <= 50) {
      prediction = "Medium Risk – Monitor Closely";
    } else {
      prediction = "High Risk – Likely Denial";
    }
  }

  return {
    claimId: claim.id,
    patientId: claim.patientId,
    doctorId: claim.doctorId,
    prediction,
    riskScore
  };
}

export function runPredictions(claims) {
  return claims.map(predictClaimOutcome);
}

export async function generateInsights(summary) {
  try {
    const response = await fetch("http://localhost:5000/api/insights", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ summary }),
});


    if (!response.ok) throw new Error("Failed to generate insights");

    const data = await response.json();
    return data.insight; // ✅ return only the string
  } catch (error) {
    console.error("Error generating insights:", error);
    return "⚠️ Unable to generate insights.";
  }
}
