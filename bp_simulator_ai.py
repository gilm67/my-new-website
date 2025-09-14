import os
import streamlit as st
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

# Optional OpenAI (not required for scoring)
try:
    import openai
except ImportError:
    openai = None

# -------------------- CONFIG -------------------- #
SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

# <<< PUT YOUR REAL SHEET ID HERE >>>
SHEET_ID = "1A__yEhD_0LYQwBF45wTSbWqdkRe0HAdnnBSj70qgpic"

if openai:
    openai.api_key = os.getenv("OPENAI_API_KEY")

# -------------------- GOOGLE SHEETS SETUP -------------------- #
HEADERS = [
    "Timestamp",
    "Candidate Name",
    "Candidate Email",
    "Current Role",
    "Candidate Location",
    "Current Employer",
    "Current Market",
    "Currency",
    "Base Salary",
    "Last Bonus",
    "Current Number of Clients",
    "Current AUM (M CHF)",
    "NNM Year 1 (M CHF)",
    "NNM Year 2 (M CHF)",
    "NNM Year 3 (M CHF)",
    "Projected Clients Year 1",
    "Projected Clients Year 2",
    "Projected Clients Year 3",
    "ROA % Year 1",
    "ROA % Year 2",
    "ROA % Year 3",
    "Revenue Year 1",
    "Revenue Year 2",
    "Revenue Year 3",
    "Fixed Cost",
    "Net Margin Year 1",
    "Net Margin Year 2",
    "Net Margin Year 3",
    "Candidate Fit Score",
]

creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "service_account.json")
sheet_status = "⚠️ Not connected"
sheet = worksheet = None
sheet_error = None

try:
    credentials = Credentials.from_service_account_file(creds_path, scopes=SCOPE)
    gc = gspread.authorize(credentials)
    sheet = gc.open_by_key(SHEET_ID)

    # Ensure worksheet exists
    try:
        worksheet = sheet.worksheet("BP_Entries")
    except gspread.WorksheetNotFound:
        worksheet = sheet.add_worksheet(title="BP_Entries", rows=2000, cols=60)

    # Ensure headers exist (row 1)
    if not worksheet.row_values(1):
        worksheet.append_row(HEADERS)

    sheet_status = "✅ Connected to Google Sheet"
except Exception as e:
    sheet_error = str(e)
    sheet_status = f"⚠️ Could not connect to Google Sheet: {e}"

# -------------------- APP -------------------- #
st.set_page_config(page_title="Business Plan Simulator", layout="wide")
st.markdown("# 📊 Business Plan Simulator")
st.caption(sheet_status)
st.info("*Fields marked with an asterisk (*) are mandatory and handled confidentially.")

# === SECTION 1: Basic Candidate Information ===
with st.container():
    st.markdown("---")
    st.subheader("1️⃣ Basic Candidate Information")
    st.info("Please complete all required fields (*) before proceeding.")

    col1, col2 = st.columns(2)
    with col1:
        candidate_name = st.text_input("Candidate Name")
        candidate_email = st.text_input("Candidate Email *")
        years_experience = st.number_input("Years of Experience *", min_value=0, step=1)
        inherited_book = st.slider("Inherited Book (% of total AUM) *", 0, 100, 0, 1)
        current_role = st.selectbox(
            "Current Role *",
            [
                "Relationship Manager",
                "Senior Relationship Manager",
                "Assistant Relationship Manager",
                "Investment Advisor",
                "Managing Director",
                "Director",
                "Team Head",
                "Market Head",
                "Other",
            ],
        )
        candidate_location = st.selectbox(
            "Candidate Location *",
            [
                "— Select —",
                "Zurich",
                "Geneva",
                "Lausanne",
                "Basel",
                "Luzern",
                "Dubai",
                "London",
                "Hong Kong",
                "Singapore",
                "New York",
                "Miami",
                "Madrid",
                "Lisbon",
                "Sao Paulo",
            ],
        )
    with col2:
        current_employer = st.text_input("Current Employer *")
        current_market = st.selectbox(
            "Current Market *",
            [
                "CH Onshore",
                "UK",
                "Portugal",
                "Spain",
                "Germany",
                "MEA",
                "LATAM",
                "CIS",
                "CEE",
                "France",
                "Benelux",
                "Asia",
                "Argentina",
                "Brazil",
                "Conosur",
                "NRI",
                "India",
                "US",
                "China",
            ],
        )
        currency = st.selectbox("Currency *", ["CHF", "USD", "EUR", "AED", "SGD", "HKD"])
        base_salary = st.number_input(f"Current Base Salary ({currency}) *", min_value=0, step=1000)
        last_bonus = st.number_input(f"Last Bonus ({currency}) *", min_value=0, step=1000)
        current_number_clients = st.number_input("Current Number of Clients *", min_value=0)
        current_assets = st.number_input(
            "Current AUM (M CHF) *", min_value=0.0, step=0.1
        )

