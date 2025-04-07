// app/api/research/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Increase timeout to 60 seconds
export const maxDuration = 60; // for Edge functions in seconds
export const dynamic = 'force-dynamic'; // Disable caching

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  try {
    const body = await request.json();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Starting fetch to external API...");
          
          const response = await fetch('https://autoresearcher.onrender.com/research', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            // Set timeout to 30 seconds
            signal: AbortSignal.timeout(120000) 
          });
          
          console.log("Response status:", response.status);
          
          if (!response.ok) {
            controller.enqueue(encoder.encode(`Error: API returned status ${response.status} ${response.statusText}`));
            controller.close();
            return;
          }
          
          if (!response.body) {
            controller.enqueue(encoder.encode('Error: No response body received from the external API'));
            controller.close();
            return;
          }
          
          const reader = response.body.getReader();
          
          controller.enqueue(encoder.encode('Connected to research API successfully. Generating content...\n\n'));
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const text = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(text));
          }
          
          controller.close();
        } catch (error) {
          console.error("Error in API route:", error);
          if (error instanceof DOMException && error.name === 'AbortError') {
            controller.enqueue(encoder.encode('Error: Request timed out. The external API took too long to respond.'));
          } else {
            controller.enqueue(encoder.encode(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to research API'}`));
          }
          controller.close();
        }
      }
    });
    
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
    
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}