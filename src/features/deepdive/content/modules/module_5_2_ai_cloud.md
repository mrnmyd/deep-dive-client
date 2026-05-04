# AI & Emerging Tech

Senior full stack interviews increasingly include AI and cloud fundamentals. You do not need to know every tool, but you should understand the architecture and tradeoffs.

## AI engineering: RAG, embeddings, vector databases, LangChain basics

Retrieval-Augmented Generation combines search with generation. Instead of asking an LLM to rely only on training data, the system retrieves relevant documents and includes them in the prompt.

Embeddings convert text into vectors where semantic similarity becomes distance. Chunking matters: chunks that are too small lose context; chunks that are too large reduce retrieval precision.

Vector databases store embeddings and support similarity search. Pinecone, pgvector, Weaviate, and Milvus are common options. Production systems also need metadata filtering, access control, re-indexing, and evaluation.

A basic RAG pipeline:

- Load documents.
- Split into chunks.
- Embed chunks.
- Store vectors with metadata.
- Retrieve relevant chunks for a query.
- Generate an answer grounded in retrieved context.

LangChain provides abstractions for models, retrievers, tools, and chains. It can speed prototyping but should not replace understanding the actual data flow.

## AWS: EC2, S3, RDS, Lambda, IAM, VPC

EC2 provides virtual machines. You manage OS, runtime, scaling, and patching unless using higher-level services.

S3 stores objects, not filesystems. It is durable and useful for assets, backups, logs, and data lakes. Understand buckets, keys, lifecycle policies, and presigned URLs.

RDS provides managed relational databases. It handles backups, patching, replicas, and failover depending on configuration.

Lambda runs functions without managing servers. It is good for event-driven workloads, but watch cold starts, timeouts, package size, and observability.

IAM controls permissions. Apply least privilege. Prefer roles over long-lived access keys.

VPC defines private networking. Subnets, route tables, NAT gateways, security groups, and network ACLs control traffic flow.
