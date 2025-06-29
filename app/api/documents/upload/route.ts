import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const agentId = formData.get("agentId") as string

    if (!file || !agentId) {
      return NextResponse.json({ error: "File and agent ID are required" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Save the file to storage (e.g., Vercel Blob, S3)
    // 2. Process the file content
    // 3. Generate embeddings
    // 4. Store chunks in vector database

    // For now, we'll simulate the upload and processing
    const [document] = await sql`
      INSERT INTO documents (agent_id, file_name, file_type, file_size, status)
      VALUES (${agentId}, ${file.name}, ${file.type}, ${file.size}, 'processing')
      RETURNING *
    `

    // Simulate processing delay
    setTimeout(async () => {
      try {
        // Simulate chunk and embedding generation
        const chunks = Math.floor(Math.random() * 50) + 10
        const embeddings = chunks

        await sql`
          UPDATE documents 
          SET status = 'processed', chunks = ${chunks}, embeddings = ${embeddings}, processed_at = NOW()
          WHERE id = ${document.id}
        `
      } catch (error) {
        console.error("Error processing document:", error)
        await sql`
          UPDATE documents 
          SET status = 'error'
          WHERE id = ${document.id}
        `
      }
    }, 2000)

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.file_name,
        fileType: document.file_type,
        fileSize: document.file_size,
        status: document.status,
        uploadedAt: document.uploaded_at,
      },
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get("agentId")

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    }

    const documents = await sql`
      SELECT * FROM documents 
      WHERE agent_id = ${agentId}
      ORDER BY uploaded_at DESC
    `

    return NextResponse.json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc.id,
        fileName: doc.file_name,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        chunks: doc.chunks,
        embeddings: doc.embeddings,
        status: doc.status,
        uploadedAt: doc.uploaded_at,
        processedAt: doc.processed_at,
      })),
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
