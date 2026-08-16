export interface ChatResponse {
  message:     string
  citations: ChatResponseCitation[]
}

export interface ChatResponseCitation {
  chunkId: string
  fileId: string
}