# === SECTION 2: Net New Money Projection ===
with st.container():
    st.markdown("---")
    st.subheader("2️⃣ Net New Money Projection over 3 years")
    st.info("Please complete all fields in this section for accurate projections.")

    c1, c2, c3 = st.columns(3)
    with c1:
        nnm_y1 = st.number_input("NNM Year 1 (in M CHF)", min_value=0.0, step=0.1)
    with c2:
        nnm_y2 = st.number_input("NNM Year 2 (in M CHF)", min_value=0.0, step=0.1)
    with c3:
        nnm_y3 = st.number_input("NNM Year 3 (in M CHF)", min_value=0.0, step=0.1)

    d1, d2, d3 = st.columns(3)
    with d1:
        proj_clients_y1 = st.number_input("Projected Clients Year 1", min_value=0)
    with d2:
        proj_clients_y2 = st.number_input("Projected Clients Year 2", min_value=0)
    with d3:
        proj_clients_y3 = st.number_input("Projected Clients Year 3", min_value=0)

# === SECTION 3: Enhanced NNA / Prospects Table (form-based; no Enter/Tab needed) ===
with st.container():
    st.markdown("---")
    st.subheader("3️⃣ Enhanced NNA / Prospects Table")
    st.info(
        "List all clients/prospects; the TOTAL Best Case NNM should match NNM Year 1 for consistency."
    )

    # Session state for prospects and editing
    if "prospects_list" not in st.session_state:
        st.session_state.prospects_list = []  # list of dicts
    if "edit_index" not in st.session_state:
        st.session_state.edit_index = -1  # -1 = create mode

    # CSV upload (optional)
    with st.expander(
        "📥 Import prospects from CSV (columns: Name, Source, Wealth (M), Best NNM (M), Worst NNM (M))"
    ):
        up = st.file_uploader("Upload CSV", type=["csv"])
        if up is not None:
            try:
                df_up = pd.read_csv(up)
                df_up = df_up.rename(columns=lambda x: x.strip())
                needed = [
                    "Name",
                    "Source",
                    "Wealth (M)",
                    "Best NNM (M)",
                    "Worst NNM (M)",
                ]
                for c in needed:
                    if c not in df_up.columns:
                        st.error(f"Missing column in CSV: {c}")
                        df_up = None
                        break
                if df_up is not None:
                    for c in ["Wealth (M)", "Best NNM (M)", "Worst NNM (M)"]:
                        df_up[c] = pd.to_numeric(df_up[c], errors="coerce").fillna(0.0)
                    st.session_state.prospects_list += df_up[needed].to_dict(
                        orient="records"
                    )
                    st.success(f"Imported {len(df_up)} prospects.")
            except Exception as e:
                st.error(f"Import failed: {e}")

    # Prospect form (create/update)
    with st.form(key="prospect_form", clear_on_submit=(st.session_state.edit_index == -1)):
        f1, f2, f3, f4, f5 = st.columns([2, 2, 2, 2, 2])
        with f1:
            p_name = st.text_input(
                "Name",
                value=(
                    ""
                    if st.session_state.edit_index == -1
                    else st.session_state.prospects_list[st.session_state.edit_index]["Name"]
                ),
            )
        with f2:
            options = ["Self Acquired", "Inherited", "Finder"]
            p_source = st.selectbox(
                "Source",
                options,
                index=(
                    0
                    if st.session_state.edit_index == -1
                    else options.index(
                        st.session_state.prospects_list[st.session_state.edit_index][
                            "Source"
                        ]
                    )
                ),
            )
        with f3:
            p_wealth = st.number_input(
                "Wealth (M)",
                min_value=0.0,
                step=0.1,
                value=(
                    0.0
                    if st.session_state.edit_index == -1
                    else float(
                        st.session_state.prospects_list[st.session_state.edit_index][
                            "Wealth (M)"
                        ]
                    )
                ),
            )
        with f4:
            p_best = st.number_input(
                "Best NNM (M)",
                min_value=0.0,
                step=0.1,
                value=(
                    0.0
                    if st.session_state.edit_index == -1
                    else float(
                        st.session_state.prospects_list[st.session_state.edit_index][
                            "Best NNM (M)"
                        ]
                    )
                ),
            )
        with f5:
            p_worst = st.number_input(
                "Worst NNM (M)",
                min_value=0.0,
                step=0.1,
                value=(
                    0.0
                    if st.session_state.edit_index == -1
                    else float(
                        st.session_state.prospects_list[st.session_state.edit_index][
                            "Worst NNM (M)"
                        ]
                    )
                ),
            )

        c_add, c_update, c_cancel = st.columns([1, 1, 1])
        submitted_add = c_add.form_submit_button(
            "➕ Add", disabled=(st.session_state.edit_index != -1)
        )
        submitted_update = c_update.form_submit_button(
            "💾 Update", disabled=(st.session_state.edit_index == -1)
        )
        submitted_cancel = c_cancel.form_submit_button(
            "✖ Cancel Edit", disabled=(st.session_state.edit_index == -1)
        )

    if submitted_add:
        st.session_state.prospects_list.append(
            {
                "Name": p_name.strip(),
                "Source": p_source,
                "Wealth (M)": p_wealth,
                "Best NNM (M)": p_best,
                "Worst NNM (M)": p_worst,
            }
        )
        st.success("Prospect added.")
    if submitted_update:
        idx = st.session_state.edit_index
        st.session_state.prospects_list[idx] = {
            "Name": p_name.strip(),
            "Source": p_source,
            "Wealth (M)": p_wealth,
            "Best NNM (M)": p_best,
            "Worst NNM (M)": p_worst,
        }
        st.session_state.edit_index = -1
        st.success("Prospect updated.")
    if submitted_cancel:
        st.session_state.edit_index = -1
        st.info("Edit cancelled.")

    # Display table rows with Edit/Delete actions and TOTAL
    df_pros = pd.DataFrame(
        st.session_state.prospects_list,
        columns=["Name", "Source", "Wealth (M)", "Best NNM (M)", "Worst NNM (M)"],
    )

    if not df_pros.empty:
        st.write(" ")
        for i, row in df_pros.iterrows():
            colA, colB, colC, colD, colE, colF = st.columns([2, 2, 2, 2, 1, 1])
            colA.write(row["Name"])
            colB.write(row["Source"])
            colC.write(f"{row['Wealth (M)']:,.1f}")
            colD.write(
                f"{row['Best NNM (M)']:,.1f} / {row['Worst NNM (M)']:,.1f}"
            )
            if colE.button("✏️ Edit", key=f"edit_{i}"):
                st.session_state.edit_index = i
                st.rerun()
            if colF.button("🗑 Delete", key=f"del_{i}"):
                del st.session_state.prospects_list[i]
                st.rerun()

    # Summary table with TOTAL styling
    total_row = pd.DataFrame(
        [
            {
                "Name": "TOTAL",
                "Source": "",
                "Wealth (M)": df_pros["Wealth (M)"].sum() if not df_pros.empty else 0.0,
                "Best NNM (M)": df_pros["Best NNM (M)"].sum()
                if not df_pros.empty
                else 0.0,
                "Worst NNM (M)": df_pros["Worst NNM (M)"].sum()
                if not df_pros.empty
                else 0.0,
            }
        ]
    )

    if df_pros.empty:
        df_display = total_row.copy()
    else:
        df_display = pd.concat([df_pros, total_row], ignore_index=True)

    def _highlight_total(row):
        return [
            "background-color: lightblue; font-weight: bold;"
            if (row.name == len(df_display) - 1)
            else ""
            for _ in row
        ]

    st.dataframe(df_display.style.apply(_highlight_total, axis=1), use_container_width=True)

    # Live delta vs NNM Y1
    best_sum = float(df_pros["Best NNM (M)"].sum()) if not df_pros.empty else 0.0
    st.caption(f"Δ Best NNM vs NNM Y1: {best_sum - float(nnm_y1 or 0.0):+.1f} M")

