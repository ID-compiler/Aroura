import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('Aroura');
    
    const cart = await db.collection('carts').findOne({
      userId: session.user.email
    });

    return NextResponse.json({ 
      cartItems: cart?.items || [] 
    });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItems } = await request.json();
    const client = await clientPromise;
    const db = client.db('Aroura');
    
    await db.collection('carts').updateOne(
      { userId: session.user.email },
      { 
        $set: { 
          items: cartItems,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
