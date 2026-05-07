# AWS: EC2, S3, RDS, Lambda, IAM, VPC

EC2 provides virtual machines. You manage OS, runtime, scaling, and patching unless using higher-level services.

S3 stores objects, not filesystems. It is durable and useful for assets, backups, logs, and data lakes. Understand buckets, keys, lifecycle policies, and presigned URLs.

RDS provides managed relational databases. It handles backups, patching, replicas, and failover depending on configuration.

Lambda runs functions without managing servers. It is good for event-driven workloads, but watch cold starts, timeouts, package size, and observability.

IAM controls permissions. Apply least privilege. Prefer roles over long-lived access keys.

VPC defines private networking. Subnets, route tables, NAT gateways, security groups, and network ACLs control traffic flow.