# === SECTION 4: Revenue, Costs & Net Margin Analysis ===
with st.container():
    st.markdown("---")
    st.subheader("4️⃣ Revenue, Costs & Net Margin Analysis")
    st.info("Ensure all inputs above are filled before analysis.")

    roa_cols = st.columns(3)
    roa_y1 = roa_cols[0].number_input("ROA % Year 1", min_value=0.0, value=1.0, step=0.1)
    roa_y2 = roa_cols[1].number_input("ROA % Year 2", min_value=0.0, value=1.0, step=0.1)
    roa_y3 = roa_cols[2].number_input("ROA % Year 3", min_value=0.0, value=1.0, step=0.1)

    # Revenues (from NNM & ROA)
    rev1 = nnm_y1 * roa_y1 / 100 * 1_000_000
    rev2 = nnm_y2 * roa_y2 / 100 * 1_000_000
    rev3 = nnm_y3 * roa_y3 / 100 * 1_000_000

    # Cumulative Gross Revenue
    gross1 = rev1
    gross2 = rev1 + rev2
    gross3 = rev2 + rev3
    gross_total = rev1 + rev2 + rev3

    # Costs & Net Margin
    fixed_cost = base_salary * 1.25
    total_costs = fixed_cost * 3
    nm1 = gross1 - fixed_cost
    nm2 = gross2 - (fixed_cost * 2)
    nm3 = gross3 - total_costs
    nm_total = nm1 + nm2 + nm3

    df_rev = pd.DataFrame(
        {
            "Year": ["Year 1", "Year 2", "Year 3", "Total"],
            "Gross Revenue": [gross1, gross2, gross3, gross_total],
            "Fixed Cost": [fixed_cost, fixed_cost, fixed_cost, total_costs],
            "Net Margin": [nm1, nm2, nm3, nm_total],
        }
    )
    col_table, col_chart = st.columns(2)
    with col_table:
        st.table(
            df_rev.set_index("Year").style.format(
                {
                    "Gross Revenue": "{:,.0f}",
                    "Fixed Cost": "{:,.0f}",
                    "Net Margin": "{:,.0f}",
                }
            )
        )
    with col_chart:
        st.bar_chart(df_rev.set_index("Year")[["Gross Revenue", "Net Margin"]])

