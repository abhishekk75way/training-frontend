# Training Frontend

The **Training Frontend** is the web application interface for the Training system. It allows users to interact with courses, training modules, assessments, and reports through an intuitive UI.

At present, the frontend is implemented using **React**. In the future, this repository may also include other implementations such as **React Native** or **Vue**, organized in separate folders.

## Overview

This repository contains the client-side application that communicates with the **Training Backend** services. It focuses on:

- displaying training courses and learning content
- managing user dashboard and progress
- handling assessments and results
- providing responsive and user-friendly UI components

## Current and Future Technology Stacks

### ✔ Current implementation
- **React frontend**
  - Located in the `react/` folder
  - Component-based architecture
  - Integrates with REST APIs from the backend

### Possible future implementation(s)
- **React Native/ Angular / Vue / Other**
  - Will be located in separate folders such as:
    - `react-native/`
    - `angular/`
    - `vue/`
  - Allows flexibility for different teams and technology choices

## Repository Structure (High Level)

```

training-frontend/
├── react/         # React frontend implementation (current)
├── react-native/       # React Native implementation (future - optional)
├── angular/       # Angular implementation (future - optional)
├── vue/           # Vue implementation (future - optional)
└── README.md

```

> Exact folder names may differ based on frameworks used.

## Goals of the Project

- Provide a clean and engaging user interface  
- Act as the client layer for the Training ecosystem  
- Remain modular to support multiple frameworks  
- Scale as new features and UI modules are added  

## High-Level Features

- User authentication and dashboards
- Course listing and enrollment pages
- Training content viewer
- Assessment and result views
- API integration with backend services

## Related Repository

- **Training Backend:** houses service APIs for this frontend

## Maintainer

This project is maintained by **Abhishek (75way)**.

## Note

This README provides a **high-level overview**.

Framework-specific setup and documentation will be placed inside each implementation folder:

- `react/README.md`
- `react-native/README.md`
- `angular/README.md`
- `vue/README.md`
