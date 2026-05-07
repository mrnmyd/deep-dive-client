# AI engineering: RAG, embeddings, vector databases, LangChain basics

Senior full stack interviews increasingly include AI and cloud fundamentals. You do not need to know every tool, but you should understand the architecture and tradeoffs.

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
