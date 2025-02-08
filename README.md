![Build with Palantir](/_static/github_banner.png)

# Automated Resource Approval Tool (ARAT)  

## Overview  
The **Automated Resource Approval Tool (ARAT)** streamlines the software approval process for defense contractors by leveraging **Palantir Foundry** and **AIP**. This tool automates the review workflow, provides AI-driven recommendations, and enhances decision-making for software request tickets.  

## Features  
- **Automated Ticket Analysis**: Uses **Palantir AIP** to evaluate approval requests and suggest actions to reviewers.  
- **Dynamic Dashboard**: Monitors ticket status, reviewer workload, and approval metrics in real-time.  
- **Approval Workflow Automation**: Implements escalation rules and document generation to reduce manual effort.  
- **Ontology-Based Permissions**: Ensures proper access control by structuring approvals via **ontology roles**.  
- **Scalable Data Schema**: Uses **join tables** to track team-specific software approvals.  

## Architecture  
- **Data Ingestion**: Raw approval request tickets are ingested into **Foundry Pipelines**.  
- **Transformations**: Pipelines consolidate per-team software approvals and prepare structured datasets.  
- **Ontology Mapping**: Software approvals are managed through ontology roles and linked datasets.  
- **AI Integration**: **AIP** analyzes tickets, extracts key details, and suggests approval actions.  

## Tech Stack  
- **Palantir Foundry** (Pipelines, Ontology, Workshop)  
- **Palantir AIP** (LLM-driven recommendations)  

## License  
This project is proprietary and intended for internal use within **Palantir Defense Tech Fellow** initiatives.  
