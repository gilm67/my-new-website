import streamlit as st
import pandas as pd
from io import BytesIO

st.set_page_config(page_title="Business Plan 3Y Simulator", layout="wide")
st.title("💼 Business Plan 3-Year Simulator")

st.write("Simulate a 3-year business plan with revenue, costs, and net margin, matching Excel outputs.")

# -----------------------------
# 1️⃣ Candidate Info
# -----------------------------
st.sidebar.header("👤 Candidate Information")
candidate_name = st.sidebar.text_input("Candidate Name", "")
market = st.sidebar.text_input("Market Covered", "")

# -----------------------------
# 2️⃣ Business Inputs
# -----------------------------
st.header("1️⃣ Business Assumptions")

col1, col2, col3 = st.columns(3)
team_size = col1.number_input("Team Size", min_value=1, value=1, step=1)
cum_clients_y1 = col2.number_input("Cumulated Clients Year 1", 0, step=1, value=5)
cum_clients_y2 = col3.number_input("Cumulated Clients Year 2", 0, step=1, value=6)
cum_clients_y3 = st.number_input("Cumulated Clients Year 3", 0, step=1, value=10)

col1, col2, col3 = st.columns(3)
nnm_y1 = col1.number_input("NNM Year 1 (Million)", 0.0, step=0.1, value=100.0)
nnm_y2 = col2.number_input("NNM Year 2 (Million)", 0.0, step=0.1, value=150.0)
nnm_y3 = col3.number_input("NNM Year 3 (Million)", 0.0, step=0.1, value=200.0)

col1, col2, col3 = st.columns(3)
fte_y1 = col1.slider("FTE Months Year 1", 1, 12, 7)
fte_y2 = col2.slider("FTE Months Year 2", 1, 12, 7)
fte_y3 = col3.slider("FTE Months Year 3", 1, 12, 7)

roa_percent = st.number_input("Return on Assets (%)", 0.0, 100.0, value=1.0) / 100

# -----------------------------
# 3️⃣ Cost Structure
# -----------------------------
st.header("2️⃣ Cost Structure (CHF)")

cost_labels = [
    "Annual base salary (Head)",
    "Social charges (25% package)",
    "Personal Training",
    "Marketing Events",
    "Mobile Phone",
    "Travel Expenses",
    "Other General Expenses"
]

defaults = [200_000, 50_000, 0, 0, 0, 0, 0]
cost_inputs = []
cols = st.columns(len(cost_labels))

for i, label in enumerate(cost_labels):
    val = cols[i].number_input(label, min_value=0.0, value=float(defaults[i]), step=100.0)
    cost_inputs.append(val)

total_costs = sum(cost_inputs)

# -----------------------------
# 4️⃣ Calculations (Matching Excel)
# -----------------------------
cum_nnm_y1 = nnm_y1
cum_nnm_y2 = nnm_y1 + nnm_y2
cum_nnm_y3 = nnm_y1 + nnm_y2 + nnm_y3

fte_in_nnm_y1 = nnm_y1 / 12 * fte_y1
fte_in_nnm_y2 = nnm_y2 / 12 * fte_y2 + cum_nnm_y1
fte_in_nnm_y3 = nnm_y3 / 12 * fte_y3 + cum_nnm_y2

# Total Revenue in CHF
total_rev_y1 = fte_in_nnm_y1 * 1_000_000 * roa_percent
total_rev_y2 = fte_in_nnm_y2 * 1_000_000 * roa_percent
total_rev_y3 = fte_in_nnm_y3 * 1_000_000 * roa_percent

# Cumulated Revenue
cum_rev_y1 = total_rev_y1
cum_rev_y2 = total_rev_y1 + total_rev_y2
cum_rev_y3 = total_rev_y2 + total_rev_y3

# Net Margins
net_margin_y1 = total_rev_y1 - total_costs
net_margin_y2 = total_rev_y2 - total_costs
net_margin_y3 = total_rev_y3 - total_costs

cum_net_y1 = net_margin_y1
cum_net_y2 = net_margin_y1 + net_margin_y2
cum_net_y3 = net_margin_y2 + net_margin_y3

# -----------------------------
# 5️⃣ Summary Table
# -----------------------------
summary_df = pd.DataFrame({
    "Year": ["Y1", "Y2", "Y3"],
    "NNM (M)": [nnm_y1, nnm_y2, nnm_y3],
    "Cum NNM (M)": [cum_nnm_y1, cum_nnm_y2, cum_nnm_y3],
    "Revenue CHF": [total_rev_y1, total_rev_y2, total_rev_y3],
    "Cum Revenue CHF": [cum_rev_y1, cum_rev_y2, cum_rev_y3],
    "Net Margin CHF": [net_margin_y1, net_margin_y2, net_margin_y3],
    "Cum Net Margin CHF": [cum_net_y1, cum_net_y2, cum_net_y3],
    "Cum Clients": [cum_clients_y1, cum_clients_y2, cum_clients_y3]
})

st.dataframe(summary_df.style.format("{:,.0f}"))

# -----------------------------
# 6️⃣ Excel Download
# -----------------------------
output = BytesIO()
with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
    summary_df.to_excel(writer, index=False, sheet_name="Summary")
    pd.DataFrame(cost_inputs, index=cost_labels, columns=["Amount"]).to_excel(writer, sheet_name="Costs")

file_name = f"BusinessPlan_{candidate_name}_{market}.xlsx".replace(" ", "_")
st.download_button(
    label="📥 Download 3-Year Plan (Excel)",
    data=output.getvalue(),
    file_name=file_name,
    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
)

st.success("✅ 3-Year Business Plan ready. Adjust inputs to see real-time results!")