# === SECTION 5: AI Candidate Analysis for Recruiter ===
with st.container():
    st.markdown("---")
    st.subheader("5️⃣ AI Candidate Analysis for Recruiter")

    seg_col1, seg_col2 = st.columns(2)
    with seg_col1:
        target_segment = st.selectbox("Target Segment (for thresholds)", ["HNWI", "UHNWI"], index=0)
    with seg_col2:
        tolerance_pct = st.slider("NNM vs Prospects tolerance (%)", 0, 50, 10, 1)

    total_nnm_3y = float(nnm_y1 + nnm_y2 + nnm_y3)
    avg_roa = float((roa_y1 + roa_y2 + roa_y3) / 3)

    # AUM thresholds by market/segment
    if current_market == "CH Onshore":
        aum_min = 200.0  # lower bound of 200–250M expectation
    else:
        aum_min = 200.0 if target_segment == "HNWI" else 300.0

    # 3Y NNM expectations
    nnm_min_3y = 100.0 if target_segment == "HNWI" else 200.0

    # Scoring (10 points total)
    score = 0
    reasons_pos, reasons_neg, flags = [], [], []

    # 1) Experience (2)
    if years_experience >= 7:
        score += 2; reasons_pos.append("Experience ≥7 years in market")
    elif years_experience >= 6:
        score += 1; reasons_pos.append("Experience 6 years")
    else:
        reasons_neg.append("Experience <6 years")

    # 2) Current AUM vs threshold (2)
    if current_assets >= aum_min:
        if current_market == "CH Onshore" and current_assets >= 250:
            score += 2; reasons_pos.append(f"AUM {current_assets}M ≥ target (CH 250M)")
        else:
            score += 2; reasons_pos.append(f"AUM {current_assets}M ≥ minimum {aum_min}M")
    else:
        deficit = max(0.0, aum_min - current_assets)
        reasons_neg.append(f"AUM below minimum by {deficit:.0f}M")

    # 3) Compensation signal (2)
    if base_salary > 200_000 and last_bonus > 100_000:
        score += 2; reasons_pos.append("Comp suggests hunter profile (Base >200k, Bonus >100k)")
    elif base_salary <= 150_000 and last_bonus <= 50_000:
        score -= 1; reasons_neg.append("Low comp suggests inherited/low portability (≤150k/≤50k)")
    else:
        flags.append("Comp neutral – clarify origin of book")

    # 4) ROA quality (2) — ≥1.0% excellent
    if avg_roa >= 1.0:
        score += 2; reasons_pos.append(f"ROA avg {avg_roa:.2f}% ≥ 1.0% (excellent)")
    elif avg_roa >= 0.8:
        score += 1; reasons_pos.append(f"ROA avg {avg_roa:.2f}% ≥ 0.8% (acceptable)")
    else:
        reasons_neg.append(f"ROA avg {avg_roa:.2f}% is low")

    # 5) Client load (1)
    if current_number_clients == 0:
        flags.append("Clients not provided")
    elif current_number_clients > 80:
        reasons_neg.append(f"High client count ({current_number_clients}) – likely low-segment coverage")
    else:
        score += 1; reasons_pos.append("Client load appropriate (≤80)")

    # 6) Prospects consistency vs NNM Y1 (1)
    best_sum_safe = float(best_sum) if best_sum is not None else 0.0
    nnm_y1_val = float(nnm_y1) if nnm_y1 is not None else 0.0
    tol = max(0.0, tolerance_pct) / 100.0
    if nnm_y1_val == 0.0 and best_sum_safe == 0.0:
        flags.append("Prospects & NNM Y1 both zero")
    elif abs(best_sum_safe - nnm_y1_val) <= tol * max(nnm_y1_val, 1e-9):
        score += 1; reasons_pos.append(f"Prospects Best NNM ({best_sum_safe:.1f}M) ≈ NNM Y1 ({nnm_y1_val:.1f}M)")
    else:
        reasons_neg.append(
            f"Prospects Best NNM {best_sum_safe:.1f}M mismatches NNM Y1 {nnm_y1_val:.1f}M (> {tolerance_pct}% dev)"
        )

    # 7) 3Y NNM ambition vs market expectation (2)
    if total_nnm_3y >= nnm_min_3y:
        score += 2; reasons_pos.append(f"3Y NNM {total_nnm_3y:.1f}M ≥ market target {nnm_min_3y:.0f}M ({target_segment})")
    else:
        reasons_neg.append(f"3Y NNM {total_nnm_3y:.1f}M below market target {nnm_min_3y:.0f}M ({target_segment})")

    # Verdict + label used for saving
    if score >= 7:
        traffic_light = "🟢 Strong Candidate"
    elif score >= 4:
        traffic_light = "🟡 Medium Potential"
    else:
        traffic_light = "🔴 Weak Candidate"

    st.subheader(f"Traffic Light: {traffic_light} (score {score}/10)")
    colA, colB, colC = st.columns(3)
    with colA:
        st.markdown("**Positives**")
        if reasons_pos:
            for r in reasons_pos:
                st.markdown(f"- ✅ {r}")
        else:
            st.markdown("- —")
    with colB:
        st.markdown("**Risks / Gaps**")
        if reasons_neg:
            for r in reasons_neg:
                st.markdown(f"- ❌ {r}")
        else:
            st.markdown("- —")
    with colC:
        st.markdown("**Flags / To Clarify**")
        if flags:
            for r in flags:
                st.markdown(f"- ⚠️ {r}")
        else:
            st.markdown("- —")

    # Quick metrics
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("AUM (M)", f"{current_assets:,.0f}")
    with m2:
        st.metric("Avg ROA %", f"{avg_roa:.2f}")
    with m3:
        st.metric("3Y NNM (M)", f"{total_nnm_3y:.1f}")
    with m4:
        st.metric("Clients", f"{int(current_number_clients)}")

