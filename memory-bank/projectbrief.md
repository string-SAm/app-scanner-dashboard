# Project Brief: App Scanner Dashboard

## Project Overview
A standalone React dashboard application for visualizing vulnerability analysis JSON files from mobile app security scanners. This is a completely separate project from the main project-management-frontend.

## Core Purpose
- Parse and visualize large vulnerability analysis JSON files (200k+ lines)
- Provide interactive filtering and exploration of security findings
- Display security scores, risk assessments, and detailed findings
- Support multiple app analysis files simultaneously

## Key Requirements
1. **JSON Parser**: Convert raw vulnerability analysis JSON into normalized domain objects
2. **Overview Dashboard**: Security score, charts, top risks, security flags
3. **Findings Explorer**: Filterable table with detailed finding information
4. **File Upload**: Drag-drop interface for uploading JSON files
5. **Multi-app Support**: Handle multiple uploaded analysis files
6. **Export Features**: CSV/JSON export of filtered findings

## Target Users
- Security analysts reviewing mobile app vulnerability reports
- Development teams assessing app security posture
- Compliance teams tracking security findings

## Success Criteria
- Handle large JSON files (200k+ lines) efficiently
- Provide intuitive filtering and search capabilities
- Display clear security metrics and risk indicators
- Enable detailed exploration of individual findings
- Support export of filtered data for reporting

## Technical Constraints
- Must be a standalone React application
- Should handle large datasets without performance issues
- Must parse complex nested JSON structures
- Should provide responsive design for different screen sizes
