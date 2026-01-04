# Observability Demo

Prometheus, Grafana and Alertmanager observability demo.

## Overview

This project demonstrates monitoring and alerting using Prometheus and Grafana.
The monitoring stack runs on a VPS, while the monitored application runs on a
separate host and is scraped remotely.

## Components

- Prometheus
- Grafana
- Alertmanager
- Node Exporter
- cAdvisor
- Sample Node.js application

## Architecture

- Monitoring stack: VPS (Docker Compose)
- Application: Separate host (Docker Desktop, Windows 11)
- Access via Dynamic DNS (DDNS)

## Access

- Application: http://demoappaldin.ddns.net:3000
- Grafana: http://demoappaldinvps.ddns.net:3001
- Prometheus: http://demoappaldinvps.ddns.net:9090
- Alertmanager: http://demoappaldinvps.ddns.net:9093

## Metrics

The application exposes Prometheus metrics for:
- Request count
- Request latency
- In-flight requests

## Alerting

Alerts are triggered on high HTTP 500 error rates and delivered via email.

## Author

Aldin Mujkić
