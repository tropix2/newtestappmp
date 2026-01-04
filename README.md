# Observability Demo

Prometheus, Grafana and Alertmanager observability demo built for a
Site Reliability Engineer (SRE) technical task.

## Overview

This project demonstrates monitoring, visualization, and alerting using
Prometheus and Grafana in a **distributed setup**.

The monitoring stack runs on a **VPS**, while the monitored application runs on a
**separate host**. Communication between components is done over HTTP using
publicly reachable Dynamic DNS (DDNS) domains.

## Architecture

The setup is intentionally split across two machines.

### VPS – Monitoring Stack

The VPS hosts the entire monitoring and observability stack, deployed using
**Docker Compose**.

Components running on the VPS:

- **Prometheus**
  - Scrapes metrics from the application and exporters
  - Evaluates alert rules
- **Grafana**
  - Visualizes metrics and alert states
  - Provides dashboards for application, host, and container metrics
- **Alertmanager**
  - Receives alerts from Prometheus
  - Sends notifications via email
- **Node Exporter**
  - Exposes host-level metrics from the VPS (CPU, memory, disk, network)
- **cAdvisor**
  - Exposes Docker container metrics from the VPS

All VPS services communicate locally using Docker networking.

### Local Machine – Sample Application

The sample application runs on a **separate machine**:

- Local PC running **Windows 11**
- Deployed using **Docker Desktop**
- Exposed publicly via **Dynamic DNS (DDNS)**

The application:

- Exposes Prometheus-compatible metrics
- Provides a simple frontend UI to generate traffic
- Simulates HTTP 200, 404, and 500 responses

Prometheus running on the VPS scrapes the application metrics remotely.

## Communication Flow

- The application exposes metrics at `/metrics`
- Prometheus (VPS) scrapes:
  - Application metrics via DDNS
  - Node Exporter metrics from the VPS
  - cAdvisor metrics from Docker containers
- Prometheus evaluates alert rules
- Alertmanager receives firing alerts and sends email notifications
- Grafana queries Prometheus to visualize metrics and alert states

## Components

### Prometheus

- Metrics collection and storage
- Alert rule evaluation
- Central data source for Grafana

### Grafana

- Dashboards for:
  - Application metrics
  - Host metrics
  - Container metrics
  - Alert visibility
- Used to observe system behavior in real time

### Alertmanager

- Handles alerts sent by Prometheus
- Groups and routes alerts
- Sends email notifications when alerts fire

### Node Exporter

- Collects host-level metrics from the VPS
- CPU, memory, disk, and network usage

### cAdvisor

- Collects container-level metrics
- CPU, memory, and network usage per container

### Sample Application (Node.js)

- Exposes custom Prometheus metrics
- Tracks:
  - HTTP request count
  - Request latency
  - In-flight requests
- Includes a frontend for traffic and error simulation

## Access

- Application: http://demoappaldin.ddns.net:3000
- Grafana: http://demoappaldinvps.ddns.net:3001
- Prometheus: http://demoappaldinvps.ddns.net:9090
- Alertmanager: http://demoappaldinvps.ddns.net:9093

## Metrics

The application exposes the following Prometheus metrics:

- `app_http_requests_total`
  - Total number of HTTP requests
- `app_http_request_duration_seconds_bucket`
  - Request latency histogram
- `app_http_in_flight_requests`
  - Number of active requests being processed

## Alerting

Alerts are configured to trigger on application error conditions
(e.g. high HTTP 500 error rate).

When an alert fires:

- Prometheus evaluates the rule
- Alertmanager sends an email notification
- Alert status is visible in Grafana

## Requirements Coverage

- Prometheus and Grafana deployed
- Sample application exposing Prometheus metrics
- Application running on a separate host
- At least three custom application metrics
- Dashboards for application and infrastructure
- Alerting rules and notifications
- Docker Compose used for deployment

## Author

Aldin Mujkić