# === SECTION 6: Summary & Save Entry ===
with st.container():
    st.markdown("---")
    st.subheader("6️⃣ Summary & Save Entry")

    def _email_valid(e: str) -> bool:
        return isinstance(e, str) and "@" in e and "." in e.split("@")[-1]

    if st.button("Save to Google Sheet"):
        missing = []
        if not _email_valid(candidate_email):
            missing.append("Candidate Email (valid)")
        if candidate_location == "— Select —":
            missing.append("Candidate Location")

        if missing:
            st.error("Please complete the required fields: " + ", ".join(missing))
        elif not worksheet:
            st.warning("⚠️ Google Sheet connection not available.")
        else:
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Use rev1/2/3 and nm1/2/3 computed above
            row = [
                now,
                candidate_name,
                candidate_email,
                current_role,
                candidate_location,
                current_employer,
                current_market,
                currency,
                base_salary,
                last_bonus,
                current_number_clients,
                current_assets,
                nnm_y1,
                nnm_y2,
                nnm_y3,
                proj_clients_y1,
                proj_clients_y2,
                proj_clients_y3,
                roa_y1,
                roa_y2,
                roa_y3,
                rev1,
                rev2,
                rev3,
                fixed_cost,
                nm1,
                nm2,
                nm3,
                traffic_light,  # NEW: Candidate Fit Score
            ]
            worksheet.append_row(row)
            st.success("✅ Entry saved to Google Sheet")