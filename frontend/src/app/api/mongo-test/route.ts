import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("admin");
    
    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });
    
    return NextResponse.json(
      { message: "Pinged your deployment. You successfully connected to MongoDB from Next.js!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to connect to MongoDB", details: String(error) },
      { status: 500 }
    );
  }
}
