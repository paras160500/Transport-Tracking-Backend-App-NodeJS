<div align="center">

# 🚕 OLA MASRAG Data Agent

### Multi-Agent Analytics Workspace for Ride-Hailing Data

*Ask a question in plain English. Get SQL insights or a completed ETL job — automatically routed to the right specialist agent.*

[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit-FF4B4B?logo=streamlit&logoColor=white)](https://streamlit.io/)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-1C3C3C)](https://langchain-ai.github.io/langgraph/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)
[![Status](https://img.shields.io/badge/Status-Active%20development-F2B84B)](https://github.com/paras160500/OLA-Data-Agent---MASRAG-Agentic-AI)

</div>

![Architecture Diagram](diagram.png)

---

## ✨ Overview

**OLA MASRAG Data Agent** is an agentic data assistant built for ride-hailing analytics. Type a request into the Streamlit UI, and a router agent classifies it and hands it off to the right specialist:

- 🧮 **SQL Analyst** — turns business questions into schema-aware, safety-checked SQL and readable answers
- 🛠️ **ETL Analyst** — handles file transformations and data-prep work using a tool-calling agent

No SQL required. No manual coordination between steps. Just describe what you need.

> 💡 **Example:** *"Find the top five drivers by revenue from completed rides in 2026"* → routed to the **SQL Analyst**
> *"Filter `data/rides.csv` to completed rides and save a new CSV"* → routed to the **ETL Analyst**

---

## 🧭 What the project does

| Request type | Responsible agent | Typical output |
|---|---|---|
| 📊 Business questions over relational data | **SQL Analyst** | Natural-language answer + generated SQL + execution details |
| 🗂️ File transformations & data preparation | **ETL Analyst** | Tool-driven transformation response + output file |

The routing decision is made entirely by an LLM-backed classifier — the user never has to pick an agent manually.

---

## 🌟 Highlights

| | |
|---|---|
| 🗣️ **Natural-language analytics** | Ask operational questions without writing a line of SQL |
| 🧠 **Multi-agent orchestration** | A dedicated router sends each request to the right specialist |
| 🔍 **Schema-aware SQL generation** | Inspects live PostgreSQL tables, columns, types & sample rows before generating queries |
| 🛡️ **SQL safety gate** | Every generated query is reviewed before execution; unsafe requests are cancelled |
| 📝 **Human-readable answers** | Query results are summarized into concise, business-friendly language |
| 🔧 **ETL tool routing** | File-transformation requests are handled by a separate tool-using analyst |
| 🖥️ **Interactive Streamlit workspace** | Full visibility into the route taken, generated SQL, execution output, and safety review |
| 📁 **Local-first data layout** | Ships with realistic OLA-style CSVs for users, vehicles, rides, payments & ratings |

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U[User] --> UI[Streamlit UI\nstreamlit_app.py]
    UI --> DA[Data Agent\nrouter graph]
    DA --> R{Request type?}
    R -->|SQL analytics| SQL[SQL Analyst]
    R -->|File transformation| ETL[ETL Analyst]
    SQL --> DB[(PostgreSQL\npublic schema)]
    SQL --> LLM[LLM provider]
    ETL --> TOOLS[ETL tools]
    ETL --> FILES[(CSV files)]
    SQL --> ANSWER[Answer + SQL + execution details]
    ETL --> ETLANSWER[Transformation response]
    ANSWER --> UI
    ETLANSWER --> UI
```

### Component responsibilities

| Component | Location | Responsibility |
|---|---|---|
| 🖥️ Streamlit UI | `streamlit_app.py` | Provides the user-facing analytics workspace |
| 🧭 Data Agent | `agents/data_agent.py` | Classifies the request and selects the specialist graph |
| 🧮 SQL Analyst | `agents/sql_analyst.py` | Curates questions, generates SQL, judges safety, executes queries, writes answers |
| 🛠️ ETL Analyst | `agents/etl_analyst.py` | Interprets transformation requests and invokes ETL tools |
| 🗄️ Database utility | `utils/database.py` | Connects to PostgreSQL, inspects schema metadata, executes SQL |
| 🔧 ETL tools | `utils/etl_tools.py` | Supplies file and transformation operations to the ETL graph |
| 🤖 LLM selector | `utils/llm_pick.py` | Selects the configured model by task complexity |
| 📦 State models | `models/schema.py` | Defines the Pydantic state passed through the graphs |

---

## 🔄 Agent workflows

<details>
<summary><strong>1️⃣ Request routing workflow</strong></summary>

Every request enters the Data Agent as a `HumanMessage`. The router classifies it as either `sql` or `etl`, then sends it to the corresponding graph.

```mermaid
flowchart TD
    START([User request]) --> MESSAGE[Create HumanMessage]
    MESSAGE --> ROUTER[Router node]
    ROUTER --> CLASSIFY{RouterSchema.answer}
    CLASSIFY -->|sql| SQLNODE[SQL Analyst node]
    CLASSIFY -->|etl| ETLNODE[ETL Analyst node]
    SQLNODE --> END1([Return DataAgentSchema])
    ETLNODE --> END2([Return DataAgentSchema])
```

</details>

<details>
<summary><strong>2️⃣ SQL Analyst workflow</strong></summary>

The SQL path separates question refinement, context construction, SQL generation, safety review, execution, and final answer generation.

```mermaid
flowchart TD
    Q([Natural-language question]) --> CURATE[Curate question]
    CURATE --> CONTEXT[Build prompt with PostgreSQL schema]
    CONTEXT --> GENERATE[Generate PostgreSQL SQL]
    GENERATE --> JUDGE[Safety judge]
    JUDGE --> SAFE{Is the SQL safe?}
    SAFE -->|Yes| EXECUTE[Execute read query]
    SAFE -->|No| CANCEL[Cancel execution\nreturn safety explanation]
    EXECUTE --> REPRESENT[Represent result for user]
    REPRESENT --> OUT([Final answer])
    CANCEL --> OUT
```

</details>

<details>
<summary><strong>3️⃣ SQL request sequence</strong></summary>

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Streamlit UI
    participant DA as Data Agent
    participant SQL as SQL Analyst
    participant LLM as LLM provider
    participant DBU as DatabaseUtil
    participant PG as PostgreSQL

    User->>UI: Submit natural-language question
    UI->>DA: invoke(messages, route_response)
    DA->>LLM: Classify request
    LLM-->>DA: sql
    DA->>SQL: invoke SQL state
    SQL->>LLM: Curate question
    LLM-->>SQL: Curated question
    SQL->>DBU: schema_details(public)
    DBU->>PG: Read tables, columns, sample rows
    PG-->>DBU: Schema context
    DBU-->>SQL: Schema context
    SQL->>LLM: Generate SQL from question + schema
    LLM-->>SQL: SQL query
    SQL->>LLM: Judge query safety
    LLM-->>SQL: Yes / No + comments
    alt Safe query
        SQL->>DBU: execute_sql(query)
        DBU->>PG: Execute read query
        PG-->>DBU: Result rows
        DBU-->>SQL: Execution result
        SQL->>LLM: Write final answer
        LLM-->>SQL: Business-readable answer
    else Unsafe query
        SQL-->>SQL: Cancel execution
    end
    SQL-->>DA: Analyst state
    DA-->>UI: Answer + generated SQL + metadata
    UI-->>User: Render result
```

</details>

<details>
<summary><strong>4️⃣ ETL workflow</strong></summary>

The ETL Analyst is implemented as a tool-using graph. The LLM decides when a transformation tool is needed, the tool executes the operation, and the graph returns the result to the UI.

```mermaid
flowchart LR
    REQUEST[ETL request] --> ETLSTART[ETL Analyst]
    ETLSTART --> PLAN[Interpret transformation]
    PLAN --> TOOLS{Tool required?}
    TOOLS -->|Yes| CALL[Invoke ETL tool]
    CALL --> INPUT[(Input CSV / file)]
    INPUT --> TRANSFORM[Transform data]
    TRANSFORM --> OUTPUT[(Output CSV / file)]
    OUTPUT --> REPORT[Report operation]
    TOOLS -->|No| REPORT
    REPORT --> DONE([Return response])
```

</details>

---

## 🗃️ Data model

The included datasets represent a normalized ride-hailing domain. The database-loading workflow creates corresponding PostgreSQL tables in the `public` schema.

```mermaid
erDiagram
    USERS ||--o{ RIDES : requests
    USERS ||--o{ PAYMENTS : makes
    RIDES ||--o{ PAYMENTS : has
    RIDES ||--o{ RATINGS : receives
    USERS ||--o{ RATINGS : writes
    VEHICLES }o--|| USERS : assigned_to
    USERS {
        int user_id PK
        string first_name
        string last_name
        string email
        string city
        string province
        string user_type
        date signup_date
        boolean is_active
    }
    VEHICLES {
        int vehicle_id PK
        int driver_id FK
        string make
        string model
        int year
        string license_plate
        boolean is_active
    }
    RIDES {
        int ride_id PK
        int rider_id FK
        int driver_id FK
        timestamp requested_at
        timestamp pickup_time
        timestamp dropoff_time
        decimal distance_km
        decimal fare
        decimal surge_multiplier
        string status
        string cancellation_reason
    }
    PAYMENTS {
        int payment_id PK
        int ride_id FK
        int user_id FK
        decimal amount
        string payment_method
        string payment_status
        timestamp payment_time
    }
    RATINGS {
        int rating_id PK
        int ride_id FK
        int rider_id FK
        int driver_id FK
        decimal rating
        string comment
        timestamp rated_at
    }
```

### Included source files

| File | Domain |
|---|---|
| `data/users.csv` | Rider and driver user records |
| `data/vehicles.csv` | Driver vehicle records |
| `data/rides.csv` | Ride lifecycle, fare, distance, and status |
| `data/payments.csv` | Ride payments and transaction status |
| `data/ratings.csv` | Ride ratings and comments |

---

## 📂 Repository structure

```
OLA-Data-Agent---MASRAG-Agentic-AI/
├── agents/
│   ├── data_agent.py          # Router graph
│   ├── etl_analyst.py         # ETL specialist graph
│   ├── sql_analyst.py         # SQL specialist graph
│   └── scratch.py             # Development scratchpad
├── data/
│   ├── payments.csv
│   ├── ratings.csv
│   ├── rides.csv
│   ├── users.csv
│   └── vehicles.csv
├── models/
│   └── schema.py              # Pydantic graph states
├── utils/
│   ├── database.py            # PostgreSQL access and schema inspection
│   ├── etl_tools.py           # ETL tools
│   ├── feed_db.py             # Database loading script
│   └── llm_pick.py            # LLM selection
├── streamlit_app.py           # User-facing application
├── main.py                    # Existing backend/database entry point
├── requirements-streamlit.txt # Runtime dependencies for the UI
├── pyproject.toml
└── README.md
```

---

## 🚀 Getting started

### Prerequisites

| Requirement | Recommended version | Purpose |
|---|---|---|
| 🐍 Python | 3.12+ | Application runtime |
| 🐘 PostgreSQL | 14+ | SQL Analyst database |
| 🔑 OpenAI-compatible API access | Configured key | Routing, SQL generation, judging, and answer generation |
| 🌳 Git | Current stable release | Repository management |

### 1. Clone the repository

```bash
git clone https://github.com/paras160500/OLA-Data-Agent---MASRAG-Agentic-AI.git
cd OLA-Data-Agent---MASRAG-Agentic-AI
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements-streamlit.txt
```

### 4. Configure the model API key

Create a `.env` file in the repository root:

```env
OPENAI_API=your_api_key_here
```

> The application also accepts `OPENAI_API_KEY` as an environment variable and maps it to the repository's `OPENAI_API` convention when necessary.

### 5. Prepare PostgreSQL

Create a PostgreSQL database and load the included CSVs using the project's database-loading workflow. The SQL Analyst and database utility currently target a local PostgreSQL instance using the `postgres` database and `public` schema.

Before running the app, verify connection settings in:

```
agents/sql_analyst.py
utils/database.py
```

---

## ▶️ Running the application

```bash
streamlit run streamlit_app.py
```

The interface provides:

- ✅ A natural-language request form
- ✅ Automatic SQL-versus-ETL routing
- ✅ A formatted answer area
- ✅ A visible generated SQL code block for SQL requests
- ✅ An expandable analyst trace with execution results and safety comments
- ✅ Starter prompts for common OLA analytics tasks

```mermaid
flowchart LR
    OPEN[Open browser] --> FORM[Enter analyst brief]
    FORM --> SUBMIT[Click Analyze]
    SUBMIT --> ROUTE[Automatic route]
    ROUTE --> SQLRESULT[SQL answer + code block]
    ROUTE --> ETLRESULT[ETL transformation response]
    SQLRESULT --> TRACE[Inspect analyst trace]
    ETLRESULT --> TRACE
    TRACE --> NEW[Start another brief]
    NEW --> FORM
```

---

## 💬 Example prompts

### 📊 SQL analytics

```text
For rides requested in 2026, find the top 5 drivers by total revenue from
completed rides. Show driver ID, completed rides, total revenue, average
fare, average rating, total distance, and cancellation rate.
```

```text
How many completed rides were requested in 2026?
```

```text
What are the average fares by city and user type?
```

### 🛠️ ETL operations

```text
Transform data/payments.csv and save the result as a CSV.
```

```text
Filter data/rides.csv to completed rides and save the transformed file
in the output folder.
```

> 💡 **Tip:** For best results, include the input path, transformation rule, desired output location, and output format.

---

## ⚙️ Configuration

### Model selection

`utils/llm_pick.py` maps task levels to configured model names:

| Level | Intended use |
|---|---|
| `low` | Question curation and final answer writing |
| `medium` | Routing, SQL generation, and SQL safety review |
| `high` | Reserved for higher-complexity tasks |
| `reason` | Reserved for reasoning-oriented tasks |

Adjust these mappings in one place when changing providers or model names.

### Database connection

```python
{
    "host": "localhost",
    "port": 5432,
    "database": "postgres",
    "user": "postgres",
    "password": "<your-password>",
}
```

> ⚠️ For production use, move these values to environment variables or a secrets manager.

---

## 🗄️ Database setup

```mermaid
flowchart TD
    CSV[data/*.csv] --> LOAD[Database loading workflow]
    LOAD --> TABLES[(PostgreSQL public schema)]
    TABLES --> INSPECT[Schema inspection]
    INSPECT --> PROMPT[Schema-grounded SQL prompt]
    PROMPT --> QUERY[Generated read query]
    QUERY --> REVIEW[Safety review]
    REVIEW --> EXECUTE[Execution]
```

The schema inspection step matters because it gives the SQL Analyst database-specific context instead of relying only on hard-coded assumptions.

---

## 🔐 Security and operational notes

The SQL Analyst includes an LLM-based safety judge intended to block data-modifying statements such as `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, and `CREATE`. **This is defense-in-depth, not a complete database security boundary.**

For production deployment:

| Area | Recommendation |
|---|---|
| 🔑 Database permissions | Use a dedicated read-only database role for analytics |
| 🔒 Secrets | Store API and database credentials in environment variables or a secrets manager |
| ✅ SQL validation | Add deterministic SQL parsing and an explicit read-only transaction policy |
| ⏱️ Query limits | Enforce statement timeouts and result-size limits |
| 📈 Observability | Log route, latency, query status, and errors — never log secrets |
| 🕵️ Data privacy | Mask or restrict PII before exposing it to an LLM |
| 🌐 Production deployment | Place PostgreSQL behind network controls and use TLS where applicable |

> 🚨 **Important:** Do not commit real API keys or database passwords to the repository. The current source contains local-development connection defaults that must be replaced before public or production deployment.

---

## 🧯 Troubleshooting

<details>
<summary><strong>Streamlit cannot import <code>agents</code></strong></summary>

Run Streamlit from the repository root:

```bash
streamlit run streamlit_app.py
```

The application also adds its repository root to `sys.path`, which supports launching it from another working directory.

</details>

<details>
<summary><strong>The application reports a missing API key</strong></summary>

Confirm that `.env` exists in the repository root and contains:

```env
OPENAI_API=your_api_key_here
```

</details>

<details>
<summary><strong>PostgreSQL connection fails</strong></summary>

Confirm that PostgreSQL is running, the database exists, the `public` tables are loaded, and the connection settings in the SQL Analyst match your local environment.

</details>

<details>
<summary><strong>The request is routed incorrectly</strong></summary>

Use explicit language:
- For **SQL**, mention "query", "average", "count", "top drivers", or "SQL"
- For **ETL**, mention "transform", "filter", "clean", "save CSV", or a file path

</details>

<details>
<summary><strong>SQL is cancelled</strong></summary>

Inspect the analyst trace in the Streamlit UI — the safety judge comments explain why the generated query was not executed.

</details>

---

## 🛣️ Roadmap

- [ ] Replace hard-coded database credentials with environment-based configuration
- [ ] Add deterministic SQL parsing and a read-only database role
- [ ] Add automated tests for router decisions, SQL safety, and database utilities
- [ ] Return structured tabular results instead of stringified tuples
- [ ] Add downloadable CSV and JSON exports in the Streamlit interface
- [ ] Add query history and trace identifiers for reproducibility
- [ ] Add data-quality checks before ETL transformations
- [ ] Add containerized deployment with health checks
- [ ] Add evaluation datasets for routing accuracy and SQL correctness

---

## 📚 References

- [Python][1] — official website
- [Streamlit][2] — documentation
- [LangGraph][3] — documentation
- [PostgreSQL][4] — documentation
- [Mermaid][5] — diagramming documentation
- [OLA MASRAG Data Agent][6] — repository

[1]: https://www.python.org/ "Python official website"
[2]: https://docs.streamlit.io/ "Streamlit documentation"
[3]: https://langchain-ai.github.io/langgraph/ "LangGraph documentation"
[4]: https://www.postgresql.org/docs/ "PostgreSQL documentation"
[5]: https://mermaid.js.org/ "Mermaid diagramming documentation"
[6]: https://github.com/paras160500/OLA-Data-Agent---MASRAG-Agentic-AI "OLA MASRAG Data Agent repository"

---

<div align="center">

Made with 🚕 for smarter ride-hailing analytics

</div>
