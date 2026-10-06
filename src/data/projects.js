// Projects — shown in full on the Projects page and as the works index on Home.
// `github`: repository URL — the "Source code" button only shows when it's set.
// Wrap phrases in **double asterisks** to highlight them.
export const projects = [
  {
    title: 'Multimodal RAG System',
    tagline: 'A retrieval-augmented system for understanding and querying heterogeneous data.',
    problem: [
      'Traditional RAG systems primarily operate on text, which makes them ineffective when information is distributed across multiple modalities such as documents, images, tables, and other structured content.',
      "The challenge was to build a system capable of ingesting heterogeneous information, preserving the relationships between different modalities, and retrieving the most relevant context for a user's query rather than treating every piece of information as isolated text.",
    ],
    solution: [
      "Built a multimodal retrieval pipeline that processes different types of content, converts them into searchable representations, and retrieves relevant information based on the user's query.",
      'The system combines **document processing, multimodal embeddings, vector similarity search, metadata-aware retrieval, and LLM-based generation** to construct context before generating an answer.',
      'The architecture separates ingestion, indexing, retrieval, and generation so that each stage can be independently optimized and extended to support additional modalities.',
    ],
    tags: ['Document processing', 'Multimodal embeddings', 'Vector similarity search', 'Metadata-aware retrieval', 'LLM generation'],
    github: 'https://github.com/Ajaysvasan/multi_model_rag_for_searching',
  },
  {
    title: 'Project Atlas',
    tagline: 'A project-aware, persistent local RAG system for long-running AI-assisted research and engineering.',
    problem: [
      'Most RAG systems treat every conversation as an isolated query and rely primarily on retrieving semantically similar documents.',
      'This becomes problematic for long-running engineering projects where context is continuously accumulated across conversations. Important decisions, previous discussions, project state, and research findings can become fragmented, causing repeated retrieval, context loss, and unnecessary traversal of large knowledge stores.',
      'The goal of Atlas was to build a **persistent, project-aware memory and retrieval system** capable of maintaining context across conversations while keeping retrieval scoped to the relevant project and topic.',
    ],
    solution: [
      'Designed Atlas around a hierarchical memory architecture consisting of **Topic Memory → Project Memory → Conversation Memory**, allowing information to be progressively scoped rather than retrieved from a single global knowledge base.',
      'A **memory mapping layer** acts as a persistent routing index for conversations, allowing Atlas to quickly identify the associated project, topic, and latest project snapshot without repeatedly traversing the underlying memory stores.',
      'The system combines **conversation snapshots, project summaries, structured metadata, vector retrieval, retrieval orchestration, and planner–critique loops** to determine what context is actually required before generating a response.',
      'The architecture is designed around **local-first, persistent memory**, reducing unnecessary context loading while allowing the system to maintain continuity across long-running research and software engineering workflows.',
    ],
    tags: ['Hierarchical memory', 'Memory mapping layer', 'Vector retrieval', 'Retrieval orchestration', 'Planner–critique loops', 'Local-first'],
    github: 'https://github.com/Ajaysvasan/atlas',
  },
]

export const NUMERALS = ['壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖', '拾']
