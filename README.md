Observability Stack – SRE Demo

This repository demonstrates a practical observability setup built from a Site Reliability Engineering (SRE) perspective using Prometheus, Grafana, Alertmanager, and a custom instrumented application.

The focus is on application metrics, infrastructure visibility, and alerting, implemented in a realistic distributed setup.

🧱 Architecture Overview

This demo intentionally runs components on separate hosts to reflect real-world environments.

🖥️ Monitoring Stack (VPS – Docker Compose)

Deployed on a Linux VPS using Docker Compose:

Prometheus – metrics collection and alert rule evaluation

Grafana – dashboards and alert visualization

Alertmanager – alert routing and email notifications

Node Exporter – host-level metrics (CPU, memory, network)

cAdvisor – container-level metrics

Each service is exposed via its own port and reachable through a DDNS domain.

💻 Sample Application (Local PC)

The sample application runs locally on a separate machine (Windows 11) using Docker Desktop.

Exposed publicly using Dynamic DNS (DDNS)

Monitored remotely by Prometheus running on the VPS

Simulates application behaviour and failures through a frontend UI

This satisfies the requirement of monitoring an application running on a separate host.

🌐 Networking & Access
Component	Location	Access
Application	Local PC	http://demoappaldin.ddns.net:3000
Prometheus	VPS	http://demoappaldinvps.ddns.net:9090
Grafana	VPS	http://demoappaldinvps.ddns.net:3001
Alertmanager	VPS	http://demoappaldinvps.ddns.net:9093


