import streamlit as st
import pandas as pd
import numpy as np
from io import BytesIO

st.set_page_config(layout="wide")

st.title("💼 Business Plan Simulator")

# =========================
# 1️⃣ Candidate Info
# =========================
st.header("1️⃣ Candidate Information")
candidate_name = st.text_input("Candidate Name")
market_covered = st.text_input("Market Covered")

# =========================
# 2️⃣ Input Parameters
# =========================
st.header("2️⃣ Key Parameters")

fte_year1 = st.slider("FTE Months - Year 1", 0, 12, 7)
fte_year2 = st.slider("FTE Months - Year 2", 0, 12, 7)
fte_year3 = st.slider("FTE Months - Year 3", 0, 12, 7)

aum_growth = st.number_input("Expected Annual AUM Growth (%)", 0.0, 100.0, 10.0)
revenue_margin = st.number_input("Revenue Margin (%)", 0.0, 100.0, 0.7)
opex_per_fte = st.number_input("Operating Expense per FTE (CHF)", 0.0, 1e7, 200000.0)

# =========================
# 3️⃣ Compute Business Plan
# =========================
st.header("3️⃣ Business Plan Calculation")

years = ["Year 1", "Year 2", "Year 3"]
fte_months = [fte_year1, fte_year2, fte_year3]
fte_costs = [(m / 12) * opex_per_fte for m in fte_months]
revenues = [fte_cost * (revenue_margin / 100) * (1 + aum_growth / 100) for fte_cost in fte_costs]
profits = [rev - cost for rev, cost in zip(revenues, fte_costs)]

summary_df = pd.DataFrame({
    "Year": years,
    "FTE Months": fte_months,
    "FTE Costs (CHF)": fte_costs,
    "Revenue (CHF)": revenues,
    "Profit (CHF)": profits
})

# ✅ FIX: Format only numeric columns
numeric_cols = summary_df.select_dtypes(include=["float", "int"]).columns
st.subheader("4️⃣ Summary Results (CHF)")
st.dataframe(summary_df.style.format({col: "{:,.2f}" for col in numeric_cols}))

# =========================
# 5️⃣ Export to Excel
# =========================
output = BytesIO()
with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
    summary_df.to_excel(writer, sheet_name="Summary", index=False)
    
    # Candidate info sheet
    info_df = pd.DataFrame({"Candidate Name": [candidate_name], "Market Covered": [market_covered]})
    info_df.to_excel(writer, sheet_name="Inputs", index=False)
    
    # Landscape orientation
    worksheet = writer.sheets["Summary"]
    worksheet.set_landscape()

# Prepare download filename
filename = f"BusinessPlan_{candidate_name.replace(' ', '')}_{market_covered.replace(' ', '')}.xlsx"

st.download_button(
    label="📥 Download Business Plan (Excel)",
    data=output.getvalue(),
    file_name=filename,
    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
)

# =========================
# 6️⃣ Business Plan Clients Breakdown
# =========================
st.header("6️⃣ Business Plan Clients Breakdown")

if "clients" not in st.session_state:
    st.session_state.clients = []

# --- Add client button ---
if st.button("➕ Add Client"):
    st.session_state.clients.append({
        "Client #": len(st.session_state.clients) + 1,
        "Resident": "",
        "Region": "",
        "Overall Asset (M CHF)": 0.0,
        "Base Hypothesis Assets (NNM) (M CHF)": 0.0
    })

# --- Render each client with delete option ---
updated_clients = []
for idx, client in enumerate(st.session_state.clients):
    cols = st.columns([0.5, 1, 1, 1, 1, 0.5])
    
    client_number = cols[0].text_input("Client #", value=client["Client #"], key=f"num_{idx}", disabled=True)
    resident = cols[1].text_input("Resident", value=client["Resident"], key=f"res_{idx}")
    region = cols[2].text_input("Region", value=client["Region"], key=f"reg_{idx}")
    overall_asset = cols[3].number_input("Overall Asset (M CHF)", value=float(client["Overall Asset (M CHF)"]), key=f"oa_{idx}", min_value=0.0)
    base_nnm = cols[4].number_input("Base Hypothesis Assets (NNM) (M CHF)", value=float(client["Base Hypothesis Assets (NNM) (M CHF)"]), key=f"nnm_{idx}", min_value=0.0)
    
    delete = cols[5].button("🗑️", key=f"del_{idx}")
    
    if not delete:
        updated_clients.append({
            "Client #": client_number,
            "Resident": resident,
            "Region": region,
            "Overall Asset (M CHF)": overall_asset,
            "Base Hypothesis Assets (NNM) (M CHF)": base_nnm
        })

st.session_state.clients = updated_clients

# --- Totals ---
if st.session_state.clients:
    df_clients = pd.DataFrame(st.session_state.clients)
    total_overall = df_clients["Overall Asset (M CHF)"].sum()
    total_nnm = df_clients["Base Hypothesis Assets (NNM) (M CHF)"].sum()
    st.markdown(f"**Total in Million:** Overall Assets = {total_overall:.2f} M CHF | NNM = {total_nnm:.2f} M CHF")
else:
    st.info("No clients added yet.")

# --- Clear All Button ---
if st.button("Clear All Clients"):
    st.session_state.clients = []
    st.experimental_rerun()
